"use strict";

var env = require("../..").env;
var serializeDocument = require("../..").serializeDocument;

// These are tests specifically designed to showcase possible issues when run inside a worker (browserified), where we
// can't run the full test suite.

exports["jsdom.env: explicit config.html, full document"] = function (t) {
  env({
    html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    url: "http://example.com/",
    done: function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document),
        "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.equal(window.location.origin, "http://example.com");
      t.done();
    }
  });
};

exports["jsdom.env: string, full HTML document"] = function (t) {
  env(
    "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document),
        "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
      t.done();
    }
  );
};

exports["execute scripts with global variables / window scope reference"] = function (t) {
  t.expect(3);

  env({
    html: "<!doctype html><html><head><script>test = 'true'; navigator.foo = 'bar'</script></head><body></body></html>",
    done: function (err, window) {
      t.ifError(err);

      t.strictEqual(window.test, "true", "global variables should be on window");
      t.strictEqual(window.navigator.foo, "bar", "nested reference should work");

      t.done();
    },
    features: {
      ProcessExternalResources: ["script"]
    }
  });
};

exports["test async global variable context"] = function (t) {
  t.expect(3);

  env({
    html: "<!doctype html><html><head><script>test = 'true'; setTimeout(function(){test = 'baz'}, 100);</script>" +
      "</head><body></body></html>",
    done: function (err, window) {
      t.ifError(err);

      t.strictEqual(window.test, "true", "global variables should be on window");

      setTimeout(function () {
        t.strictEqual(window.test, "baz", "async write should be reflected");
        t.done();
      }, 1000);
    },
    features: {
      ProcessExternalResources: ["script"]
    }
  });
};
