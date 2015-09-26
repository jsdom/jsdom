"use strict";
const jsdom = require("../..");

// Tests for window.console
// Spec: https://terinjokes.github.io/console-spec/

exports["console has all methods in spec"] = t => {
  const window = jsdom.jsdom().defaultView;

  const methods = [
    "assert",
    "clear",
    "count",
    "debug",
    "error",
    "info",
    "log",
    "table",
    "trace",
    "warn",
    "group",
    "groupCollapse",
    "groupEnd",
    "time",
    "timeEnd"
  ];

  for (const method of methods) {
    t.ok(typeof window.console[method] === "function", `console has the ${method} method`);
  }

  t.done();
};
