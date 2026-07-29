"use strict";
const childProcess = require("node:child_process");
const http = require("node:http");
const https = require("node:https");
const os = require("node:os");

exports.getURLPrefix = (urls, testPath) => {
  const { pathname, searchParams } = new URL(testPath, urls[0]);
  const filename = pathname.slice(pathname.lastIndexOf("/") + 1);
  const flags = new Set([
    ...filename.split(".").slice(1, -1),
    ...searchParams.getAll("wpt_flags")
  ]);

  return flags.has("https") ? urls[1] : urls[0];
};

exports.killSubprocess = subprocess => {
  return new Promise(resolve => {
    subprocess.on("close", resolve);

    if (os.platform() === "win32") {
      // subprocess.kill() doesn't seem to be able to kill descendant processes on Windows,
      // at least with whatever's going on inside the web-platform-tests Python.
      // Use taskkill asynchronously since it can take several seconds to complete.
      const { pid } = subprocess;
      childProcess.spawn("taskkill", ["/F", "/T", "/PID", pid], { detached: true, windowsHide: true });
    } else {
      // SIGINT is necessary so that the Python script can clean up its subprocesses.
      subprocess.kill("SIGINT");
    }
  });
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

exports.isQuietReporter = () => {
  const args = process.argv;
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--reporter" || args[i] === "-R") && args[i + 1] === "min") {
      return true;
    }
    if (args[i] === "--reporter=min" || args[i] === "-Rmin") {
      return true;
    }
  }
  return false;
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
                 !line.includes("is outside repository at") &&
                 !line.includes("INFO:manifest:");
        })
        .join("\n");

      if (filtered) {
        process[stream].write(filtered);
      }
    }
  }

  return result;
};
