﻿"use strict";

var fs = require("fs");
var path = require("path");
var request = require("request");
var jsdom = require("../..");

function createJsdom(source, url, t) {
  var input = source.replace(
      /<script src="(.*?)\/resources\/testharnessreport.js"><\/script>/,
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
          t.notEqual(test.status, 1, test.name + ": failed");
          t.notEqual(test.status, 2, test.name + ": timeout");
        });

        window.add_completion_callback(function () {
          window.close();
          t.done();
        });
      };
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

var rawManifest = fs.readFileSync(path.resolve(__dirname, "MANIFEST.json"), "utf8");
var manifest = JSON.parse(rawManifest);

var testharnessTests = manifest.items.testharness;

module.exports = function (exports) {
  return function (url) {
    testharnessTests.forEach(function (testHarness) {
      if (testHarness.path.indexOf(url) === 0) {
        exports[testHarness.path] = function (t) {
          testUrl(testHarness.path, t);
        };
      }
    });
  };
};
