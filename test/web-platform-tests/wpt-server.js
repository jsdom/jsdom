"use strict";
/* eslint-disable no-console, global-require */
const dns = require("node:dns/promises");
const path = require("node:path");
const childProcess = require("node:child_process");
const { killSubprocess, doHeadRequestWithNoCertChecking } = require("./utils.js");
const delay = require("node:timers/promises").setTimeout;

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
  subprocess.stderr.on("data", terminateWPTOnKeyError);
  subprocess.on("error", terminateSubprocessOnError);

  const urls = await Promise.all([
    pollForServer(`http://${config.browser_host}:${config.ports.http[0]}/`),
    pollForServer(`https://${config.browser_host}:${config.ports.https[0]}/`),
    pollForServer(`http://${config.browser_host}:${config.ports.ws[0]}/`),
    pollForServer(`https://${config.browser_host}:${config.ports.wss[0]}/`)
  ]);

  return { urls, subprocess };
};

async function pollForServer(url, lastLogTime = Date.now()) {
  try {
    await doHeadRequestWithNoCertChecking(url);
  } catch (err) {
    if (!subprocess) {
      throw new Error("WPT server terminated");
    }

    // Only log every 5 seconds to be less spammy.
    if (Date.now() - lastLogTime >= 5000) {
      console.log(`WPT server at ${url} is not up yet (${err.message}); trying again`);
      lastLogTime = Date.now();
    }

    await delay(500);
    await pollForServer(url, lastLogTime);
  }

  return url;
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

function terminateWPTOnKeyError(buffer) {
  const string = buffer.toString("utf-8");
  const regKeyError = /KeyError:\s"(.+)"/;
  if (regKeyError.test(string)) {
    const [, message] = regKeyError.exec(string);
    const err = new Error(message);
    subprocess.stderr.on("end", () => {
      terminateSubprocessOnError(err);
    });
  }
}

function terminateSubprocessOnError(err) {
  if (err instanceof Error && subprocess) {
    subprocess.on("close", () => {
      subprocess = null;
      throw new Error(`Error starting python server process: ${err.message}`);
    });
    killSubprocess(subprocess);
  }
}
