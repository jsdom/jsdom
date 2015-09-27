"use strict";
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

exports["jsdom.getVirtualConsole returns an instance of EventEmitter"] = t => {
  const window = jsdom.jsdom().defaultView;
  const vc = jsdom.getVirtualConsole(window);
  t.ok(vc instanceof EventEmitter, "getVirtualConsole returns an instance of EventEmitter");
  t.done();
};

exports["virtualConsole passes through any arguments"] = t => {
  const window = jsdom.jsdom().defaultView;
  const vc = jsdom.getVirtualConsole(window);

  for (const method of consoleMethods) {
    let called = false;

    vc.on(method, (arg1, arg2) => {
      called = true;
      t.ok(arg1 === "yay", "virtualConsole.on '" + method + "' passes through any arguments (1)");
      t.ok(arg2 === "woo", "virtualConsole.on '" + method + "' passes through any arguments (2)");
    });
    window.console[method]("yay", "woo");

    t.ok(called, "virtualConsole emits '" + method + "' event");

    vc.removeAllListeners();
  }

  t.done();
};

exports["virtualConsole separates output by window"] = t => {
  const window1 = jsdom.jsdom().defaultView;
  const window2 = jsdom.jsdom().defaultView;
  const virtualConsole1 = jsdom.getVirtualConsole(window1);
  const virtualConsole2 = jsdom.getVirtualConsole(window2);
  let vc1Called = false;
  let vc2Called = false;

  virtualConsole1.on("log", () => vc1Called = true);
  virtualConsole2.on("log", () => vc2Called = true);

  window1.console.log("yay");

  t.ok(vc1Called === true, "should forward to window on which console was called");
  t.ok(vc2Called === false, "should not forward to window on which console was not called");

  t.done();
};

exports["virtualConsole.sendTo proxies console methods"] = t => {
  t.expect(consoleMethods.length);

  const window = jsdom.jsdom().defaultView;
  const virtualConsole = jsdom.getVirtualConsole(window);
  const fakeConsole = {};

  for (const method of consoleMethods) {
    fakeConsole[method] = () => {
      t.ok(true, "sendTo works on all console methods");
    };
  }

  virtualConsole.sendTo(fakeConsole);

  for (const method of consoleMethods) {
    window.console[method]();
  }

  t.done();
};

exports["createVirtualConsole returns a new virtual console"] = t => {
  const virtualConsole = jsdom.createVirtualConsole();

  t.ok(virtualConsole instanceof EventEmitter,
    "createVirtualConsole returns an instance of EventEmitter");

  t.done();
};

exports["jsdom.jsdom accepts a virtual console"] = t => {
  t.expect(2);
  const initialVirtualConsole = jsdom.createVirtualConsole();

  initialVirtualConsole.on("log", message => {
    t.ok(message === "yes",
      "supplied virtual console emits messages");
    t.done();
  });

  const window = jsdom.jsdom(null, {
    virtualConsole: initialVirtualConsole
  }).defaultView;

  const actualVirtualConsole = jsdom.getVirtualConsole(window);
  t.ok(initialVirtualConsole === actualVirtualConsole,
    "getVirtualConsole returns the console given in options");

  window.console.log("yes");
};

exports["jsdom.env accepts a virtual console"] = t => {
  t.expect(3);
  const initialVirtualConsole = jsdom.createVirtualConsole();

  initialVirtualConsole.on("log", message => {
    t.ok(message === "yes",
      "supplied virtual console emits messages");
    t.done();
  });

  jsdom.env({
    html: "",
    virtualConsole: initialVirtualConsole,
    done(err, window) {
      t.ifError(err);

      const actualVirtualConsole = jsdom.getVirtualConsole(window);
      t.ok(initialVirtualConsole === actualVirtualConsole,
        "getVirtualConsole returns the console given in options");

      window.console.log("yes");
    }
  });
};

exports["virtualConsole option throws on bad input"] = t => {
  t.throws(() => jsdom.jsdom(null, { virtualConsole: {} }));
  t.done();
};

exports["virtualConsole logs messages from child windows"] = t => {
  const virtualConsole = jsdom.createVirtualConsole();
  const messages = [];

  virtualConsole.on("log", message => messages.push(message));

  const document = jsdom.jsdom(null, { virtualConsole });
  const window = document.defaultView;
  const iframeWindow = injectIFrame(document).contentWindow;

  window.console.log("parent window");
  iframeWindow.console.log("iframe window");

  window.onload = () => {
    t.equal(messages.length, 2);
    t.done();
  };
};

exports["virtualConsole.sendTo returns its instance of virtualConsole"] = t => {
  const window = jsdom.jsdom().defaultView;
  const virtualConsole = jsdom.getVirtualConsole(window);
  const actual = virtualConsole.sendTo(console);
  t.ok(actual === virtualConsole, "sendTo returns its instance of virtualConsole");
  t.done();
};

exports["not implemented messages show up as jsdomErrors in the virtual console"] = t => {
  const virtualConsole = jsdom.createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.equal(error.message, "Not implemented: window.alert");
    t.done();
  });

  const doc = jsdom.jsdom("", { virtualConsole });
  doc.defaultView.alert();
};

exports["virtualConsole.sendTo forwards jsdomErrors to error by default"] = t => {
  t.expect(2);

  const e = new Error("Test message");
  e.detail = { foo: "bar" };

  const virtualConsole = jsdom.createVirtualConsole().sendTo({
    error(arg1, arg2) {
      t.strictEqual(arg1, e.stack);
      t.strictEqual(arg2, e.detail);
      t.done();
    }
  });

  virtualConsole.emit("jsdomError", e);
};

exports["virtualConsole.sendTo does not forward jsdomErrors when asked not to"] = t => {
  const e = new Error("Test message");
  e.detail = { foo: "bar" };

  const virtualConsole = jsdom.createVirtualConsole().sendTo(
    {
      error() {
        t.fail("should not call error");
      }
    },
    { omitJsdomErrors: true }
  );

  virtualConsole.emit("jsdomError", e);
  t.done();
};
