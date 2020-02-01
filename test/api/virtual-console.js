"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM, VirtualConsole } = require("../..");

const consoleMethods = [
  "assert",
  "clear",
  "count",
  "countReset",
  "debug",
  "dir",
  "dirxml",
  "error",
  "group",
  "groupCollapsed",
  "groupEnd",
  "info",
  "log",
  "table",
  "time",
  "timeLog",
  "timeEnd",
  "trace",
  "warn"
];

describe("API: virtual consoles", () => {
  it("should send output only to the appropriate window", () => {
    const vc1 = new VirtualConsole();
    const vc2 = new VirtualConsole();
    const dom1 = new JSDOM(``, { virtualConsole: vc1 });
    const dom2 = new JSDOM(``, { virtualConsole: vc2 });

    let vc1Called = false;
    let vc2Called = false;

    vc1.on("log", () => {
      vc1Called = true;
    });
    vc2.on("log", () => {
      vc2Called = true;
    });

    dom1.window.console.log("yay");
    dom2.window.console.warn("yay");

    assert.isTrue(vc1Called, "vc1 must emit a log event");
    assert.isFalse(vc2Called, "vc2 must not have emitted a log event");
  });

  it("should bubble up messages from iframes", () => {
    const virtualConsole = new VirtualConsole();

    const messages = [];
    virtualConsole.on("log", message => messages.push(message));

    const dom = new JSDOM(`<iframe></iframe>`, { virtualConsole });
    dom.window.console.log("from the parent");
    dom.window.frames[0].console.log("from the iframe");

    assert.deepEqual(messages, ["from the parent", "from the iframe"]);
  });

  it("should show not-implemented messages as \"jsdomError\"s", () => {
    const virtualConsole = new VirtualConsole();
    const dom = new JSDOM(``, { virtualConsole });

    let called = false;
    virtualConsole.on("jsdomError", error => {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, "Not implemented: window.alert");
      called = true;
    });

    dom.window.alert();

    assert.isTrue(called, "The \"jsdomError\" event must have been emitted");
  });

  describe("passing through arguments", () => {
    for (const method of consoleMethods) {
      it(`should pass through arguments to ${method}`, () => {
        const virtualConsole = new VirtualConsole();
        const dom = new JSDOM(``, { virtualConsole });

        let called;
        virtualConsole.on(method, (arg1, arg2, arg3, arg4) => {
          called = true;
          assert.strictEqual(arg1, "1");
          assert.strictEqual(arg2, 2);
          assert.strictEqual(arg3, true);
          assert.strictEqual(arg4, null);
        });

        dom.window.console[method]("1", 2, true, null);

        assert.isTrue(called, `The method ${method} must be called`);
      });
    }
  });

  describe("proxying console methods when using sendTo()", () => {
    for (const method of consoleMethods) {
      it(`should pass through arguments to ${method}`, () => {
        const virtualConsole = new VirtualConsole();
        const dom = new JSDOM(``, { virtualConsole });

        let called;
        const destinationConsole = {
          [method](arg1, arg2, arg3, arg4) {
            called = true;
            assert.strictEqual(arg1, "1");
            assert.strictEqual(arg2, 2);
            assert.strictEqual(arg3, true);
            assert.strictEqual(arg4, null);
          }
        };
        virtualConsole.sendTo(destinationConsole);

        dom.window.console[method]("1", 2, true, null);

        assert.isTrue(called, `The method ${method} on the destination console must have been called`);
      });
    }

    it("should return the instance it was called on", () => {
      const virtualConsole = new VirtualConsole();
      const returnValue = virtualConsole.sendTo({});

      assert.strictEqual(returnValue, virtualConsole);
    });

    it("should forward \"jsdomError\"s to the error method by default", () => {
      const e = new Error("Test message");
      e.detail = { foo: "bar" };

      let called = false;
      const virtualConsole = (new VirtualConsole()).sendTo({
        error(arg1, arg2) {
          assert.strictEqual(arg1, e.stack, "The first argument to error must be the stack property");
          assert.strictEqual(arg2, e.detail, "The second argument to error must be the detail property");
          called = true;
        }
      });

      virtualConsole.emit("jsdomError", e);
      assert.isTrue(called, "The error method on the destination console must have been called");
    });

    it("should not forward \"jsdomError\"s to the error method when asked not to", () => {
      const e = new Error("Test message");
      e.detail = { foo: "bar" };

      let called = false;
      const virtualConsole = (new VirtualConsole()).sendTo({
        error() {
          called = true;
        }
      }, { omitJSDOMErrors: true });

      virtualConsole.emit("jsdomError", e);
      assert.isFalse(called, "The error method on the destination console must *not* have been called");
    });
  });
});
