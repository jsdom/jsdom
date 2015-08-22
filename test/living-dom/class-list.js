"use strict";

var load = require("../util").load(__dirname);
var DOMTokenList = require("../../lib/jsdom/living/dom-token-list").DOMTokenList;
var DOMException = require("../../lib/jsdom/web-idl/DOMException");

exports.setUp = function (callback) {
  var doc = load("test");
  this.el = doc.getElementsByTagName("p")[0];
  callback();
};

exports["classList is a DOMTokenList"] = function (t) {
  // when element has no class
  t.equal(this.el.classList.constructor, DOMTokenList);

  // when element has a class
  this.el.className = "foo";
  t.equal(this.el.classList.constructor, DOMTokenList);

  t.done();
};

exports[".length returns number of tokens"] = function (t) {
  t.equal(this.el.classList.length, 0);

  this.el.className = "foo";
  t.equal(this.el.classList.length, 1);

  this.el.className = "foo foo";
  t.equal(this.el.classList.length, 1);

  this.el.className = "foo foo bar";
  t.equal(this.el.classList.length, 2);

  t.done();
};

exports[".item(index) returns expected token"] = function (t) {
  this.el.className = "foo bar";
  t.equal(this.el.classList.item(0), "foo");
  t.equal(this.el.classList.item(1), "bar");

  // when provided index equal to or greater than length, return null
  t.equal(this.el.classList.item(2), null);

  t.done();
};

exports["[index] returns expected token"] = function (t) {
  this.el.className = "foo bar";
  t.equal(this.el.classList[0], "foo");
  t.equal(this.el.classList[1], "bar");

  // when provided index equal to or greater than length, return undefined
  t.equal(this.el.classList[2], undefined);

  t.done();
};

exports[".contains(token) returns whether token exists"] = function (t) {
  this.el.className = "foo bar";

  // token exists
  t.ok(this.el.classList.contains("foo"));
  t.ok(this.el.classList.contains("bar"));

  // token does not exist
  t.equals(this.el.classList.contains("baz"), false);

  t.done();
};

exports[".contains() throws if token empty"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.contains("");
  }

  // TODO: should be SyntaxError
  t.throws(block, DOMException);

  t.done();
};

exports[".contains() throws if token contains whitespace"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.contains(" ");
  }

  // TODO: should be InvalidCharacterError
  t.throws(block, DOMException);

  t.done();
};

exports[".add(tokens...) adds provided tokens"] = function (t) {
  // add zero tokens
  this.el.classList.add();
  t.equals(this.el.className, "");
  t.equals(this.el.classList.length, 0);

  // add one token
  this.el.classList.add("foo");
  t.equals(this.el.className, "foo");
  t.equals(this.el.classList[0], "foo");

  // add one token twice
  this.el.classList.add("foo", "foo");
  t.equals(this.el.className, "foo");
  t.equals(this.el.classList[0], "foo");

  // add two distinct tokens
  this.el.className = "";
  this.el.classList.add("foo", "bar");
  t.equals(this.el.className, "foo bar");
  t.equals(this.el.classList[0], "foo");
  t.equals(this.el.classList[1], "bar");

  t.done();
};

exports[".add() throws if a token is empty"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.add("foo", "");
  }

  // TODO: should be SyntaxError
  t.throws(block, DOMException);

  t.done();
};

exports[".add() throws if a token contains whitespace"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.add("  foo", "bar");
  }

  // TODO: should be InvalidCharacterError;
  t.throws(block, DOMException);

  t.done();
};

exports[".remove(tokens...) removes provided tokens"] = function (t) {
  // remove exactly all tokens
  this.el.className = "foo bar";
  this.el.classList.remove("bar", "foo");
  t.equals(this.el.className, "");
  t.equals(this.el.classList.length, 0);

  // remove more tokens than exist
  this.el.className = "foo bar";
  this.el.classList.remove("bar");
  t.equals(this.el.className, "foo");
  t.equals(this.el.classList[0], "foo");

  // remove some of the tokens
  this.el.className = "foo";
  this.el.classList.remove("foo", "bar");
  t.equals(this.el.className, "");
  t.equals(this.el.classList.length, 0);

  // remove one token twice
  this.el.className = "foo bar";
  this.el.classList.remove("bar", "bar");
  t.equals(this.el.className, "foo");
  t.equals(this.el.classList[0], "foo");

  // remove repeated token
  this.el.className = "foo foo";
  this.el.classList.remove("foo");
  t.equals(this.el.className, "");
  t.equals(this.el.classList.length, 0);

  t.done();
};

exports[".remove() throws if a token is empty"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.remove("foo", "");
  }

  // TODO: should be SyntaxError
  t.throws(block, DOMException);

  t.done();
};

exports[".remove() throws if a token contains whitespace"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.remove("  foo", "bar");
  }

  // TODO: should be InvalidCharacterError;
  t.throws(block, DOMException);

  t.done();
};

exports[".toggle(token) toggles specified token"] = function (t) {
  // toggle existing token
  this.el.className = "foo";
  this.el.classList.toggle("foo");
  t.equals(this.el.className, "");
  t.equals(this.el.classList.length, 0);

  // toggle token not present
  this.el.className = "";
  this.el.classList.toggle("foo");
  t.equals(this.el.className, "foo");
  t.equals(this.el.classList[0], "foo");

  t.done();
};

exports[".toggle(token, true) adds token"] = function (t) {
  // add token already present
  this.el.className = "foo";
  this.el.classList.toggle("foo", true);
  t.equals(this.el.className, "foo");
  t.equals(this.el.classList[0], "foo");

  // add token not present
  this.el.className = "";
  this.el.classList.toggle("foo", true);
  t.equals(this.el.className, "foo");
  t.equals(this.el.classList[0], "foo");

  t.done();
};

exports[".toggle(token, false) removes token"] = function (t) {
  // remove existing token
  this.el.className = "foo";
  this.el.classList.toggle("foo", false);
  t.equals(this.el.className, "");
  t.equals(this.el.classList.length, 0);

  // remove a token that does not exist
  this.el.className = "";
  this.el.classList.toggle("foo", false);
  t.equals(this.el.className, "");
  t.equals(this.el.classList.length, 0);

  t.done();
};

exports[".toggle(token) returns whether token exists"] = function (t) {
  // token toggled off
  this.el.className = "foo";
  t.equals(this.el.classList.toggle("foo"), false);

  // token toggled on
  this.el.className = "";
  t.equals(this.el.classList.toggle("foo"), true);

  t.done();
};

exports[".toggle() throws if a token is empty"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.toggle("");
  }

  // TODO: should be SyntaxError
  t.throws(block, DOMException);

  t.done();
};

exports[".toggle() throws if a token contains whitespace"] = function (t) {
  var el = this.el;
  function block() {
    el.classList.toggle("  foo");
  }

  // TODO: should be InvalidCharacterError;
  t.throws(block, DOMException);

  t.done();
};

exports["accessing classList should remove duplicates"] = function (t) {
  this.el.className = "a a";
  this.el.classList;// jshint ignore:line

  t.equal(this.el.className, "a a");
  t.equal(this.el.classList.toString(), "a");

  t.done();
};

exports[".toString() should return empty string when empty"] = function (t) {
  t.equal(this.el.classList.toString(), "");

  t.done();
};

exports["classList should return same object"] = function (t) {
  var classList = this.el.classList;
  t.equal(classList, this.el.classList);

  this.el.className = "foo foo";
  t.equal(classList, this.el.classList);

  t.done();
};
