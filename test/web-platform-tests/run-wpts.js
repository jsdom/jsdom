"use strict";
const path = require("node:path");
const { describe, before, after } = require("node:test");
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
  testPath => getURLPrefix(wptServerURLs, testPath),
  toRunFilename
);

describe("web-platform-tests", () => {
  before(async () => {
    const { urls, subprocess } = await wptServer.start({ toUpstream: false });
    wptServerURLs = urls;
    serverProcess = subprocess;
  }, { timeout: 30_000 });

  after(() => killSubprocess(serverProcess), { timeout: 5000 });

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
