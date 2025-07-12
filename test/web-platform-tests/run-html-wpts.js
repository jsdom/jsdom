"use strict";
const path = require("node:path");
const { describe, before, after } = require("mocha-sugar-free");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");
const wptServer = require("./wpt-server.js");
const { killSubprocess } = require("./utils.js");
const { checkToRunFile, expectationsInToRunDoc, runTestWithExpectations } = require("./expectations-utils.js");

const manifestFilename = path.resolve(__dirname, "wpt-manifest.json");
const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);
const toRunFilename = "to-run-html.yaml";

const { minimatchers, toRunDocs } = checkToRunFile(path.resolve(__dirname, toRunFilename), possibleTestFilePaths);

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

after(() => {
  killSubprocess(serverProcess);
});

describe("web-platform-tests", () => {
  for (const toRunDoc of toRunDocs) {
    const expectations = expectationsInToRunDoc(toRunDoc);
    describe(toRunDoc.DIR, () => {
      for (const testFilePath of possibleTestFilePaths) {
        if (testFilePath.startsWith(toRunDoc.DIR + "/")) {
          runTestWithExpectations(testFilePath, expectations, minimatchers, {
            runSingleWPT,
            prefix: toRunDoc.DIR + "/"
          });
        }
      }
    });
  }
});
