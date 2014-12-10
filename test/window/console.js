"use strict";

var jsdom = require("../..").jsdom;

// Tests for window.console
// Spec: https://terinjokes.github.io/console-spec/

exports["console has all methods in spec"] = function (t) {
  var window = jsdom().parentWindow;

  var methods = [
    'assert',
    'clear',
    'count',
    'debug',
    'error',
    'info',
    'log',
    'table',
    'trace',
    'warn',
    'group',
    'groupCollapse',
    'groupEnd',
    'time',
    'timeEnd'
  ];

  methods.forEach(function (method) {
    t.ok(typeof window.console[method] === "function", "console has the " + method + " method");
  });

  t.done();
};

exports["only console.error should put errors in the window.document.errors array"] = function (t) {
  var window = jsdom("<!DOCTYPE html><html><body>Hi</body></html>").parentWindow;

  window.console.log("foo");
  window.console.info("bar");
  window.console.warn("baz");
  window.console.error("qux");

  t.deepEqual(window.document.errors, [{ type: "error", message: "qux", data: null }]);
  t.done();
};

exports["should send errors to the correct window when multiple are in play (GH-658)"] = function (t) {
  var window1 = jsdom("<!DOCTYPE html><html><body>Hi</body></html>").parentWindow;
  var window2 = jsdom("<!DOCTYPE html><html><body>Hi</body></html>").parentWindow;

  window1.console.error("foo");
  window2.console.error("bar");

  t.notEqual(window1.console, window2.console);
  t.deepEqual(window1.document.errors, [{ type: "error", message: "foo", data: null }]);
  t.deepEqual(window2.document.errors, [{ type: "error", message: "bar", data: null }]);
  t.done();
};
