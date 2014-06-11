"use strict";

var jsdom = require("../..");

exports["cookieEnabled should be true on the navigator object"] = function (t) {
  var window = jsdom.jsdom().createWindow();
  t.strictEqual(window.navigator.cookieEnabled, true, "cookie enabled");
  t.done();
};
