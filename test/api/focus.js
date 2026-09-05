"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("document.hasFocus() during a within-document focus transfer (GH-3794)", () => {
  it("stays true inside the blur and focus handlers when focus moves between elements", () => {
    const { window: { document } } = new JSDOM(`<input id="one" /><input id="two" />`);
    const one = document.getElementById("one");
    const two = document.getElementById("two");
    one.focus();

    const seen = [];
    document.addEventListener("blur", () => {
      seen.push(["blur", document.hasFocus(), document.activeElement]);
    }, { capture: true });
    document.addEventListener("focus", () => {
      seen.push(["focus", document.hasFocus()]);
    }, { capture: true });

    two.focus();

    // The document keeps focus throughout the transfer...
    assert.deepEqual(seen.map(([type, has]) => [type, has]), [["blur", true], ["focus", true]]);
    // ...even though no element is focused while the blur runs: activeElement is
    // <body> at that point, per the HTML focus update steps.
    assert.equal(seen[0][2], document.body);
    assert.equal(document.activeElement, two);
    assert.equal(document.hasFocus(), true);
  });
});
