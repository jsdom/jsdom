"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

// These are tests specifically designed to showcase possible issues when run inside a worker (browserified), where we
// can't run the full test suite.

describe("jsdom/inside-worker-smoke-tests", () => {
  specify("execute scripts with global variables / window scope reference", () => {
    const { window } = new JSDOM(`<!doctype html><html><head>
    <script>test = 'true'; navigator.foo = 'bar'</script>
    </head><body></body></html>`, { runScripts: "dangerously" });

    assert.strictEqual(window.test, "true", "global variables should be on window");
    assert.strictEqual(window.navigator.foo, "bar", "nested reference should work");
  });

  specify("execute scripts referring to global built-ins (GH-1175)", () => {
    const { window } = new JSDOM(`<!DOCTYPE html><body><script>
      document.body.textContent = Error.name + window.Object.name + NaN + ("undefined" in window);
    </script></body>`, { runScripts: "dangerously" });

    assert.strictEqual(window.document.body.textContent, "ErrorObjectNaNtrue");
  });

  specify("test async global variable context", { async: true }, t => {
    const { window } = new JSDOM(
      `<!doctype html><html><head><script>test = 'true';
      setTimeout(function(){test = 'baz'}, 100);</script></head><body></body></html>`,
      { runScripts: "dangerously" }
    );

    assert.strictEqual(window.test, "true", "global variables should be on window");

    setTimeout(() => {
      assert.strictEqual(window.test, "baz", "async write should be reflected");
      t.done();
    }, 1000);
  });

  specify("clearTimeout (GH-1732)", { async: true }, t => {
    const { window } = new JSDOM(`<script>const t = setTimeout(() => {
      clearTimeout(t);
      window.done();
    }, 100);</script>`, { runScripts: "dangerously" });

    window.addEventListener("error", e => {
      assert.ifError(e.error);
    });
    window.done = () => t.done();
  });
});
