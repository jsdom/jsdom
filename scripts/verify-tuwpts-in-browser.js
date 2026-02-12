#!/usr/bin/env node
"use strict";

// Serves to-upstream WPT tests for verification in a real browser, using the WPT Python server
// (for .py handlers, .any.js generation, etc.) with a Node.js proxy in front for the runner UI
// and result collection.
//
// Requires the web-platform.test hosts entry; see
// https://web-platform-tests.org/running-tests/from-local-system.html#system-setup
//
// Usage:
//   node scripts/verify-tuwpts-in-browser.js [--browser=chrome] [filter ...]
//
// Filters are substring matches against test paths. Without filters, all to-upstream tests are
// included. Use --browser (-b) to specify a browser command; otherwise opens the default browser.

/* eslint-disable no-console */

const http = require("node:http");
const { readFile } = require("node:fs/promises");
const { resolve, join, extname } = require("node:path");
const { parseArgs } = require("node:util");
const opener = require("opener");

const wptDir = resolve(__dirname, "../test/web-platform-tests");
const testsDir = resolve(wptDir, "tests");
const toUpstreamDir = resolve(wptDir, "to-upstream");

const wptServer = require("../test/web-platform-tests/wpt-server.js");
const { killSubprocess } = require("../test/web-platform-tests/utils.js");
const { regenerateManifest, getPossibleTestFilePaths } = require("../test/web-platform-tests/wpt-manifest-utils.js");

// --- Custom testharnessreport.js ---
// Notifies the runner page (opener window) of test completion via postMessage.

const customReporter = `\
"use strict";
add_completion_callback((tests, status) => {
  if (!window.opener) {
    return;
  }
  const results = {
    test: location.pathname,
    status: status.status,
    message: status.message || null,
    subtests: tests.map(t => ({ name: t.name, status: t.status, message: t.message || null }))
  };
  window.opener.postMessage({ type: "wpt-complete", results }, "*");
});
`;

// --- Runner page ---

function generateRunnerHTML(testList) {
  return `<!DOCTYPE html>
<meta charset="utf-8">
<title>WPT Browser Verification (${testList.length} tests)</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 1em; }
  #progress { font-size: 1.2em; margin-bottom: 1em; }
  .result { margin: 2px 0; font-family: monospace; font-size: 0.9em; }
  .pass { color: green; }
  .fail { color: red; }
  .subtest { margin-left: 2em; color: #666; }
  #summary { font-size: 1.2em; font-weight: bold; margin-top: 1em; padding: 0.5em; }
  #summary.pass { background: #dfd; }
  #summary.fail { background: #fdd; }
</style>

<div id="progress">Starting...</div>
<div id="results"></div>
<div id="summary" hidden></div>

<script>
"use strict";
const tests = ${JSON.stringify(testList)};
let current = 0;
let passCount = 0;
let failCount = 0;
const TIMEOUT_MS = 30000;
let timer = null;

const progress = document.getElementById("progress");
const resultsDiv = document.getElementById("results");
const summaryDiv = document.getElementById("summary");
let testWindow = null;

function reportToServer(data) {
  fetch("/__report__", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

window.addEventListener("message", e => {
  if (e.data && e.data.type === "wpt-complete" && e.data.results.test === tests[current]) {
    clearTimeout(timer);
    showResult(e.data.results);
    reportToServer(e.data.results);
    advance();
  }
});

function showResult(data) {
  const statusNames = ["PASS", "FAIL", "TIMEOUT", "NOTRUN", "PRECONDITION_FAILED"];
  const passed = data.subtests.filter(t => t.status === 0).length;
  const total = data.subtests.length;
  const allPass = passed === total && data.status === 0;

  const div = document.createElement("div");
  div.className = "result " + (allPass ? "pass" : "fail");
  div.textContent = (allPass ? "PASS" : "FAIL") + " " + data.test + " (" + passed + "/" + total + ")";

  if (!allPass) {
    for (const t of data.subtests) {
      if (t.status !== 0) {
        const sub = document.createElement("div");
        sub.className = "subtest";
        sub.textContent = (statusNames[t.status] || "?") + ": " + t.name;
        div.appendChild(sub);
      }
    }
    failCount++;
  } else {
    passCount++;
  }

  resultsDiv.appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function advance() {
  current++;
  if (current < tests.length) {
    runNext();
  } else {
    showSummary();
  }
}

function runNext() {
  progress.textContent = \`Running \${current + 1}/\${tests.length}: \${tests[current]}\`;
  testWindow?.close();
  testWindow = window.open(tests[current]);
  timer = setTimeout(() => {
    const timeoutResult = {
      test: tests[current],
      status: 2,
      message: "Timed out",
      subtests: [{ name: "(entire test)", status: 2, message: "Timed out after " + (TIMEOUT_MS / 1000) + "s" }]
    };
    showResult(timeoutResult);
    reportToServer(timeoutResult);
    advance();
  }, TIMEOUT_MS);
}

function showSummary() {
  progress.textContent = "Done!";
  testWindow?.close();
  summaryDiv.hidden = false;
  summaryDiv.className = failCount === 0 ? "pass" : "fail";
  summaryDiv.textContent = passCount + " passed, " + failCount + " failed out of " + tests.length + " tests";
}

runNext();
</script>`;
}

