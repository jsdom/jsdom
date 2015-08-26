"use strict";

const http = require("http");
const path = require("path");
const request = require("request");
const st = require("st");
const jsdom = require("../..");
const URL = require("../../lib/jsdom/utils").URL;

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

      window.shimTest = function () {
        /* jshint -W106 */
        window.add_result_callback(function (test) {
          if (test.status === 1) {
            t.ok(false, "Failed in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else if (test.status === 2) {
            t.ok(false, "Timout in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else {
            t.ok(true, test.name);
          }
        });

        window.add_completion_callback(function (tests, harnessStatus) {
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

module.exports = function (exports) {
  const staticFileServer = st({ path: path.resolve(__dirname, "tests"), url: "/", passthrough: true });
  const server = http.createServer(function (req, res) {
    staticFileServer(req, res, function () {
      fallbackToHostedVersion(req, res);
    });
  }).listen();
  const urlPrefix = `http://127.0.0.1:${server.address().port}/`;

  process.on("exit", function () {
    server.close();
  });

  return function (testPath) {
    exports[testPath] = function (t) {
      createJsdom(urlPrefix, testPath, t);
    };
  };

  function fallbackToHostedVersion(req, res) {
    // Problem getting it from disk. Let's try the online version!

    const url = new URL(req.url, urlPrefix);
    url.protocol = "https";
    url.host = "w3c-test.org:443";
    request.get(url.href, { strictSSL: false }).pipe(res);
  }
};
