"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const utils = require("../../lib/jsdom/utils.js");

describe("Helpers: utils.js", () => {
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
});
