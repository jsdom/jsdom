"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");
const EventEmitter = require("events").EventEmitter;
const injectIFrame = require("../util").injectIFrame;

const consoleMethods = [
  "assert",
  "clear",
  "count",
  "debug",
  "error",
  "group",
  "groupCollapse",
  "groupEnd",
  "info",
  "log",
  "table",
  "time",
  "timeEnd",
  "trace",
  "warn"
];

describe("jsdom/virtual-console", () => {
  specify("jsdom.getVirtualConsole returns an instance of EventEmitter", () => {
    const window = jsdom.jsdom().defaultView;
    const vc = jsdom.getVirtualConsole(window);
    assert.ok(vc instanceof EventEmitter, "getVirtualConsole returns an instance of EventEmitter");
  });

  specify("virtualConsole passes through any arguments", () => {
    const window = jsdom.jsdom().defaultView;
    const vc = jsdom.getVirtualConsole(window);

    for (const method of consoleMethods) {
      let called = false;

      vc.on(method, (arg1, arg2, arg3, arg4) => {
        called = true;
        assert.ok(arg1 === "yay", "virtualConsole.on '" + method + "' passes through any arguments (1)");
        assert.ok(arg2 === "woo", "virtualConsole.on '" + method + "' passes through any arguments (2)");
        assert.ok(arg3 === "wee", "virtualConsole.on '" + method + "' passes through any arguments (3)");
        assert.ok(arg4 === "!!!", "virtualConsole.on '" + method + "' passes through any arguments (4)");
      });
      window.console[method]("yay", "woo", "wee", "!!!");

      assert.ok(called, "virtualConsole emits '" + method + "' event");

      vc.removeAllListeners();
    }
  });

  specify("virtualConsole separates output by window", () => {
    const window1 = jsdom.jsdom().defaultView;
    const window2 = jsdom.jsdom().defaultView;
    const virtualConsole1 = jsdom.getVirtualConsole(window1);
    const virtualConsole2 = jsdom.getVirtualConsole(window2);
    let vc1Called = false;
    let vc2Called = false;

    virtualConsole1.on("log", () => {
      vc1Called = true;
    });
    virtualConsole2.on("log", () => {
      vc2Called = true;
    });

    window1.console.log("yay");

    assert.ok(vc1Called === true, "should forward to window on which console was called");
    assert.ok(vc2Called === false, "should not forward to window on which console was not called");
  });

  specify("virtualConsole.sendTo proxies console methods", () => {
    const window = jsdom.jsdom().defaultView;
    const virtualConsole = jsdom.getVirtualConsole(window);
    const fakeConsole = {};

    for (const method of consoleMethods) {
      fakeConsole[method] = (a, b, c) => {
        assert.deepEqual([a, b, c], ["a", "b", "c"], `sendTo forwards arguments for ${method}`);
      };
    }

    virtualConsole.sendTo(fakeConsole);

    for (const method of consoleMethods) {
      window.console[method]("a", "b", "c");
    }
  });

  specify("createVirtualConsole returns a new virtual console", () => {
    const virtualConsole = jsdom.createVirtualConsole();

    assert.ok(virtualConsole instanceof EventEmitter,
      "createVirtualConsole returns an instance of EventEmitter");
  });

  specify("jsdom.jsdom accepts a virtual console", { async: true }, t => {
    const initialVirtualConsole = jsdom.createVirtualConsole();

    initialVirtualConsole.on("log", message => {
      assert.ok(message === "yes",
        "supplied virtual console emits messages");
      t.done();
    });

    const window = jsdom.jsdom(null, {
      virtualConsole: initialVirtualConsole
    }).defaultView;

    const actualVirtualConsole = jsdom.getVirtualConsole(window);
    assert.ok(initialVirtualConsole === actualVirtualConsole,
      "getVirtualConsole returns the console given in options");

    window.console.log("yes");
  });

  specify("jsdom.env accepts a virtual console", { async: true }, t => {
    const initialVirtualConsole = jsdom.createVirtualConsole();

    initialVirtualConsole.on("log", message => {
      assert.ok(message === "yes",
        "supplied virtual console emits messages");
      t.done();
    });

    jsdom.env({
      html: "",
      virtualConsole: initialVirtualConsole,
      done(err, window) {
        assert.ifError(err);

        const actualVirtualConsole = jsdom.getVirtualConsole(window);
        assert.ok(initialVirtualConsole === actualVirtualConsole,
          "getVirtualConsole returns the console given in options");

        window.console.log("yes");
      }
    });
  });

  specify("virtualConsole option throws on bad input", () => {
    assert.throws(() => jsdom.jsdom(null, { virtualConsole: {} }));
  });

  specify("virtualConsole logs messages from child windows", { async: true }, t => {
    const virtualConsole = jsdom.createVirtualConsole();
    const messages = [];

    virtualConsole.on("log", message => messages.push(message));

    const document = jsdom.jsdom(null, { virtualConsole });
    const window = document.defaultView;
    const iframeWindow = injectIFrame(document).contentWindow;

    window.console.log("parent window");
    iframeWindow.console.log("iframe window");

    window.onload = () => {
      assert.equal(messages.length, 2);
      t.done();
    };
  });

  specify("virtualConsole.sendTo returns its instance of virtualConsole", () => {
    const window = jsdom.jsdom().defaultView;
    const virtualConsole = jsdom.getVirtualConsole(window);
    const actual = virtualConsole.sendTo(console);
    assert.ok(actual === virtualConsole, "sendTo returns its instance of virtualConsole");
  });

  specify("not implemented messages show up as jsdomErrors in the virtual console", { async: true }, t => {
    const virtualConsole = jsdom.createVirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, "Not implemented: window.alert");
      t.done();
    });

    const doc = jsdom.jsdom("", { virtualConsole });
    doc.defaultView.alert();
  });

  specify("virtualConsole.sendTo forwards jsdomErrors to error by default", { async: true }, t => {
    const e = new Error("Test message");
    e.detail = { foo: "bar" };

    const virtualConsole = jsdom.createVirtualConsole().sendTo({
      error(arg1, arg2) {
        assert.strictEqual(arg1, e.stack);
        assert.strictEqual(arg2, e.detail);
        t.done();
      }
    });

    virtualConsole.emit("jsdomError", e);
  });

  specify("virtualConsole.sendTo does not forward jsdomErrors when asked not to", () => {
    const e = new Error("Test message");
    e.detail = { foo: "bar" };

    const virtualConsole = jsdom.createVirtualConsole().sendTo(
      {
        error() {
          assert.fail("should not call error");
        }
      },
      { omitJsdomErrors: true }
    );

    virtualConsole.emit("jsdomError", e);
  });
});
