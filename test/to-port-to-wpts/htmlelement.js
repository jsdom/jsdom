"use strict";
const jsdom = require("../../lib/old-api.js");

const nonInheritedTags = [
  "article", "section", "nav", "aside", "hgroup", "header", "footer", "address", "dt",
  "dd", "figure", "figcaption", "main", "em", "strong", "small", "s", "cite", "abbr",
  "code", "i", "b", "u"
];

exports["unknown elements should return HTMLUnknownElement"] = t => {
  t.expect(4);

  const doc = jsdom.jsdom();

  const el = doc.createElement("foobar");
  t.ok(el.constructor === doc.defaultView.HTMLUnknownElement,
    "unknown element should inherit from HTMLUnknownElement (createElement)");
  t.ok(el instanceof doc.defaultView.HTMLElement,
    "unknown element should inherit from HTMLElement too (createElement)");

  const doc2 = jsdom.jsdom("<foobar>");
  const el2 = doc2.body.firstChild;
  t.ok(el2.constructor === doc2.defaultView.HTMLUnknownElement,
    "unknown element should inherit from HTMLUnknownElement (parsing)");
  t.ok(el2 instanceof doc2.defaultView.HTMLElement,
    "unknown element should inherit from HTMLElement too (parsing)");

  t.done();
};

exports["other elements should have their respective types"] = t => {
  t.expect(4);

  const doc = jsdom.jsdom();

  const el = doc.createElement("div");
  t.ok(el.constructor === doc.defaultView.HTMLDivElement,
    "div element should inherit from HTMLDivElement (createElement)");
  t.ok(el instanceof doc.defaultView.HTMLElement,
    "div element should inherit from HTMLElement too (createElement)");

  const doc2 = jsdom.jsdom("<div>");
  const el2 = doc2.body.firstChild;
  t.ok(el2.constructor === doc2.defaultView.HTMLDivElement,
    "div element should inherit from HTMLDivElement (parsing)");
  t.ok(el2 instanceof doc2.defaultView.HTMLElement,
    "div element should inherit from HTMLElement too (parsing)");

  t.done();
};

exports["non-inherited elements should have the HTMLElement type"] = t => {
  t.expect(2 * nonInheritedTags.length);

  for (let i = 0; i < nonInheritedTags.length; ++i) {
    const doc = jsdom.jsdom("<" + nonInheritedTags[i] + ">");
    const el = doc.body.firstChild;
    t.ok(el.constructor === doc.defaultView.HTMLElement,
      nonInheritedTags[i] + " element should be a HTMLElement (parsing)");

    const el2 = doc.createElement(nonInheritedTags[i]);
    t.ok(el2.constructor === doc.defaultView.HTMLElement,
      nonInheritedTags[i] + " element should be a HTMLElement (createElement)");
  }

  t.done();
};
