"use strict";

const http = require("http");
const path = require("path");
const fs = require("fs");
const st = require("st");
const jsdom = require("../..");

function createJsdom(urlPrefix, testPath, t) {
  const reporterHref = urlPrefix + "resources/testharnessreport.js";

  jsdom.env({
    url: urlPrefix + testPath,
    features: {
      FetchExternalResources: ["script", "frame", "iframe", "link"],
      ProcessExternalResources: ["script"]
    },
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
    resourceLoader(resource, callback) {
      if (resource.url.href === reporterHref) {
        callback(null, "window.shimTest();");
      } else {
        resource.defaultFetch(callback);
      }
    },
    created(err, window) {
      if (err) {
        t.ifError(err, "window should be created without error");
        t.done();
      }

      window.shimTest = () => {
        window.add_result_callback(test => {
          if (test.status === 1) {
            t.ok(false, "Failed in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else if (test.status === 2) {
            t.ok(false, "Timout in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else {
            t.ok(true, test.name);
          }
        });

        window.add_completion_callback((tests, harnessStatus) => {
          t.ok(harnessStatus.status !== 2, "test harness should not timeout");
          window.close();
          t.done();
        });
      };
    },

    loaded(err) {
      t.ifError(err);
    }
  });
}

module.exports = function (exports, testDir) {
  const staticFileServer = st({ path: testDir, url: "/", passthrough: true });
  const server = http.createServer((req, res) => {
    staticFileServer(req, res, () => fallbackToWPT(req, res));
  }).listen();
  const urlPrefix = `http://127.0.0.1:${server.address().port}/`;

  process.on("exit", () => server.close());

  return testPath => {
    exports[testPath] = t => createJsdom(urlPrefix, testPath, t);
  };

  function fallbackToWPT(req, res) {
    // Since to-upstream/ tests do not contain resources/, we should get the one from the tests/ dir.
    if (req.url.startsWith("/resources")) {
      fs.createReadStream(path.resolve(__dirname, "tests", req.url.substring(1))).pipe(res);
      return;
    }
  }
};
