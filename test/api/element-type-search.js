"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

// Regression test for https://github.com/jsdom/jsdom/issues/3882
// The <search> element is grouping content and uses the HTMLElement interface,
// not HTMLUnknownElement.
describe("<search> element type (GH-3882)", () => {
  it("should be an HTMLElement when created via createElement", () => {
    const { window } = new JSDOM();
    const el = window.document.createElement("search");

    assert.equal(el.constructor, window.HTMLElement);
    assert.notEqual(el.constructor, window.HTMLUnknownElement);
  });

  it("should be an HTMLElement when produced by the HTML parser", () => {
    const { window } = new JSDOM(`<search></search>`);
    const el = window.document.querySelector("search");

    assert.equal(el.constructor, window.HTMLElement);
    assert.notEqual(el.constructor, window.HTMLUnknownElement);
  });
});
