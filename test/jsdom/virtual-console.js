"use strict";

var jsdom = require("../..");
var EventEmitter = require("events").EventEmitter;

var consoleMethods = [
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
  "warn",
];

exports["jsdom.getVirtualConsole returns an instance of EventEmitter"] = function(t) {
  var window = jsdom.jsdom().parentWindow;
  var vc = jsdom.getVirtualConsole(window);
  t.ok(vc instanceof EventEmitter, "getVirtualConsole returns an instance of EventEmitter");
  t.done();
};

exports["virtualConsole passes through any arguments"] = function(t) {
  var window = jsdom.jsdom().parentWindow;
  var vc = jsdom.getVirtualConsole(window);

  consoleMethods.forEach(function (method) {
    var called = false;

    vc.on(method, function (arg1, arg2) {
      called = true;
      t.ok(arg1 === "yay", "virtualConsole.on '"+method+"' passes through any arguments (1)");
      t.ok(arg2 === "woo", "virtualConsole.on '"+method+"' passes through any arguments (2)");
    });
    window.console[method]("yay", "woo");

    t.ok(called, "virtualConsole emits '"+method+"' event");

    vc.removeAllListeners();
  });

  t.done();
};

exports["virtualConsole separates output by window"] = function(t) {
  var window1 = jsdom.jsdom().parentWindow;
  var window2 = jsdom.jsdom().parentWindow;
  var vc1Called = false;
  var vc2Called = false;
  var virtualConsole1 = jsdom.getVirtualConsole(window1);
  var virtualConsole2 = jsdom.getVirtualConsole(window2);

  virtualConsole1.on("log", function () {
    vc1Called = true;
  });
  virtualConsole2.on("log", function () {
    vc2Called = true;
  });

  window1.console.log("yay");

  t.ok(vc1Called === true, "should forward to window on which console was called");
  t.ok(vc2Called === false, "should not forward to window on which console was not called");

  t.done();
};

exports["virtualConsole.sendTo proxies console methods"] = function(t) {
  var window = jsdom.jsdom().parentWindow;
  var virtualConsole = jsdom.getVirtualConsole(window);
  var counter = 0;
  var inc = function () { counter += 1; };
  var fakeConsole = {};

  consoleMethods.forEach(function (method) {
    fakeConsole[method] = inc;
  });

  virtualConsole.sendTo(fakeConsole);

  consoleMethods.forEach(function (method) {
    window.console[method]();
  });

  t.ok(counter === consoleMethods.length, "sendTo works on console methods");

  t.done();
};
