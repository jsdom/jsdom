"use strict";
const assert = require("node:assert/strict");
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

    assert.equal(vc1Called, true, "vc1 must emit a log event");
    assert.equal(vc2Called, false, "vc2 must not have emitted a log event");
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

  describe("passing through arguments", () => {
    for (const method of consoleMethods) {
      it(`should pass through arguments to ${method}`, () => {
        const virtualConsole = new VirtualConsole();
        const dom = new JSDOM(``, { virtualConsole });

        let called;
        virtualConsole.on(method, (arg1, arg2, arg3, arg4) => {
          called = true;
          assert.equal(arg1, "1");
          assert.equal(arg2, 2);
          assert.equal(arg3, true);
          assert.equal(arg4, null);
        });

        dom.window.console[method]("1", 2, true, null);

        assert.equal(called, true, `The method ${method} must be called`);
      });
    }
  });

  describe("proxying console methods when using forwardTo()", () => {
    for (const method of consoleMethods) {
      it(`should pass through arguments to ${method}`, () => {
        const virtualConsole = new VirtualConsole();
        const dom = new JSDOM(``, { virtualConsole });

        let called;
        const destinationConsole = {
          [method](arg1, arg2, arg3, arg4) {
            called = true;
            assert.equal(arg1, "1");
            assert.equal(arg2, 2);
            assert.equal(arg3, true);
            assert.equal(arg4, null);
          }
        };
        virtualConsole.forwardTo(destinationConsole);

        dom.window.console[method]("1", 2, true, null);

        assert.equal(called, true, `The method ${method} on the destination console must have been called`);
      });
    }

    it("should return the instance it was called on", () => {
      const virtualConsole = new VirtualConsole();
      const returnValue = virtualConsole.forwardTo({});

      assert.equal(returnValue, virtualConsole);
    });

    describe("jsdom errors", () => {
      it("should forward to the error() method by default, sending the message for most types", () => {
        let calledTimes = 0;
        const virtualConsole = (new VirtualConsole()).forwardTo({
          error(...args) {
            assert.deepEqual(args, ["Test message"]);
            ++calledTimes;
          }
        });

        const typesToTest = ["css-parsing", "not-implemented", "resource-loading"];
        for (const type of typesToTest) {
          const e = new Error("Test message");
          e.type = type;
          virtualConsole.emit("jsdomError", e);
        }
        assert.equal(
          calledTimes,
          typesToTest.length,
          "The error method on the destination console must have been called for each type"
        );
      });

      it("should forward \"unhandled-exception\"s to the error() method by default, sending the cause stack", () => {
        const cause = new Error("Test cause");
        const e = new Error("Test message", { cause });
        e.type = "unhandled-exception";

        let called = false;
        const virtualConsole = (new VirtualConsole()).forwardTo({
          error(...args) {
            assert.deepEqual(args, [e.cause.stack]);
            called = true;
          }
        });

        virtualConsole.emit("jsdomError", e);
        assert.equal(called, true, "The error method on the destination console must have been called");
      });

      it("should not forward to the error method when set to \"none\"", () => {
        let called = false;
        const virtualConsole = (new VirtualConsole()).forwardTo({
          error() {
            called = true;
          }
        }, { jsdomErrors: "none" });

        const typesToTest = ["css-parsing", "not-implemented", "resource-loading", "unhandled-exception", "bogus-type"];
        for (const type of typesToTest) {
          const e = new Error("Test message");
          e.type = type;
          virtualConsole.emit("jsdomError", e);
        }

        assert.equal(called, false, "The error method on the destination console must *not* have been called");
      });

      it("should only forward specific types when they are specified as an array", () => {
        const typesToForward = ["css-parsing", "not-implemented"];

        const records = [];
        const virtualConsole = (new VirtualConsole()).forwardTo({
          error(...args) {
            records.push(args);
          }
        }, { jsdomErrors: typesToForward });

        const typesToTest = ["css-parsing", "not-implemented", "resource-loading", "unhandled-exception", "bogus-type"];
        for (const type of typesToTest) {
          const e = new Error(type);
          e.type = type;
          virtualConsole.emit("jsdomError", e);
        }

        assert.deepEqual(records, [
          ["css-parsing"],
          ["not-implemented"]
        ]);
      });

      it("should not accept an invalid jsdomErrors option", () => {
        assert.throws(() => {
          (new VirtualConsole()).forwardTo({}, { jsdomErrors: "not an array or none" });
        }, TypeError);
      });
    });
  });
});
