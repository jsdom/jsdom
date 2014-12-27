"use strict";

var jsdom = require("../..").jsdom;

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
exports["div:last-child > span[title] (GH-972)"] = function (t) {
  var document = jsdom("<div><div><span title='title text'>text</span></div></div>");

  t.doesNotThrow(function () {
    document.firstChild.querySelector("div:last-child > span[title]");
  });

  t.done();
};
