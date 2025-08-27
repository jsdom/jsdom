"use strict";

const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

const nonInheritedTags = [
  "abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "dd", "dfn", "dt", "em", "figcaption",
  "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rp", "rt", "ruby", "s",
  "samp", "search", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr"
];

describe("htmlelement", () => {
  specify("unknown elements should return HTMLUnknownElement", () => {
    const doc = (new JSDOM()).window.document;

    const el = doc.createElement("foobar");
    assert.ok(
      el.constructor === doc.defaultView.HTMLUnknownElement,
      "unknown element should inherit from HTMLUnknownElement (createElement)"
    );
    assert.ok(
      el instanceof doc.defaultView.HTMLElement,
      "unknown element should inherit from HTMLElement too (createElement)"
    );

    const doc2 = (new JSDOM("<foobar>")).window.document;
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
    const doc = (new JSDOM()).window.document;

    const el = doc.createElement("div");
    assert.ok(
      el.constructor === doc.defaultView.HTMLDivElement,
      "div element should inherit from HTMLDivElement (createElement)"
    );
    assert.ok(
      el instanceof doc.defaultView.HTMLElement,
      "div element should inherit from HTMLElement too (createElement)"
    );

    const doc2 = (new JSDOM("<div>")).window.document;
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
      const doc = (new JSDOM("<body><" + nonInheritedTags[i] + "></body>")).window.document;
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
