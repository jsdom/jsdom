"use strict";
const assert = require("node:assert/strict");
const { beforeEach, describe, test } = require("node:test");
const { assertThrowsDOMException } = require("../assert-helpers.js");

const { JSDOM } = require("../..");

let el, window;

describe("class-list", () => {
  beforeEach(() => {
    window = (new JSDOM()).window;
    el = window.document.createElement("p");
  });

  test("classList is a DOMTokenList", () => {
    // when element has no class
    assert.equal(el.classList.constructor, window.DOMTokenList);

    // when element has a class
    el.className = "foo";
    assert.equal(el.classList.constructor, window.DOMTokenList);
  });

  test(".length returns number of tokens", () => {
    assert.equal(el.classList.length, 0);

    el.className = "foo";
    assert.equal(el.classList.length, 1);

    el.className = "foo foo";
    assert.equal(el.classList.length, 1);

    el.className = "foo foo bar";
    assert.equal(el.classList.length, 2);
  });

  test(".item(index) returns expected token", () => {
    el.className = "foo bar";
    assert.equal(el.classList.item(0), "foo");
    assert.equal(el.classList.item(1), "bar");

    // when provided index equal to or greater than length, return null
    assert.equal(el.classList.item(2), null);

    // when provided index negative, return null
    assert.equal(el.classList.item(-1), null);
    assert.equal(el.classList.item(-2), null);
  });

  test("[index] returns expected token", () => {
    el.className = "foo bar";
    assert.equal(el.classList[0], "foo");
    assert.equal(el.classList[1], "bar");

    // when provided index equal to or greater than length, return undefined
    assert.equal(el.classList[2], undefined);
  });

  test(".contains(token) returns whether token exists", () => {
    el.className = "foo bar";

    // token exists
    assert.ok(el.classList.contains("foo"));
    assert.ok(el.classList.contains("bar"));

    // token does not exist
    assert.equal(el.classList.contains("baz"), false);
  });

  test(".add(tokens...) adds provided tokens", () => {
    // add zero tokens
    el.classList.add();
    assert.equal(el.className, "");
    assert.equal(el.classList.length, 0);

    // add one token
    el.classList.add("foo");
    assert.equal(el.className, "foo");
    assert.equal(el.classList[0], "foo");

    // add one token twice
    el.classList.add("foo", "foo");
    assert.equal(el.className, "foo");
    assert.equal(el.classList[0], "foo");

    // add two distinct tokens
    el.className = "";
    el.classList.add("foo", "bar");
    assert.equal(el.className, "foo bar");
    assert.equal(el.classList[0], "foo");
    assert.equal(el.classList[1], "bar");
  });

  test(".add() throws if a token is empty", () => {
    function block() {
      el.classList.add("foo", "");
    }

    assertThrowsDOMException(block, el.ownerDocument, "SyntaxError");
  });

  test(".add() throws if a token contains whitespace", () => {
    function block() {
      el.classList.add("  foo", "bar");
    }

    assertThrowsDOMException(block, el.ownerDocument, "InvalidCharacterError");
  });

  test(".remove(tokens...) removes provided tokens", () => {
    // remove exactly all tokens
    el.className = "foo bar";
    el.classList.remove("bar", "foo");
    assert.equal(el.className, "");
    assert.equal(el.classList.length, 0);

    // remove more tokens than exist
    el.className = "foo bar";
    el.classList.remove("bar");
    assert.equal(el.className, "foo");
    assert.equal(el.classList[0], "foo");

    // remove some of the tokens
    el.className = "foo";
    el.classList.remove("foo", "bar");
    assert.equal(el.className, "");
    assert.equal(el.classList.length, 0);

    // remove one token twice
    el.className = "foo bar";
    el.classList.remove("bar", "bar");
    assert.equal(el.className, "foo");
    assert.equal(el.classList[0], "foo");

    // remove repeated token
    el.className = "foo foo";
    el.classList.remove("foo");
    assert.equal(el.className, "");
    assert.equal(el.classList.length, 0);
  });

  test(".remove() throws if a token is empty", () => {
    function block() {
      el.classList.remove("foo", "");
    }

    assertThrowsDOMException(block, el.ownerDocument, "SyntaxError");
  });

  test(".remove() throws if a token contains whitespace", () => {
    function block() {
      el.classList.remove("  foo", "bar");
    }

    assertThrowsDOMException(block, el.ownerDocument, "InvalidCharacterError");
  });

  test(".toggle(token) toggles specified token", () => {
    // toggle existing token
    el.className = "foo";
    el.classList.toggle("foo");
    assert.equal(el.className, "");
    assert.equal(el.classList.length, 0);

    // toggle token not present
    el.className = "";
    el.classList.toggle("foo");
    assert.equal(el.className, "foo");
    assert.equal(el.classList[0], "foo");
  });

  test(".toggle(token, true) adds token", () => {
    // add token already present
    el.className = "foo";
    el.classList.toggle("foo", true);
    assert.equal(el.className, "foo");
    assert.equal(el.classList[0], "foo");

    // add token not present
    el.className = "";
    el.classList.toggle("foo", true);
    assert.equal(el.className, "foo");
    assert.equal(el.classList[0], "foo");
  });

  test(".toggle(token, false) removes token", () => {
    // remove existing token
    el.className = "foo";
    el.classList.toggle("foo", false);
    assert.equal(el.className, "");
    assert.equal(el.classList.length, 0);

    // remove a token that does not exist
    el.className = "";
    el.classList.toggle("foo", false);
    assert.equal(el.className, "");
    assert.equal(el.classList.length, 0);
  });

  test(".toggle(token) returns whether token exists", () => {
    // token toggled off
    el.className = "foo";
    assert.equal(el.classList.toggle("foo"), false);

    // token toggled on
    el.className = "";
    assert.equal(el.classList.toggle("foo"), true);
  });

  test(".toggle() throws if a token is empty", () => {
    function block() {
      el.classList.toggle("");
    }

    assertThrowsDOMException(block, el.ownerDocument, "SyntaxError");
  });

  test(".toggle() throws if a token contains whitespace", () => {
    function block() {
      el.classList.toggle("  foo");
    }

    assertThrowsDOMException(block, el.ownerDocument, "InvalidCharacterError");
  });

  test("accessing classList should not remove duplicates", () => {
    el.className = "a a";

    /* eslint-disable no-unused-expressions */
    el.classList;
    /* eslint-enable no-unused-expressions */

    assert.equal(el.className, "a a");
    assert.equal(el.classList.toString(), "a a");
  });

  test(".toString() should return empty string when empty", () => {
    assert.equal(el.classList.toString(), "");
  });

  test("classList should return same object", () => {
    const { classList } = el;
    assert.equal(classList, el.classList);

    el.className = "foo foo";
    assert.equal(classList, el.classList);
  });

  test("length should be readonly", () => {
    const { classList } = el;
    assert.equal(classList.length, 0);

    assert.throws(() => {
      classList.length = "an apple";
    }, TypeError);
  });
});
