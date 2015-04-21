"use strict";

var jsdom = require("../..");

var nonInheritedTags = [
  "article", "section", "nav", "aside", "hgroup", "header", "footer", "address", "dt",
  "dd", "figure", "figcaption", "main", "em", "strong", "small", "s", "cite", "abbr",
  "code", "i", "b", "u"
];

exports["unknown elements should return HTMLUnknownElement"] = function (t) {
  t.expect(4);

  var doc = jsdom.jsdom();

  var el = doc.createElement("foobar");
  t.ok(el.constructor === doc.defaultView.HTMLUnknownElement,
    "unknown element should inherit from HTMLUnknownElement (createElement)");
  t.ok(el instanceof doc.defaultView.HTMLElement,
    "unknown element should inherit from HTMLElement too (createElement)");

  doc = jsdom.jsdom("<foobar>");
  el = doc.body.firstChild;
  t.ok(el.constructor === doc.defaultView.HTMLUnknownElement,
    "unknown element should inherit from HTMLUnknownElement (parsing)");
  t.ok(el instanceof doc.defaultView.HTMLElement,
    "unknown element should inherit from HTMLElement too (parsing)");

  t.done();
};

exports["other elements should have their respective types"] = function (t) {
  t.expect(4);

  var doc = jsdom.jsdom();

  var el = doc.createElement("div");
  t.ok(el.constructor === doc.defaultView.HTMLDivElement,
    "div element should inherit from HTMLDivElement (createElement)");
  t.ok(el instanceof doc.defaultView.HTMLElement,
    "div element should inherit from HTMLElement too (createElement)");

  doc = jsdom.jsdom("<div>");
  el = doc.body.firstChild;
  t.ok(el.constructor === doc.defaultView.HTMLDivElement,
    "div element should inherit from HTMLDivElement (parsing)");
  t.ok(el instanceof doc.defaultView.HTMLElement,
    "div element should inherit from HTMLElement too (parsing)");

  t.done();
};

exports["non-inherited elements should have the HTMLElement type"] = function (t) {
  t.expect(2 * nonInheritedTags.length);

  for (var i = 0; i < nonInheritedTags.length; ++i) {
    var doc = jsdom.jsdom("<" + nonInheritedTags[i] + ">");
    var el = doc.body.firstChild;
    t.ok(el.constructor === doc.defaultView.HTMLElement,
      nonInheritedTags[i] + " element should be a HTMLElement (parsing)");

    el = doc.createElement(nonInheritedTags[i]);
    t.ok(el.constructor === doc.defaultView.HTMLElement,
      nonInheritedTags[i] + " element should be a HTMLElement (createElement)");

  }

  t.done();
};
