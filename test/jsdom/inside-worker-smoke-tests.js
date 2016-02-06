"use strict";

const t = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const it = require("mocha-sugar-free").it;

const jsdom = require("../..").jsdom;
const env = require("../..").env;
const serializeDocument = require("../..").serializeDocument;

// These are tests specifically designed to showcase possible issues when run inside a worker (browserified), where we
// can't run the full test suite.

describe("jsdom/inside-worker-smoke-tests", () => {
  it("jsdom.env: explicit config.html, full document", { async: true }, testCase => {
    env({
      html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      url: "http://example.com/",
      done(err, window) {
        t.ifError(err);
        t.equal(serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        t.equal(window.location.href, "http://example.com/");
        t.equal(window.location.origin, "http://example.com");
        testCase.done();
      }
    });
  });

  it("jsdom.env: string, full HTML document", { async: true }, testCase => {
    env(
      "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      (err, window) => {
        t.ifError(err);
        t.equal(serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        testCase.done();
      }
    );
  });

  it("execute scripts with global variables / window scope reference", { async: true }, testCase => {
    env({
      html: "<!doctype html><html><head>" +
            "<script>test = 'true'; navigator.foo = 'bar'</script>" +
            "</head><body></body></html>",
      done(err, window) {
        t.ifError(err);

        t.strictEqual(window.test, "true", "global variables should be on window");
        t.strictEqual(window.navigator.foo, "bar", "nested reference should work");

        testCase.done();
      },
      features: {
        ProcessExternalResources: ["script"]
      }
    });
  });

  it("execute scripts referring to global built-ins (GH-1175)", { async: true }, testCase => {
    const document = jsdom(`<!DOCTYPE html><script>
      document.body.textContent = Error.name + window.Object.name + NaN + ("undefined" in window);
    </script>`);

    t.strictEqual(document.body.textContent, "ErrorObjectNaNtrue");
    testCase.done();
  });

  it("test async global variable context", { async: true }, testCase => {
    env({
      html: "<!doctype html><html><head><script>test = 'true'; setTimeout(function(){test = 'baz'}, 100);</script>" +
            "</head><body></body></html>",
      done(err, window) {
        t.ifError(err);

        t.strictEqual(window.test, "true", "global variables should be on window");

        setTimeout(() => {
          t.strictEqual(window.test, "baz", "async write should be reflected");
          testCase.done();
        }, 1000);
      },
      features: {
        ProcessExternalResources: ["script"]
      }
    });
  });
});
