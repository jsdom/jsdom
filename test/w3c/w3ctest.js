"use strict";

var fs = require('fs');
var path = require('path');
var request = require("request");
var jsdom = require("../..");

function createJsdom(source, url, t) {
  var input = source.replace(
      /<script src=["']?([^"']*?)\/resources\/testharnessreport.js["']?><\/script>/,
      "<script>window.shimTest();</script>");

  if (input === source) {
    t.ok(false, "Couldn't replace test reporter!");
    t.done();
  }

  jsdom.env({
    html: input,
    url: url,
    features: {
      FetchExternalResources: ["script", "img", "css", "frame", "iframe", "link"],
      ProcessExternalResources: ["script"]
    },
    created: function (err, window) {
      window.shimTest = function () {
        window.add_result_callback(function (test) {
          if (test.status === 1) {
            t.ok(false, "Failed in \"" + test.name + "\": \n" + test.message);
          } else if (test.status === 2) {
            t.ok(false, "Timout in \"" + test.name + "\": \n" + test.message);
          } else {
            t.ok(true, test.name);
          }
        });

        window.add_completion_callback(function () {
          window.close();
          t.done();
        });
      };
    },

    loaded: function (err, window) {
      t.ifError(err && err[0].data.error);
      t.done();
      window.close();
    }
  });
}

function testUrl(url, t) {
  fs.readFile(path.resolve(__dirname, 'tests', url), 'utf8', function (err, file) {
    if (err) {
      request.get('http://w3c-test.org/' + url, function (err, resp, respBody) {
        if (err) {
          t.ifError(err, 'request should go through without error');
          t.done();
          return;
        }
        if (resp.statusCode < 200 || resp.statusCode >= 300) {
          t.ok(false, 'request should return OK status code');
          t.done();
          return;
        }

        createJsdom(respBody, 'http://w3c-test.org/' + url, t);
      });
    } else {
      file = file.replace(/\/resources\//gi, __dirname + '/tests/resources/');
      createJsdom(file, path.resolve(__dirname, 'tests', url), t);
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
