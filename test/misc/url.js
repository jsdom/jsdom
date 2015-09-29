"use strict";
const jsdom = require("../..");

exports["URL should exist and work in initialized Window"] = t => {
  const window = jsdom.jsdom().defaultView;
  t.ok(window.URL, "URL exists");

  const url = new window.URL("http://example.com");
  t.strictEqual(url.hostname, "example.com");

  t.done();
};
