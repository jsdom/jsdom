"use strict";
const path = require("path");
const { describe } = require("mocha-sugar-free");
const { spawnSync } = require("child_process");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");

const wptPath = path.resolve(__dirname, "tests");
const testsPath = path.resolve(__dirname, "to-upstream");
const manifestFilename = path.resolve(__dirname, "tuwpt-manifest.json");
const runSingleWPT = require("./run-single-wpt.js")({ toUpstream: true });

// We can afford to re-generate the manifest each time; we have few enough files that it's cheap.
const testsRootArg = path.relative(wptPath, testsPath);
const pathArg = path.relative(wptPath, manifestFilename);
const args = ["./wpt.py", "manifest", "--tests-root", testsRootArg, "--path", pathArg, "--work"];
spawnSync("python", args, { cwd: wptPath, stdio: "inherit" });

const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);

describe("Local tests in web-platform-test format (to-upstream)", () => {
  for (const test of possibleTestFilePaths) {
    runSingleWPT(test);
  }
});
