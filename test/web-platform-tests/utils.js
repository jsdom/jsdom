"use strict";
const childProcess = require("child_process");
const http = require("http");
const https = require("https");
const os = require("os");
const { Canvas } = require("../../lib/jsdom/utils.js");

const hasCanvas = Boolean(Canvas);

const nodeMajorVersion = Number.parseInt(process.versions.node.split(".")[0]);

exports.resolveReason = reason => {
  if (["fail-slow", "timeout", "flaky"].includes(reason)) {
    return "skip";
  }

  if (["fail-with-canvas", "needs-canvas"].includes(reason) && !hasCanvas) {
    return "skip";
  }

  if (reason === "fail-node18" && nodeMajorVersion === 18) {
    return "skip";
  }

  if (reason === "fail-lt-node22" && nodeMajorVersion < 22) {
    return "expect-fail";
  }

  if (reason === "fail" ||
    (reason === "fail-with-canvas" && hasCanvas)) {
    return "expect-fail";
  }

  return "run";
};

exports.killSubprocess = subprocess => {
  if (os.platform() === "win32") {
    // subprocess.kill() doesn't seem to be able to kill descendant processes on Windows,
    // at least with whatever's going on inside the web-platform-tests Python.
    // Use this technique instead.
    const { pid } = subprocess;
    childProcess.spawnSync("taskkill", ["/F", "/T", "/PID", pid], { detached: true, windowsHide: true });
  } else {
    // SIGINT is necessary so that the Python script can clean up its subprocesses.
    subprocess.kill("SIGINT");
  }
};

// We need rejectUnauthorized support so we can't use built-in fetch(), sadly.
exports.doHeadRequestWithNoCertChecking = url => {
  const agent = url.startsWith("https") ? new https.Agent({ rejectUnauthorized: false }) : null;
  const { request } = url.startsWith("https") ? https : http;

  return new Promise((resolve, reject) => {
    const req = request(url, { method: "HEAD", agent }, res => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(new Error(`Unexpected status ${res.statusCode}`));
      } else {
        resolve();
      }
    });

    req.on("error", reject);
    req.end();
  });
};

exports.spawnSyncFiltered = (command, args, options = {}) => {
  // We need to capture the output to filter it, so override any stdio settings
  const modifiedOptions = { ...options, stdio: "pipe" };
  const result = childProcess.spawnSync(command, args, modifiedOptions);

  for (const stream of ["stdout", "stderr"]) {
    if (result[stream]) {
      const filtered = result[stream].toString()
        .split("\n")
        .filter(line => {
          return !line.includes("[notice] A new release of pip is available") &&
                 !line.includes("[notice] To update, run: python") &&
                 !line.includes("is outside repository at");
        })
        .join("\n");

      if (filtered) {
        process[stream].write(filtered);
      }
    }
  }

  return result;
};