// --- MIME types ---

const MIME = {
  ".html": "text/html",
  ".htm": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".xml": "application/xml",
  ".xht": "application/xhtml+xml",
  ".xhtml": "application/xhtml+xml"
};

// --- Helpers ---

function serveFile(res, content, pathname) {
  const mime = MIME[extname(pathname)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  res.end(content);
}

async function tryReadFile(filePath) {
  try {
    return await readFile(filePath);
  } catch (e) {
    if (e.code === "ENOENT") {
      return undefined;
    }
    throw e;
  }
}

// --- Main ---

async function main() {
  // Regenerate the manifest (cheap since we have few files) and read test paths from it.
  const manifest = regenerateManifest(toUpstreamDir, resolve(wptDir, "tuwpt-manifest.json"));
  const testPaths = getPossibleTestFilePaths(manifest).map(p => "/" + p);

  const { values: { browser }, positionals: filters } = parseArgs({
    allowPositionals: true,
    options: {
      browser: { type: "string", short: "b" }
    }
  });
  const filtered = filters.length > 0 ?
    testPaths.filter(p => filters.some(f => p.includes(f))) :
    testPaths;

  if (filtered.length === 0) {
    console.error("No tests found" + (filters.length ? ` matching: ${filters.join(", ")}` : ""));
    process.exit(1);
  }

  console.log(`Found ${filtered.length} test(s) to verify\n`);

  // Start WPT server
  console.log("Starting WPT server...");
  const { urls, subprocess: wptProcess } = await wptServer.start({ toUpstream: true });
  const wptOrigin = new URL(urls[0]);
  console.log(`WPT server ready at ${wptOrigin.href}\n`);

  // Results tracking
  const results = new Map();
  const TEST_PASS = 0;
  const HARNESS_OK = 0;

  function printResult(data) {
    const statusNames = ["PASS", "FAIL", "TIMEOUT", "NOTRUN", "PRECONDITION_FAILED"];
    const passed = data.subtests.filter(t => t.status === TEST_PASS).length;
    const total = data.subtests.length;
    const allPass = passed === total && data.status === HARNESS_OK;

    console.log(`${allPass ? "PASS" : "FAIL"} ${data.test} (${passed}/${total})`);
    for (const t of data.subtests) {
      if (t.status !== TEST_PASS) {
        console.log(`  ${statusNames[t.status] || "UNKNOWN"}: ${t.name}`);
        if (t.message) {
          console.log(`    ${t.message.split("\n")[0]}`);
        }
      }
    }
  }

  function printSummary() {
    console.log("\n--- Summary ---");
    let passCount = 0;
    let failCount = 0;
    for (const [, data] of results) {
      const passed = data.subtests.filter(t => t.status === TEST_PASS).length;
      if (passed === data.subtests.length && data.status === HARNESS_OK) {
        passCount++;
      } else {
        failCount++;
      }
    }
    const missing = filtered.length - results.size;
    console.log(`${passCount} passed, ${failCount} failed` + (missing ? `, ${missing} not run` : ""));
  }

  // Proxy server
  // Routes:
  //   /                              -> runner page
  //   /__report__                    -> result collection (POST)
  //   /resources/testharnessreport.js -> custom reporter
  //   /resources/*                   -> serve from tests/resources/ (the WPT server's tuwpt config
  //                                     doesn't alias /resources/, and the jsdom interceptor
  //                                     normally handles this)
  //   /*                             -> proxy to WPT server; on 404, try serving from tests/
  //                                     (handles cross-references like /dom/nodes/selectors.js)

  function proxyToWPT(req) {
    return new Promise((res, reject) => {
      const proxyReq = http.request({
        hostname: wptOrigin.hostname,
        port: wptOrigin.port,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: wptOrigin.host
        }
      }, res);

      proxyReq.on("error", reject);
      req.pipe(proxyReq);
    });
  }

  const proxy = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Result reporting
    if (req.method === "POST" && url.pathname === "/__report__") {
      let body = "";
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          results.set(data.test, data);
          printResult(data);
          if (results.size === filtered.length) {
            printSummary();
            cleanup().then(() => process.exit(0));
          }
        } catch (e) {
          console.error("Failed to parse report:", e.message);
        }
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("OK");
      });
      return;
    }

    // Runner page
    if (url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(generateRunnerHTML(filtered));
      return;
    }

    // Custom testharnessreport.js
    if (url.pathname === "/resources/testharnessreport.js") {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(customReporter);
      return;
    }

    // /resources/* — serve directly from tests/resources/
    if (url.pathname.startsWith("/resources/")) {
      const content = await tryReadFile(join(testsDir, url.pathname.slice(1)));
      if (content !== undefined) {
        serveFile(res, content, url.pathname);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found: " + url.pathname);
      }
      return;
    }

    // Everything else — proxy to WPT server, fall back to tests/ on 404.
    // The fallback handles to-upstream tests that reference files from the upstream WPT tree, e.g.
    // ParentNode-querySelector-All-dont-upstream.html loads /dom/nodes/selectors.js and
    // /dom/nodes/ParentNode-querySelector-All.js which live in tests/, not to-upstream/. The WPT
    // server (doc_root ../to-upstream) 404s on these, so we serve them from tests/ instead. This
    // mirrors the hardcoded list in run-single-wpt.js's createWPTInterceptor().
    try {
      const proxyRes = await proxyToWPT(req);

      if (proxyRes.statusCode === 404) {
        proxyRes.resume();
        const content = await tryReadFile(join(testsDir, url.pathname.slice(1)));
        if (content !== undefined) {
          serveFile(res, content, url.pathname);
        } else {
          console.error(`  404: ${url.pathname}`);
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not found: " + url.pathname);
        }
      } else {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    } catch (e) {
      console.error(`  Proxy error for ${url.pathname}: ${e.message}`);
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Proxy error: " + e.message);
    }
  });

  proxy.listen(0, () => {
    const { port } = proxy.address();
    const url = `http://web-platform.test:${port}/`;
    console.log(`Opening ${url}\n`);
    console.log("Results will appear below as tests complete.");
    console.log("Press Ctrl+C to stop.\n");
    opener(url, browser ? { command: browser } : {});
  });

  function cleanup() {
    if (results.size > 0 && results.size < filtered.length) {
      printSummary();
    }
    proxy.close();
    return killSubprocess(wptProcess);
  }

  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("uncaughtException", async e => {
    console.error("Uncaught exception:", e);
    await cleanup();
    process.exit(1);
  });
}

main();
