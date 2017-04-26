"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const utils = require("../../lib/jsdom/utils.js");

describe("jsdom/utils", () => {
  specify("defineGetter defines a getter", () => {
    const o = {};
    let called = false;
    const expected = "bar";

    utils.defineGetter(o, "foo", () => {
      called = true;
      return expected;
    });

    const actual = o.foo;
    assert.equal(called, true);
    assert.equal(actual, expected);
  });

  specify("defineGetter replaces existing getters", () => {
    const o = {};
    let originalCalled = false;
    let newCalled = false;

    utils.defineGetter(o, "foo", () => {
      originalCalled = true;
    });
    utils.defineGetter(o, "foo", () => {
      newCalled = true;
    });

    /* eslint-disable no-unused-expressions */
    o.foo;
    /* eslint-enable no-unused-expressions */

    assert.equal(originalCalled, false);
    assert.equal(newCalled, true);
  });

  specify("defineGetter does not remove existing setters", () => {
    const o = {};
    let called = false;
    const expected = "bar";
    let actual;

    /* eslint-disable accessor-pairs */
    Object.defineProperty(o, "foo", {
      configurable: true,
      set(val) {
        called = true;
        actual = val;
      }
    });
    /* eslint-enable accessor-pairs */

    utils.defineGetter(o, "foo", () => {
      // doesn't matter for this test
    });

    o.foo = expected;
    assert.equal(called, true);
    assert.equal(actual, expected);
  });

  specify("isValidTargetOrigin properly validates target origin", () => {
    assert.strictEqual(utils.isValidTargetOrigin("*"), true);
    assert.strictEqual(utils.isValidTargetOrigin("/"), true);
    assert.strictEqual(utils.isValidTargetOrigin("https://www.google.com/"), true);
    assert.strictEqual(utils.isValidTargetOrigin("https://www.google.com"), true);
    assert.strictEqual(utils.isValidTargetOrigin("http://www.google.com/"), true);
    assert.strictEqual(utils.isValidTargetOrigin("http://www.google.com"), true);

    assert.strictEqual(utils.isValidTargetOrigin("www.google.com/"), false);
    assert.strictEqual(utils.isValidTargetOrigin("www.google.com"), false);
    assert.strictEqual(utils.isValidTargetOrigin("google.com"), false);
    assert.strictEqual(utils.isValidTargetOrigin("google"), false);
    assert.strictEqual(utils.isValidTargetOrigin("?"), false);
  });

  specify("parseDataUrl should handle empty base64 data urls", () => {
    assert.strictEqual(utils.parseDataUrl("data:text/css;base64,").buffer.toString(), "");
  });
});
