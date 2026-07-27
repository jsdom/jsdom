"use strict";
const path = require("node:path");
const { describe, before, after } = require("mocha-sugar-free");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");
const wptServer = require("./wpt-server.js");
const { killSubprocess } = require("./utils.js");
const { checkToRunFile, runTestWithExpectations } = require("./expectations-utils.js");

const manifestFilename = path.resolve(__dirname, "wpt-manifest.json");
const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);
const toRunFilename = "to-run.yaml";

const testGroups = checkToRunFile(path.resolve(__dirname, toRunFilename), possibleTestFilePaths);

let wptServerURL, serverProcess;
const runSingleWPT = require("./run-single-wpt.js")(
  () => wptServerURL,
  toRunFilename
);
before({ timeout: 30_000 }, async () => {
  const { urls, subprocess } = await wptServer.start({ toUpstream: false });
  wptServerURL = urls[0];
  serverProcess = subprocess;
});

after({ timeout: 5000 }, () => killSubprocess(serverProcess));

describe("web-platform-tests", () => {
  for (const { dir, expectationDataByTestFilePath, testFilePaths } of testGroups) {
    describe(dir, () => {
      for (const testFilePath of testFilePaths) {
        runTestWithExpectations(testFilePath, expectationDataByTestFilePath, {
          runSingleWPT,
          prefix: dir + "/"
        });
      }
    });
  }
});
