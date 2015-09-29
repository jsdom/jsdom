"use strict";
const jsdom = require("../..");

let el;
let window;

exports.setUp = done => {
  const doc = jsdom.jsdom();
  el = doc.createElement("p");
  window = doc.defaultView;

  done();
};

exports["classList is a DOMTokenList"] = t => {
  // when element has no class
  t.equal(el.classList.constructor, window.DOMTokenList);

  // when element has a class
  el.className = "foo";
  t.equal(el.classList.constructor, window.DOMTokenList);

  t.done();
};

exports[".length returns number of tokens"] = t => {
  t.equal(el.classList.length, 0);

  el.className = "foo";
  t.equal(el.classList.length, 1);

  el.className = "foo foo";
  t.equal(el.classList.length, 1);

  el.className = "foo foo bar";
  t.equal(el.classList.length, 2);

  t.done();
};

exports[".item(index) returns expected token"] = t => {
  el.className = "foo bar";
  t.equal(el.classList.item(0), "foo");
  t.equal(el.classList.item(1), "bar");

  // when provided index equal to or greater than length, return null
  t.equal(el.classList.item(2), null);

  // when provided index negative, return null
  t.equal(el.classList.item(-1), null);
  t.equal(el.classList.item(-2), null);

  t.done();
};

exports["[index] returns expected token"] = t => {
  el.className = "foo bar";
  t.equal(el.classList[0], "foo");
  t.equal(el.classList[1], "bar");

  // when provided index equal to or greater than length, return undefined
  t.equal(el.classList[2], undefined);

  t.done();
};

exports[".contains(token) returns whether token exists"] = t => {
  el.className = "foo bar";

  // token exists
  t.ok(el.classList.contains("foo"));
  t.ok(el.classList.contains("bar"));

  // token does not exist
  t.equals(el.classList.contains("baz"), false);

  t.done();
};

exports[".contains() throws if token empty"] = t => {
  function block() {
    el.classList.contains("");
  }

  // TODO: should be SyntaxError
  t.throws(block, window.DOMException);

  t.done();
};

exports[".contains() throws if token contains whitespace"] = t => {
  function block() {
    el.classList.contains(" ");
  }

  // TODO: should be InvalidCharacterError
  t.throws(block, window.DOMException);

  t.done();
};

exports[".add(tokens...) adds provided tokens"] = t => {
  // add zero tokens
  el.classList.add();
  t.equals(el.className, "");
  t.equals(el.classList.length, 0);

  // add one token
  el.classList.add("foo");
  t.equals(el.className, "foo");
  t.equals(el.classList[0], "foo");

  // add one token twice
  el.classList.add("foo", "foo");
  t.equals(el.className, "foo");
  t.equals(el.classList[0], "foo");

  // add two distinct tokens
  el.className = "";
  el.classList.add("foo", "bar");
  t.equals(el.className, "foo bar");
  t.equals(el.classList[0], "foo");
  t.equals(el.classList[1], "bar");

  t.done();
};

exports[".add() throws if a token is empty"] = t => {
  function block() {
    el.classList.add("foo", "");
  }

  // TODO: should be SyntaxError
  t.throws(block, window.DOMException);

  t.done();
};

exports[".add() throws if a token contains whitespace"] = t => {
  function block() {
    el.classList.add("  foo", "bar");
  }

  // TODO: should be InvalidCharacterError
  t.throws(block, window.DOMException);

  t.done();
};

exports[".remove(tokens...) removes provided tokens"] = t => {
  // remove exactly all tokens
  el.className = "foo bar";
  el.classList.remove("bar", "foo");
  t.equals(el.className, "");
  t.equals(el.classList.length, 0);

  // remove more tokens than exist
  el.className = "foo bar";
  el.classList.remove("bar");
  t.equals(el.className, "foo");
  t.equals(el.classList[0], "foo");

  // remove some of the tokens
  el.className = "foo";
  el.classList.remove("foo", "bar");
  t.equals(el.className, "");
  t.equals(el.classList.length, 0);

  // remove one token twice
  el.className = "foo bar";
  el.classList.remove("bar", "bar");
  t.equals(el.className, "foo");
  t.equals(el.classList[0], "foo");

  // remove repeated token
  el.className = "foo foo";
  el.classList.remove("foo");
  t.equals(el.className, "");
  t.equals(el.classList.length, 0);

  t.done();
};

exports[".remove() throws if a token is empty"] = t => {
  function block() {
    el.classList.remove("foo", "");
  }

  // TODO: should be SyntaxError
  t.throws(block, window.DOMException);

  t.done();
};

exports[".remove() throws if a token contains whitespace"] = t => {
  function block() {
    el.classList.remove("  foo", "bar");
  }

  // TODO: should be InvalidCharacterError
  t.throws(block, window.DOMException);

  t.done();
};

exports[".toggle(token) toggles specified token"] = t => {
  // toggle existing token
  el.className = "foo";
  el.classList.toggle("foo");
  t.equals(el.className, "");
  t.equals(el.classList.length, 0);

  // toggle token not present
  el.className = "";
  el.classList.toggle("foo");
  t.equals(el.className, "foo");
  t.equals(el.classList[0], "foo");

  t.done();
};

exports[".toggle(token, true) adds token"] = t => {
  // add token already present
  el.className = "foo";
  el.classList.toggle("foo", true);
  t.equals(el.className, "foo");
  t.equals(el.classList[0], "foo");

  // add token not present
  el.className = "";
  el.classList.toggle("foo", true);
  t.equals(el.className, "foo");
  t.equals(el.classList[0], "foo");

  t.done();
};

exports[".toggle(token, false) removes token"] = t => {
  // remove existing token
  el.className = "foo";
  el.classList.toggle("foo", false);
  t.equals(el.className, "");
  t.equals(el.classList.length, 0);

  // remove a token that does not exist
  el.className = "";
  el.classList.toggle("foo", false);
  t.equals(el.className, "");
  t.equals(el.classList.length, 0);

  t.done();
};

exports[".toggle(token) returns whether token exists"] = t => {
  // token toggled off
  el.className = "foo";
  t.equals(el.classList.toggle("foo"), false);

  // token toggled on
  el.className = "";
  t.equals(el.classList.toggle("foo"), true);

  t.done();
};

exports[".toggle() throws if a token is empty"] = t => {
  function block() {
    el.classList.toggle("");
  }

  // TODO: should be SyntaxError
  t.throws(block, window.DOMException);

  t.done();
};

exports[".toggle() throws if a token contains whitespace"] = t => {
  function block() {
    el.classList.toggle("  foo");
  }

  // TODO: should be InvalidCharacterError
  t.throws(block, window.DOMException);

  t.done();
};

exports["accessing classList should remove duplicates"] = t => {
  el.className = "a a";

  /* eslint-disable no-unused-expressions */
  el.classList;
  /* eslint-enable no-unused-expressions */

  t.equal(el.className, "a a");
  t.equal(el.classList.toString(), "a");

  t.done();
};

exports[".toString() should return empty string when empty"] = t => {
  t.equal(el.classList.toString(), "");

  t.done();
};

exports["classList should return same object"] = t => {
  const classList = el.classList;
  t.equal(classList, el.classList);

  el.className = "foo foo";
  t.equal(classList, el.classList);

  t.done();
};

exports["length should be readonly"] = t => {
  const classList = el.classList;
  t.equal(classList.length, 0);

  t.throws(() => {
    classList.length = "an apple";
  }, TypeError);

  t.done();
};
