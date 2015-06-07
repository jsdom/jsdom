"use strict";

var jsdom = require("../..");

exports["URL should exist and work in initialized Window"] = function (t) {
  var window = jsdom.jsdom().defaultView;
  t.ok(window.URL, "URL exists");

  var url = new window.URL("http://example.com");
  t.strictEqual(url.hostname, "example.com");

  t.done();
};
