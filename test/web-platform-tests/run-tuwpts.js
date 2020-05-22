"use strict";
const path = require("path");
const { describe, before, after } = require("mocha-sugar-free");
const { spawnSync } = require("child_process");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");
const startWPTServer = require("./start-wpt-server.js");

const wptPath = path.resolve(__dirname, "tests");
const testsPath = path.resolve(__dirname, "to-upstream");
const manifestFilename = path.resolve(__dirname, "tuwpt-manifest.json");

// We can afford to re-generate the manifest each time; we have few enough files that it's cheap.
const testsRootArg = path.relative(wptPath, testsPath);
const pathArg = path.relative(wptPath, manifestFilename);
const args = ["./wpt.py", "manifest", "--tests-root", testsRootArg, "--path", pathArg];
spawnSync("python", args, { cwd: wptPath, stdio: "inherit" });

const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);

let wptServerURL;
let serverProcess;
const runSingleWPT = require("./run-single-wpt.js")(() => wptServerURL);
before({ timeout: 30 * 1000 }, async () => {
  const { urls, subprocess } = await startWPTServer({ toUpstream: true });
  wptServerURL = urls[0];
  serverProcess = subprocess;
});

after(() => {
  serverProcess.kill();
});

describe("Local tests in web-platform-test format (to-upstream)", () => {
  for (const test of possibleTestFilePaths) {
    runSingleWPT(test);
  }
});
