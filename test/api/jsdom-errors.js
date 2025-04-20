"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM, VirtualConsole } = require("../..");

describe("API: virtual console jsdomErrors", () => {
  // "resource-loading" and "css-parsing" have their own dedicated test files.

  describe("not-implemented", () => {
    it("should emit for window.alert()", () => {
      const virtualConsole = new VirtualConsole();
      const dom = new JSDOM(``, { virtualConsole });

      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert(error instanceof Error);
        assert.equal(error.type, "not-implemented");
        assert.equal(error.message, "Not implemented: Window's alert() method");
        called = true;
      });

      dom.window.alert();

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });
  });

  describe("unhandled-exception", () => {
    it("should emit from scripts that are inserted into the document and explicitly throw", () => {
      const virtualConsole = new VirtualConsole();
      const dom = new JSDOM(``, { virtualConsole, runScripts: "dangerously" });

      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert(error instanceof Error);
        assert.equal(error.type, "unhandled-exception");
        assert.equal(error.message, "Uncaught [SyntaxError: foo]");
        assert.equal(error.cause.constructor, dom.window.SyntaxError);
        assert.equal(error.cause.message, "foo");
        called = true;
      });

      const { document } = dom.window;
      const script = document.createElement("script");
      script.textContent = "throw new SyntaxError('foo');";
      document.head.appendChild(script);

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });

    it("should emit an exception thrown in an inline event handler", () => {
      const virtualConsole = new VirtualConsole();
      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.equal(error.type, "unhandled-exception");
        assert.equal(error.message, "Uncaught [Error: oh no!]");
        assert.equal(error.cause.constructor.name, "Error");
        called = true;
      });

      const html = `<body onclick="throw new Error('oh no!')"></body>`;
      const dom = new JSDOM(html, { virtualConsole, runScripts: "dangerously" });
      const { document } = dom.window;

      document.body.click();

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });

    it("should emit a null value thrown in an inline event handler", () => {
      const virtualConsole = new VirtualConsole();

      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert(error instanceof Error);
        assert.equal(error.type, "unhandled-exception");
        assert.equal(error.message, "Uncaught null");
        assert.equal(error.cause, null);
        called = true;
      });

      const html = `<body onclick="throw null"></body>`;
      const { document } = (new JSDOM(html, { virtualConsole, runScripts: "dangerously" })).window;

      document.body.click();

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });

    it("should emit an Error thrown in sync script execution during parsing", () => {
      const virtualConsole = new VirtualConsole();
      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.equal(error.type, "unhandled-exception");
        assert.equal(error.message, "Uncaught [TypeError: oh no!]");
        assert.equal(error.cause.constructor.name, "TypeError");
        called = true;
      });

      // eslint-disable-next-line no-new
      new JSDOM(
        `<script>throw new TypeError("oh no!")</script>`,
        { virtualConsole, runScripts: "dangerously" }
      );

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });

    it("should emit an non-Error exception thrown in sync script execution during parsing", () => {
      const virtualConsole = new VirtualConsole();
      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.equal(error.type, "unhandled-exception");
        assert.equal(error.message, "Uncaught {}");
        assert.equal(typeof error.cause, "object");
        assert.notEqual(error.cause, null);
        called = true;
      });

      // eslint-disable-next-line no-new
      new JSDOM(`<script>throw {}</script>`, { virtualConsole, runScripts: "dangerously" });

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });

    it("should still emit errors when adding an onerror handler", () => {
      const virtualConsole = new VirtualConsole();
      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.equal(error.type, "unhandled-exception");
        assert.equal(error.message, "Uncaught [Error: oh no!]");
        assert.equal(error.cause.constructor.name, "Error");
        called = true;
      });

      const html = `<body onclick="throw new Error('oh no!')"></body>`;
      const dom = new JSDOM(html, { virtualConsole, runScripts: "dangerously" });
      const { document } = dom.window;

      document.defaultView.onerror = () => {
        // just a no-op handler to trigger the setter logic
      };

      document.body.click();

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });

    it("should not emit errors when adding an onerror handler that returns true", () => {
      const virtualConsole = new VirtualConsole();
      let called = false;
      virtualConsole.on("jsdomError", () => {
        called = true;
      });

      const html = `<body onclick="throw new Error('oh no!')"></body>`;
      const dom = new JSDOM(html, { virtualConsole, runScripts: "dangerously" });
      const { document } = dom.window;

      document.defaultView.onerror = () => true;

      document.body.click();

      assert.equal(called, false, `The "jsdomError" event must not have been emitted`);
    });
  });

  describe("resource-loading (not in the resources tests)", () => {
    it("should emit when the @import URL cannot be parsed", () => {
      const virtualConsole = new VirtualConsole();
      const dom = new JSDOM(``, { virtualConsole });

      let called = false;
      virtualConsole.on("jsdomError", error => {
        assert(error instanceof Error);
        assert.equal(error.type, "resource-loading");
        assert.equal(error.message, `Could not parse CSS @import URL "http:::bar" relative to base URL "about:blank"`);
        assert.equal(error.url, "http:::bar");
        assert(error.cause instanceof Error);
        called = true;
      });

      const { document } = dom.window;
      const style = document.createElement("style");
      style.textContent = `@import "http:::bar";`;
      document.head.appendChild(style);

      assert.equal(called, true, `The "jsdomError" event must have been emitted`);
    });
  });
});
