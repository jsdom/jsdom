"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const utils = require("../../lib/jsdom/utils.js");

describe("Helpers: utils.js", () => {
  test("isValidTargetOrigin properly validates target origin", () => {
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
