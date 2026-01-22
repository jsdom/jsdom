"use strict";
/* eslint-disable no-console */
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { describe, before, after } = require("mocha-sugar-free");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");
const wptServer = require("./wpt-server.js");
const { killSubprocess, spawnSyncFiltered } = require("./utils.js");
const { checkToUpstreamExpectations, runTestWithExpectations } = require("./expectations-utils.js");

const wptPath = path.resolve(__dirname, "tests");
const testsPath = path.resolve(__dirname, "to-upstream");
const relativeTestsPath = path.relative(wptPath, testsPath);
const expectationsFilename = "to-upstream-expectations.yaml";

// We can afford to re-generate the manifest each time; we have few enough files that it's cheap.
const manifestFilename = path.resolve(__dirname, "tuwpt-manifest.json");
const manifestResult = spawnSync(
  "python",
  ["./wpt.py", "manifest", "--tests-root", relativeTestsPath, "--path", path.relative(wptPath, manifestFilename)],
  { cwd: wptPath, stdio: "inherit" }
);
if (manifestResult.status !== 0) {
  console.error("Manifest generation failed");
  process.exit(1);
}

// Similarly we run the lint each time.
const lintResult = spawnSyncFiltered(
  "python",
  ["./wpt.py", "lint", "--repo-root", relativeTestsPath, "--all"],
  { cwd: wptPath }
);
if (lintResult.status !== 0) {
  console.error("Linting failed");
  process.exit(1);
}

const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);

const { minimatchers, expectations } = checkToUpstreamExpectations(
  path.resolve(__dirname, expectationsFilename),
  possibleTestFilePaths
);

let wptServerURL, serverProcess;
const runSingleWPT = require("./run-single-wpt.js")(
  () => wptServerURL,
  expectationsFilename
);
before({ timeout: 30_000 }, async () => {
  const { urls, subprocess } = await wptServer.start({ toUpstream: true });
  wptServerURL = urls[0];
  serverProcess = subprocess;
});

after({ timeout: 5000 }, () => killSubprocess(serverProcess));

describe("Local tests in web-platform-test format (to-upstream)", () => {
  for (const testFilePath of possibleTestFilePaths) {
    runTestWithExpectations(testFilePath, expectations, minimatchers, { runSingleWPT });
  }
});
