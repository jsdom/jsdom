"use strict";
const path = require("path");
const fs = require("fs");
const jsYAML = require("js-yaml");
const { Minimatch } = require("minimatch");
const { describe, specify, before, after } = require("mocha-sugar-free");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");
const wptServer = require("./wpt-server.js");
const { resolveReason } = require("./utils.js");

const validInnerReasons = new Set([
  "fail",
  "fail-with-canvas"
]);

const validReasons = new Set([
  "fail",
  "fail-slow",
  "fail-with-canvas",
  "timeout",
  "flaky",
  "needs-canvas",
  // Node 18 has a bug in its vm module that causes certain property redefinition tests to fail.
  // They start passing again on Node 19.
  "fail-node18"
]);

const manifestFilename = path.resolve(__dirname, "wpt-manifest.json");
const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);

const toRunFilename = path.resolve(__dirname, "to-run.yaml");
const toRunString = fs.readFileSync(toRunFilename, { encoding: "utf-8" });
const toRunDocs = jsYAML.loadAll(toRunString, null, { filename: toRunFilename, schema: jsYAML.DEFAULT_SAFE_SCHEMA });

const minimatchers = new Map();

checkToRun();

let wptServerURL, serverProcess;
const runSingleWPT = require("./run-single-wpt.js")(() => wptServerURL);
before({ timeout: 30_000 }, async () => {
  const { urls, subprocess } = await wptServer.start({ toUpstream: false });
  wptServerURL = urls[0];
  serverProcess = subprocess;
});

after(() => {
  wptServer.kill(serverProcess);
});

describe("web-platform-tests", () => {
  for (const toRunDoc of toRunDocs) {
    describe(toRunDoc.DIR, () => {
      for (const testFilePath of possibleTestFilePaths) {
        if (testFilePath.startsWith(toRunDoc.DIR + "/")) {
          const matchingPattern = expectationsInDoc(toRunDoc).find(pattern => {
            const matcher = minimatchers.get(toRunDoc.DIR + "/" + pattern);
            return matcher.match(testFilePath);
          });

          const testFile = testFilePath.slice((toRunDoc.DIR + "/").length);
          let reason, data;

          if (matchingPattern) {
            // The array case is when the failure affects the whole test file
            // (ex.: testharness timeout or error, uncaught exception, etc.)
            reason = toRunDoc[matchingPattern][0];
            if (!Array.isArray(toRunDoc[matchingPattern])) {
              // The non-array case is when some subtests in the test file pass,
              // but others fail, and testharness status is OK.
              data = toRunDoc[matchingPattern];
            }
          } else if (toRunDoc.DIR.startsWith("html/canvas/")) {
            reason = "needs-canvas";
          }

          switch (resolveReason(reason)) {
            case "skip": {
              specify.skip(`[${reason}] ${testFile}`);
              break;
            }

            case "expect-fail": {
              const failReason = reason !== "fail" ? `: ${reason}` : "";
              runSingleWPT(testFilePath, `[expected fail${failReason}] ${testFile}`, true);
              break;
            }

            default: {
              let failCount = 0;
              if (data) {
                failCount = Object.values(data)
                  .filter(([innerReason]) => resolveReason(innerReason) === "expect-fail").length;
              }

              let prefix = "";
              if (failCount > 0) {
                prefix = `[expected ${failCount} failure${failCount > 1 ? "s" : ""}] `;
              }

              runSingleWPT(testFilePath, `${prefix}${testFile}`, data || false);
            }
          }
        }
      }
    });
  }
});

function checkToRun() {
  let lastDir = "";
  for (const doc of toRunDocs) {
    if (doc.DIR.startsWith("/")) {
      throw new Error(`DIR entries must not start with a slash: saw "${doc.DIR}"`);
    }
    if (doc.DIR.endsWith("/")) {
      throw new Error(`DIR entries must not end with a slash: saw "${doc.DIR}"`);
    }

    if (!fs.existsSync(path.resolve(__dirname, "tests", doc.DIR))) {
      throw new Error(`The directory "${doc.DIR}" does not exist`);
    }

    if (doc.DIR < lastDir) {
      throw new Error(`Bad lexicographical directory sorting in to-run.yaml: ${doc.DIR} should come before ${lastDir}`);
    }
    lastDir = doc.DIR;

    let lastPattern = "";
    for (const pattern of expectationsInDoc(doc)) {
      if (pattern.startsWith("/")) {
        throw new Error(`Expectation patterns must not start with a slash: saw "${pattern}"`);
      }

      if (pattern < lastPattern) {
        throw new Error("Bad lexicographical expectation pattern sorting in to-run.yaml: " + pattern +
                        " should come before " + lastPattern);
      }
      lastPattern = pattern;

      const data = doc[pattern];
      if (Array.isArray(data)) {
        const reason = data[0];
        if (!validReasons.has(reason)) {
          throw new Error(`Bad reason "${reason}" for expectation "${pattern}"`);
        }
      } else {
        for (const [subtest, [innerReason]] of Object.entries(data)) {
          if (!validInnerReasons.has(innerReason)) {
            if (!validReasons.has(innerReason)) {
              throw new Error(`Bad reason "${innerReason}" for expectation "${pattern}" and subtest "${subtest}"`);
            } else {
              throw new Error(`Reason "${innerReason}" is only supported for files, not subtests (expectation "${
                pattern}", subtest "${subtest}")`);
            }
          }
        }
      }

      const matcher = new Minimatch(doc.DIR + "/" + pattern);
      if (!possibleTestFilePaths.some(filename => matcher.match(filename))) {
        throw new Error(`Expectation pattern "${pattern}" does not match any test files`);
      }
      minimatchers.set(doc.DIR + "/" + pattern, matcher);
    }
  }
}

function expectationsInDoc(doc) {
  const keys = Object.keys(doc);
  keys.shift(); // get rid of the DIR key
  return keys;
}
