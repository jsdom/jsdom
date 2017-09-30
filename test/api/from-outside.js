"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../..");

describe("Test cases only possible to test from the outside", () => {
  it("should not register timer after window.close() called", () => {
    const { window } = new JSDOM();

    assert.notEqual(window.setTimeout(() => {}, 100), undefined);

    window.close();

    assert.equal(window.setTimeout(() => {}), undefined);
  });
});
