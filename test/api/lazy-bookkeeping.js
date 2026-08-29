"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const idlUtils = require("../../lib/generated/idl/utils.js");

describe("Lazy DOM bookkeeping", () => {
  it("allocates event listener storage when a listener is added", () => {
    const { Event, EventTarget } = (new JSDOM()).window;
    const target = new EventTarget();
    const targetImpl = idlUtils.implForWrapper(target);

    assert.equal(targetImpl._eventListeners, null);

    target.dispatchEvent(new Event("test"));
    target.removeEventListener("test", () => {});
    assert.equal(targetImpl._eventListeners, null);

    let callCount = 0;
    target.addEventListener("test", () => {
      ++callCount;
    });
    assert.notEqual(targetImpl._eventListeners, null);

    target.dispatchEvent(new Event("test"));
    assert.equal(callCount, 1);
  });

  it("allocates live Range storage for boundary containers", () => {
    const { document } = (new JSDOM()).window;
    const element = document.createElement("div");
    const elementImpl = idlUtils.implForWrapper(element);

    assert.equal(elementImpl._referencedRanges, null);

    const range = document.createRange();
    assert.equal(elementImpl._referencedRanges, null);

    range.selectNodeContents(element);
    assert.equal(elementImpl._referencedRanges.size, 1);

    range.selectNodeContents(document);
    assert.equal(elementImpl._referencedRanges.size, 0);
  });
});
