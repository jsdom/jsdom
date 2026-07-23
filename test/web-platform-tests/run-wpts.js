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

// WPT serves https over a self-signed cert. The main-thread dispatcher already
// skips cert checks (insecureDispatcher in run-single-wpt.js), but the sync XHR
// worker builds its own dispatcher and can't inherit that, so opt it in too.
process.env.JSDOM_SYNC_WORKER_INSECURE_TLS = "1";

const toRunDocs = checkToRunFile(path.resolve(__dirname, toRunFilename), possibleTestFilePaths);

let wptServerURL, wptServerHTTPSURL, serverProcess;
const runSingleWPT = require("./run-single-wpt.js")(
  // WPT variants tagged with `wpt_flags=https` expect the page itself to be
  // served over https (a "secure context"); everything else runs over http.
  testPath => {
    return /[?&]wpt_flags=https(?:&|$)/.test(testPath) ? wptServerHTTPSURL : wptServerURL;
  },
  toRunFilename
);
before({ timeout: 30_000 }, async () => {
  const { urls, subprocess } = await wptServer.start({ toUpstream: false });
  wptServerURL = urls[0];
  wptServerHTTPSURL = urls[1];
  serverProcess = subprocess;
});

after({ timeout: 5000 }, () => killSubprocess(serverProcess));

describe("web-platform-tests", () => {
  for (const toRunDoc of toRunDocs) {
    const expectations = expectationsInToRunDoc(toRunDoc);
    describe(toRunDoc.DIR, () => {
      for (const testFilePath of possibleTestFilePaths) {
        if (testFilePath.startsWith(toRunDoc.DIR + "/")) {
          runTestWithExpectations(testFilePath, expectations, {
            runSingleWPT,
            prefix: toRunDoc.DIR + "/"
          });
        }
      }
    });
  }
});
