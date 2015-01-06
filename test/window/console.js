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
