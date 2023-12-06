"use strict";
/* eslint-disable no-console, global-require */
const dns = require("dns").promises;
const path = require("path");
const childProcess = require("child_process");
const http = require("http");
const https = require("https");
const os = require("os");

const wptDir = path.resolve(__dirname, "tests");

const configPaths = {
  default: path.resolve(__dirname, "wpt-config.json"),
  toUpstream: path.resolve(__dirname, "tuwpt-config.json")
};

const configs = {
  default: require(configPaths.default),
  toUpstream: require(configPaths.toUpstream)
};

let subprocess;

exports.start = async ({ toUpstream = false } = {}) => {
  const configType = toUpstream ? "toUpstream" : "default";
  const configPath = configPaths[configType];
  const config = configs[configType];

  try {
    await dns.lookup("web-platform.test");
  } catch {
    throw new Error("Host entries not present for web platform tests. See " +
                    "https://web-platform-tests.org/running-tests/from-local-system.html#system-setup");
  }

  const configArg = path.relative(path.resolve(wptDir), configPath);
  const args = ["./wpt.py", "serve", "--config", configArg];
  subprocess = childProcess.spawn("python", args, {
    cwd: wptDir,
    stdio: ["inherit", "pipe", "pipe"]
  });

  subprocess.stdout.filter(nonSpammyWPTLog).pipe(process.stdout);
  subprocess.stderr.filter(nonSpammyWPTLog).pipe(process.stderr);
  subprocess.stderr.on("data", terminateWptOnKeyError);

  return new Promise((resolve, reject) => {
    subprocess.on("error", e => {
      reject(new Error("Error starting python server process:", e.message));
    });

    resolve(Promise.all([
      pollForServer(`http://${config.browser_host}:${config.ports.http[0]}/`),
      pollForServer(`https://${config.browser_host}:${config.ports.https[0]}/`),
      pollForServer(`http://${config.browser_host}:${config.ports.ws[0]}/`),
      pollForServer(`https://${config.browser_host}:${config.ports.wss[0]}/`)
    ]).then(urls => ({ urls, subprocess })));
  });
};

function kill(serverProcess = subprocess) {
  if (serverProcess) {
    if (os.platform() === "win32") {
      // subprocess.kill() doesn't seem to be able to kill descendant processes on Windows,
      // at least with whatever's going on inside the web-platform-tests Python.
      // Use this technique instead.
      const { pid } = serverProcess;
      childProcess.spawnSync("taskkill", ["/F", "/T", "/PID", pid], { detached: true, windowsHide: true });
    } else {
      // SIGINT is necessary so that the Python script can clean up its subprocesses.
      serverProcess.kill("SIGINT");
    }
  }
}
exports.kill = kill;

function pollForServer(url, lastLogTime = Date.now()) {
  const agent = url.startsWith("https") ? new https.Agent({ rejectUnauthorized: false }) : null;
  const { request } = url.startsWith("https") ? https : http;

  // Using raw Node.js http/https modules is gross, but it's not worth pulling in something like node-fetch for just
  // this one part of the test codebase.
  return new Promise((resolve, reject) => {
    const req = request(url, { method: "HEAD", agent }, res => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(new Error(`Unexpected status=${res.statusCode}`));
      } else {
        resolve(url);
      }
    });

    req.on("error", reject);
    req.end();
  }).catch(err => {
    if (!subprocess) {
      return false;
    }

    // Only log every 5 seconds to be less spammy.
    if (Date.now() - lastLogTime >= 5000) {
      console.log(`WPT server at ${url} is not up yet (${err.message}); trying again`);
      lastLogTime = Date.now();
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(pollForServer(url, lastLogTime)), 500);
    });
  });
}

function nonSpammyWPTLog(buffer) {
  const string = buffer.toString("utf-8");

  // Subprocess shutdown is uninteresting.
  if (string.includes("Status of subprocess")) {
    return false;
  }
  if (string.includes("INFO - Stopped")) {
    return false;
  }

  // We'll get one message for each server startup. We don't need four more.
  if (string.includes("INFO - Close on:") ||
      string.includes("INFO - Bind on:") ||
      string.includes("INFO - Listen on:") ||
      string.includes("INFO - Create socket on:")) {
    return false;
  }

  // Probing / on the ws and wss ports will cause a fallback, and log some messages about it.
  // Those are expected and are uninteresting.
  if (/wss? on port \d+\] INFO - (No handler|Fallback to|"HEAD \/ HTTP)/.test(string)) {
    return false;
  }

  return true;
}

function terminateWptOnKeyError(buffer) {
  const string = buffer.toString("utf-8");
  const regKeyError = /KeyError:\s"(.+)"/;
  if (regKeyError.test(string)) {
    const [, message] = regKeyError.exec(string);
    subprocess.stderr.on("end", () => {
      subprocess.on("close", () => {
        subprocess = null;
        throw new Error(`Error starting python server process: ${message}`);
      });
      kill(subprocess);
    });
  }
}
