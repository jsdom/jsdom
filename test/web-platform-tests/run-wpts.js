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
const toRunFilename = "to-run.yaml";

const toRunDocs = checkToRunFile(path.resolve(__dirname, toRunFilename), possibleTestFilePaths);

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
  const filesByDir = new Map();

  for (const toRunDoc of toRunDocs) {
    const dirPrefix = toRunDoc.DIR.endsWith("/") ? toRunDoc.DIR : toRunDoc.DIR + "/";
    const matchedFiles = possibleTestFilePaths.filter(filePath => filePath.startsWith(dirPrefix));

    filesByDir.set(toRunDoc, matchedFiles);
  }

  for (const toRunDoc of toRunDocs) {
    const expectations = expectationsInToRunDoc(toRunDoc);
    const dirFiles = filesByDir.get(toRunDoc) || [];

    describe(toRunDoc.DIR, () => {
      for (const testFilePath of dirFiles) {
        runTestWithExpectations(testFilePath, expectations, {
          runSingleWPT,
          prefix: toRunDoc.DIR.endsWith("/") ? toRunDoc.DIR : toRunDoc.DIR + "/"
        });
      }
    });
  }
});
