"use strict";

const jsdom = require("../..").jsdom;

// These tests are regression tests, not systematic serialization tests. They are compiled from the bug tracker.

exports["style attribute should not appear when accessing style property (GH-1109)"] = function (t) {
  const doc = jsdom("<p>hello</p>");
  const p = doc.querySelector("p");

  t.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear before");

  /* jshint -W030 */
  p.style;
  /* jshint +W030 */


  t.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear after");

  t.done();
};
