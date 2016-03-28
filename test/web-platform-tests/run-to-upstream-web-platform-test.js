"use strict";

const http = require("http");
const path = require("path");
const fs = require("fs");
const st = require("st");
const specify = require("mocha-sugar-free").specify;

const inBrowserContext = require("../util").inBrowserContext;
const createJsdom = require("./create-jsdom");

module.exports = function (testDir) {
  if (inBrowserContext()) {
    // TODO: browser support for running to-upstream
    return () => {};
  }

  const staticFileServer = st({ path: testDir, url: "/", passthrough: true });
  const server = http.createServer((req, res) => {
    staticFileServer(req, res, () => fallbackToWPT(req, res));
  }).listen();
  const urlPrefix = `http://127.0.0.1:${server.address().port}/`;

  process.on("exit", () => server.close());

  return testPath => {
    specify({
      title: testPath,
      expectPromise: true,
      // WPT also takes care of timeouts, this is an extra failsafe:
      timeout: 60000,
      slow: 10000,
      skipIfBrowser: true,
      fn() {
        return createJsdom(urlPrefix, testPath);
      }
    });
  };

  function fallbackToWPT(req, res) {
    // Since to-upstream/ tests do not contain resources/, we should get the one from the tests/ dir.
    if (req.url.startsWith("/resources")) {
      fs.createReadStream(path.resolve(__dirname, "tests", req.url.substring(1))).pipe(res);
    }
  }
};
