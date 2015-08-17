"use strict";

var fs = require("fs");
var path = require("path");
var request = require("request");
var jsdom = require("../..");
var toFileUrl = require("../../lib/jsdom/utils").toFileUrl;

function createJsdom(source, url, t) {
  const reporterHref = toFileUrl(__dirname + "/tests/resources/testharnessreport.js");

  jsdom.env({
    html: source,
    url: url,
    features: {
      FetchExternalResources: ["script", "frame", "iframe", "link"],
      ProcessExternalResources: ["script"]
    },
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
    resourceLoader: function (resource, callback) {
      if (resource.url.href === reporterHref) {
        callback(null, "window.shimTest();");
      } else {
        resource.defaultFetch(callback);
      }
    },
    created: function (err, window) {
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

    loaded: function (err) {
      t.ifError(err && err[0].data.error);
    }
  });
}

function testUrl(url, t) {
  fs.readFile(path.resolve(__dirname, "tests", url), "utf8", function (err, file) {
    if (err) {
      request.get("http://w3c-test.org/" + url, function (err, resp, respBody) {
        if (err) {
          t.ifError(err, "request should go through without error");
          t.done();
          return;
        }
        if (resp.statusCode < 200 || resp.statusCode >= 300) {
          t.ok(false, "request should return OK status code");
          t.done();
          return;
        }

        createJsdom(respBody, "http://w3c-test.org/" + url, t);
      });
    } else {
      file = file.replace(/\/resources\//gi, toFileUrl(__dirname + "/tests/resources") + "/");
      createJsdom(file, toFileUrl(path.resolve(__dirname, "tests", url)), t);
    }
  });
}

module.exports = function (exports) {
  return function (url) {
    exports[url] = function (t) {
      testUrl(url, t);
    };
  };
};
