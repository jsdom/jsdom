"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../..");

describe("CSS environment", () => {
  it("should empty cached computed styles after closing a window", () => {
    const { window } = new JSDOM("<!doctype html><div style='color: red'></div>");
    const target = window.document.querySelector("div");
    const retained = window.getComputedStyle(target);
    assert.equal(retained.color, "rgb(255, 0, 0)");
    assert(retained.length > 0);

    window.close();

    assert.equal(retained.color, "");
    assert.equal(retained.length, 0);
    const fresh = window.getComputedStyle(target);
    assert.equal(fresh.color, "");
    assert.equal(fresh.length, 0);
  });
});
