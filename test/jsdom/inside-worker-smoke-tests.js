"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");

// These are tests specifically designed to showcase possible issues when run inside a worker (browserified), where we
// can't run the full test suite.

describe("jsdom/inside-worker-smoke-tests", () => {
  specify("jsdom.env: explicit config.html, full document", { async: true }, t => {
    jsdom.env({
      html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      url: "http://example.com/",
      done(err, window) {
        assert.ifError(err);
        assert.equal(jsdom.serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        assert.equal(window.location.href, "http://example.com/");
        assert.equal(window.location.origin, "http://example.com");
        t.done();
      }
    });
  });

  specify("jsdom.env: string, full HTML document", { async: true }, t => {
    jsdom.env(
      "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      (err, window) => {
        assert.ifError(err);
        assert.equal(jsdom.serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        t.done();
      }
    );
  });

  specify("execute scripts with global variables / window scope reference", { async: true }, t => {
    jsdom.env({
      html: "<!doctype html><html><head>" +
            "<script>test = 'true'; navigator.foo = 'bar'</script>" +
            "</head><body></body></html>",
      done(err, window) {
        assert.ifError(err);

        assert.strictEqual(window.test, "true", "global variables should be on window");
        assert.strictEqual(window.navigator.foo, "bar", "nested reference should work");

        t.done();
      },
      features: {
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("execute scripts referring to global built-ins (GH-1175)", { async: true }, t => {
    const document = jsdom.jsdom(`<!DOCTYPE html><script>
      document.body.textContent = Error.name + window.Object.name + NaN + ("undefined" in window);
    </script>`);

    assert.strictEqual(document.body.textContent, "ErrorObjectNaNtrue");
    t.done();
  });

  specify("test async global variable context", { async: true }, t => {
    jsdom.env({
      html: "<!doctype html><html><head><script>test = 'true'; setTimeout(function(){test = 'baz'}, 100);</script>" +
            "</head><body></body></html>",
      done(err, window) {
        assert.ifError(err);

        assert.strictEqual(window.test, "true", "global variables should be on window");

        setTimeout(() => {
          assert.strictEqual(window.test, "baz", "async write should be reflected");
          t.done();
        }, 1000);
      },
      features: {
        ProcessExternalResources: ["script"]
      }
    });
  });
});
