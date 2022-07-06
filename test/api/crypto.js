"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("window.crypto", () => {
  it("fills a typed array with random values", () => {
    const dom = new JSDOM();
    const arr = dom.window.crypto.getRandomValues(new Uint8Array(256));
    assert.isAbove(arr.reduce((a, b) => a + b), 0);
  });

  it("fills a subclassed typed array with random values (#3395)", () => {
    const dom = new JSDOM();
    class Buffer extends Uint8Array {}
    assert.doesNotThrow(() => dom.window.crypto.getRandomValues(new Buffer(10)));
  });

  it("does not rely on instanceof for type checking", () => {
    const dom = new JSDOM("", { runScripts: "dangerously" });
    class Buffer extends Int8Array {}
    assert.doesNotThrow(() => dom.window.crypto.getRandomValues(new Buffer(10)));
  });

  it("throws a TypeError for non-typed arrays", () => {
    const dom = new JSDOM();
    assert.throws(
      () => dom.window.crypto.getRandomValues(Array(10).fill(0)),
      TypeError
    );
  });

  it("throws a TypeError for dummy arrays", () => {
    class Uint16Array {
      constructor(length) {
        this.length = length;
      }
    }
    const dom = new JSDOM();
    assert.throws(
      () => dom.window.crypto.getRandomValues(new Uint16Array(10)),
      TypeError
    );
  });

  it("throws a TypeMismatchError for non-integer arrays", () => {
    const dom = new JSDOM();
    assert.throws(
      () => dom.window.crypto.getRandomValues(new Float32Array(10))
    );
  });

  it("throws a QuotaExceededError for arrays which are too big", () => {
    const dom = new JSDOM();
    assert.throws(
      () => dom.window.crypto.getRandomValues(new Uint8Array(65537))
    );
  });
});
