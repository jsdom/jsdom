"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");

// These tests are regression tests, not systematic serialization tests. They are compiled from the bug tracker.

describe("jsdom/serialization", () => {
  test("style attribute should not appear when accessing style property (GH-1109)", () => {
    const { document } = (new JSDOM("<p>hello</p>")).window;
    const p = document.querySelector("p");

    assert.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear before");

    /* eslint-disable no-unused-expressions */
    p.style;
    /* eslint-enable no-unused-expressions */

    assert.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear after");
  });

  test("void elements should serialize correctly", () => {
    const html = "<html><head></head><body><div><br><hr><audio><source></audio></div></body></html>";

    assert.equal((new JSDOM(html)).serialize(), html);
  });

  test("outerHTML should not format the HTML (GH-371)", () => {
    const originalHTML = "<li><span>A</span><span>B</span></li>";
    const { document } = (new JSDOM(originalHTML)).window;
    const { outerHTML } = document.body.firstChild;

    assert.equal(outerHTML, originalHTML);
  });
});
