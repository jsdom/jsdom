"use strict";
const jsdom = require("../..").jsdom;

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
exports["div:last-child > span[title] (GH-972)"] = function (t) {
  const document = jsdom("<div><div><span title='title text'>text</span></div></div>");

  t.doesNotThrow(function () {
    document.firstChild.querySelector("div:last-child > span[title]");
  });

  t.done();
};

exports["div[title=''] (GH-1163)"] = function (t) {
  const document = jsdom(`<!doctype html><html><head></head><body>
    <div></div><div title=""></div><div title="yes"></div>
  </body></html>`);

  t.strictEqual(document.querySelectorAll("div[title='']").length, 1);
  t.strictEqual(document.querySelectorAll("div[title][title='']").length, 1);
  t.done();
};
