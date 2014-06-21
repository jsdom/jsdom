"use strict";

var request = require("request");
var jsdom = require("../..");

function testUrl(url, t) {
  request.get(url, function (err, resp, respBody) {
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

    var input = respBody.replace(
      /<script src="\/resources\/testharnessreport.js"><\/script>/,
      "<script>window.shimTest();</script>");

    if (input === respBody) {
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
  });
}

module.exports = function (exports) {
  return function (url) {
    exports[url] = function (t) {
      testUrl(url, t);
    };
  };
};
