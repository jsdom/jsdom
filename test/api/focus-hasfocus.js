"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

// Regression test for https://github.com/jsdom/jsdom/issues/3794
// While focus transfers between two elements of the same document, the document never loses
// focus, so document.hasFocus() must stay true inside the blur handler of the element losing
// focus and the focus handler of the element gaining it.
describe("document.hasFocus() while focus moves within the document (GH-3794)", () => {
  it("stays true inside the blur and focus handlers during a focus transfer", () => {
    const { window: { document } } = new JSDOM(`<input id="one" /><input id="two" />`);
    const events = [];

    document.addEventListener("blur", () => {
      events.push(`blur ${document.hasFocus()}`);
    }, { capture: true });
    document.addEventListener("focus", () => {
      events.push(`focus ${document.hasFocus()}`);
    }, { capture: true });

    document.getElementById("one").focus();
    document.getElementById("two").focus();

    assert.deepEqual(events, ["focus true", "blur true", "focus true"]);
  });

  it("still reports the blurred element as document.activeElement inside its blur handler", () => {
    const { window: { document } } = new JSDOM(`<input id="one" /><input id="two" />`);
    let activeIdDuringBlur = null;

    document.getElementById("one").addEventListener("blur", () => {
      activeIdDuringBlur = document.activeElement.id;
    });

    document.getElementById("one").focus();
    document.getElementById("two").focus();

    assert.equal(activeIdDuringBlur, "one");
  });

  it("becomes false after the sole focused element is blurred", () => {
    const { window: { document } } = new JSDOM(`<input id="one" />`);
    const one = document.getElementById("one");

    one.focus();
    assert.equal(document.hasFocus(), true);

    one.blur();
    assert.equal(document.hasFocus(), false);
    assert.equal(document.activeElement, document.body);
  });
});
