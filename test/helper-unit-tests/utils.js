"use strict";
const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const utils = require("../../lib/jsdom/utils.js");

describe("Helpers: utils.js", () => {
  specify("isValidTargetOrigin properly validates target origin", () => {
    assert.equal(utils.isValidTargetOrigin("*"), true);
    assert.equal(utils.isValidTargetOrigin("/"), true);
    assert.equal(utils.isValidTargetOrigin("https://www.google.com/"), true);
    assert.equal(utils.isValidTargetOrigin("https://www.google.com"), true);
    assert.equal(utils.isValidTargetOrigin("http://www.google.com/"), true);
    assert.equal(utils.isValidTargetOrigin("http://www.google.com"), true);

    assert.equal(utils.isValidTargetOrigin("www.google.com/"), false);
    assert.equal(utils.isValidTargetOrigin("www.google.com"), false);
    assert.equal(utils.isValidTargetOrigin("google.com"), false);
    assert.equal(utils.isValidTargetOrigin("google"), false);
    assert.equal(utils.isValidTargetOrigin("?"), false);
  });
});
