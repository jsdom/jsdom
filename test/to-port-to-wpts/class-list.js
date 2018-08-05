"use strict";

const { assert } = require("chai");
const { beforeEach, describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

let el;
let window;

describe("class-list", () => {
  beforeEach(() => {
    window = (new JSDOM()).window;
    el = window.document.createElement("p");
  });

  specify("classList is a DOMTokenList", () => {
    // when element has no class
    assert.equal(el.classList.constructor, window.DOMTokenList);

    // when element has a class
    el.className = "foo";
    assert.equal(el.classList.constructor, window.DOMTokenList);
  });

  specify(".length returns number of tokens", () => {
    assert.equal(el.classList.length, 0);

    el.className = "foo";
    assert.equal(el.classList.length, 1);

    el.className = "foo foo";
    assert.equal(el.classList.length, 1);

    el.className = "foo foo bar";
    assert.equal(el.classList.length, 2);
  });

  specify(".item(index) returns expected token", () => {
    el.className = "foo bar";
    assert.equal(el.classList.item(0), "foo");
    assert.equal(el.classList.item(1), "bar");

    // when provided index equal to or greater than length, return null
    assert.equal(el.classList.item(2), null);

    // when provided index negative, return null
    assert.equal(el.classList.item(-1), null);
    assert.equal(el.classList.item(-2), null);
  });

  specify("[index] returns expected token", () => {
    el.className = "foo bar";
    assert.equal(el.classList[0], "foo");
    assert.equal(el.classList[1], "bar");

    // when provided index equal to or greater than length, return undefined
    assert.equal(el.classList[2], undefined);
  });

  specify(".contains(token) returns whether token exists", () => {
    el.className = "foo bar";

    // token exists
    assert.ok(el.classList.contains("foo"));
    assert.ok(el.classList.contains("bar"));

    // token does not exist
    assert.equal(el.classList.contains("baz"), false);
  });

  specify(".add(tokens...) adds provided tokens", () => {
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

  specify(".add() throws if a token is empty", () => {
    function block() {
      el.classList.add("foo", "");
    }

    assert.throwsDomException(block, el.ownerDocument, "SyntaxError");
  });

  specify(".add() throws if a token contains whitespace", () => {
    function block() {
      el.classList.add("  foo", "bar");
    }

    assert.throwsDomException(block, el.ownerDocument, "InvalidCharacterError");
  });

  specify(".remove(tokens...) removes provided tokens", () => {
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

  specify(".remove() throws if a token is empty", () => {
    function block() {
      el.classList.remove("foo", "");
    }

    assert.throwsDomException(block, el.ownerDocument, "SyntaxError");
  });

  specify(".remove() throws if a token contains whitespace", () => {
    function block() {
      el.classList.remove("  foo", "bar");
    }

    assert.throwsDomException(block, el.ownerDocument, "InvalidCharacterError");
  });

  specify(".toggle(token) toggles specified token", () => {
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

  specify(".toggle(token, true) adds token", () => {
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

  specify(".toggle(token, false) removes token", () => {
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

  specify(".toggle(token) returns whether token exists", () => {
    // token toggled off
    el.className = "foo";
    assert.equal(el.classList.toggle("foo"), false);

    // token toggled on
    el.className = "";
    assert.equal(el.classList.toggle("foo"), true);
  });

  specify(".toggle() throws if a token is empty", () => {
    function block() {
      el.classList.toggle("");
    }

    assert.throwsDomException(block, el.ownerDocument, "SyntaxError");
  });

  specify(".toggle() throws if a token contains whitespace", () => {
    function block() {
      el.classList.toggle("  foo");
    }

    assert.throwsDomException(block, el.ownerDocument, "InvalidCharacterError");
  });

  specify("accessing classList should not remove duplicates", () => {
    el.className = "a a";

    /* eslint-disable no-unused-expressions */
    el.classList;
    /* eslint-enable no-unused-expressions */

    assert.equal(el.className, "a a");
    assert.equal(el.classList.toString(), "a a");
  });

  specify(".toString() should return empty string when empty", () => {
    assert.equal(el.classList.toString(), "");
  });

  specify("classList should return same object", () => {
    const { classList } = el;
    assert.equal(classList, el.classList);

    el.className = "foo foo";
    assert.equal(classList, el.classList);
  });

  specify("length should be readonly", () => {
    const { classList } = el;
    assert.equal(classList.length, 0);

    assert.throws(() => {
      classList.length = "an apple";
    }, TypeError);
  });
});
