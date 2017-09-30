"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../lib/old-api.js");

const nonInheritedTags = [
  "article", "section", "nav", "aside", "hgroup", "header", "footer", "address", "dt",
  "dd", "figure", "figcaption", "main", "em", "strong", "small", "s", "cite", "abbr",
  "code", "i", "b", "u"
];

describe("htmlelement", () => {
  specify("unknown elements should return HTMLUnknownElement", () => {
    const doc = jsdom.jsdom();

    const el = doc.createElement("foobar");
    assert.ok(
      el.constructor === doc.defaultView.HTMLUnknownElement,
      "unknown element should inherit from HTMLUnknownElement (createElement)"
    );
    assert.ok(
      el instanceof doc.defaultView.HTMLElement,
      "unknown element should inherit from HTMLElement too (createElement)"
    );

    const doc2 = jsdom.jsdom("<foobar>");
    const el2 = doc2.body.firstChild;
    assert.ok(
      el2.constructor === doc2.defaultView.HTMLUnknownElement,
      "unknown element should inherit from HTMLUnknownElement (parsing)"
    );
    assert.ok(
      el2 instanceof doc2.defaultView.HTMLElement,
      "unknown element should inherit from HTMLElement too (parsing)"
    );
  });

  specify("other elements should have their respective types", () => {
    const doc = jsdom.jsdom();

    const el = doc.createElement("div");
    assert.ok(
      el.constructor === doc.defaultView.HTMLDivElement,
      "div element should inherit from HTMLDivElement (createElement)"
    );
    assert.ok(
      el instanceof doc.defaultView.HTMLElement,
      "div element should inherit from HTMLElement too (createElement)"
    );

    const doc2 = jsdom.jsdom("<div>");
    const el2 = doc2.body.firstChild;
    assert.ok(
      el2.constructor === doc2.defaultView.HTMLDivElement,
      "div element should inherit from HTMLDivElement (parsing)"
    );
    assert.ok(
      el2 instanceof doc2.defaultView.HTMLElement,
      "div element should inherit from HTMLElement too (parsing)"
    );
  });

  specify("non-inherited elements should have the HTMLElement type", t => {
    t.timeout(5000); // give this a bit of leeway. It's apparently slow

    for (let i = 0; i < nonInheritedTags.length; ++i) {
      const doc = jsdom.jsdom("<" + nonInheritedTags[i] + ">");
      const el = doc.body.firstChild;
      assert.ok(
        el.constructor === doc.defaultView.HTMLElement,
        nonInheritedTags[i] + " element should be a HTMLElement (parsing)"
      );

      const el2 = doc.createElement(nonInheritedTags[i]);
      assert.ok(
        el2.constructor === doc.defaultView.HTMLElement,
        nonInheritedTags[i] + " element should be a HTMLElement (createElement)"
      );
    }
  });
});
