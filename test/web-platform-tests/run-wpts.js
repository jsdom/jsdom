"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { describe, before, after } = require("mocha-sugar-free");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");
const wptServer = require("./wpt-server.js");
const { getURLPrefix, killSubprocess } = require("./utils.js");
const { checkToRunFile, runTestWithExpectations } = require("./expectations-utils.js");

const manifestFilename = path.resolve(__dirname, "wpt-manifest.json");
const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);
const toRunFilename = "to-run.yaml";

const testGroups = checkToRunFile(path.resolve(__dirname, toRunFilename), possibleTestFilePaths);

let wptServerURLs, serverProcess;
const runSingleWPT = require("./run-single-wpt.js")(
  (testPath) => getURLPrefix(wptServerURLs, testPath),
  toRunFilename,
);

async function copyTestdrivers() {
  const sourceDir = path.resolve(__dirname, "tests", "resources");
  const testdriver = path.resolve(sourceDir, "testdriver.js");
  const testdriverActions = path.resolve(sourceDir, "testdriver-actions.js");
  const outDir = path.resolve(__dirname, "resources");

  await fs.mkdir(outDir, { recursive: true });
  await fs.copyFile(testdriver, path.resolve(outDir, "testdriver.js"));
  await fs.copyFile(testdriverActions, path.resolve(outDir, "testdriver-actions.js"));
}

before({ timeout: 30_000 }, async () => {
  await copyTestdrivers();
  const { urls, subprocess } = await wptServer.start({ toUpstream: false });
  wptServerURLs = urls;
  serverProcess = subprocess;
});

after({ timeout: 5000 }, () => killSubprocess(serverProcess));

describe("web-platform-tests", () => {
  for (const { dir, expectationDataByTestFilePath, testFilePaths } of testGroups) {
    describe(dir, () => {
      for (const testFilePath of testFilePaths) {
        // Skip upstream tentative tests; local to-upstream tests run regardless of tentative status.
        if (/tentative[./]/.test(testFilePath)) {
          continue;
        }
        runTestWithExpectations(testFilePath, expectationDataByTestFilePath, {
          runSingleWPT,
          prefix: dir + "/",
        });
      }
    });
  }
});
