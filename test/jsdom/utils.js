"use strict";

var utils = require("../../lib/jsdom/utils");

exports["defineSetter defines a setter"] = function (t) {
  var o = {};
  var called = false;
  var expected = 'bar';
  var actual;

  utils.defineSetter(o, 'foo', function (val) {
    called = true;
    actual = val;
  });

  o.foo = expected;
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};

exports["defineSetter replaces existing setters"] = function (t) {
  var o = {};
  var originalCalled = false;
  var newCalled = false;

  utils.defineSetter(o, 'foo', function (val) {
    originalCalled = true;
  });

  utils.defineSetter(o, 'foo', function (val) {
    newCalled = true;
  });

  o.foo = true;
  t.equal(originalCalled, false);
  t.equal(newCalled, true);

  t.done();
};

exports["defineSetter does not remove existing getters"] = function (t) {
  var o = {};
  var called = false;
  var expected = 'bar';
  var actual;

  utils.defineGetter(o, 'foo', function () {
    called = true;
    return expected;
  });

  utils.defineSetter(o, 'foo', function (val) { /* NOP */ });

  actual = o.foo;
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};

exports["defineGetter defines a getter"] = function (t) {
  var o = {};
  var called = false;
  var expected = 'bar';
  var actual;

  utils.defineGetter(o, 'foo', function () {
    called = true;
    return expected
  });

  actual = o.foo;
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};

exports["defineGetter replaces existing getters"] = function (t) {
  var o = {};
  var originalCalled = false;
  var newCalled = false;

  utils.defineGetter(o, 'foo', function (val) {
    originalCalled = true;
  });

  utils.defineGetter(o, 'foo', function (val) {
    newCalled = true;
  });

  var actual = o.foo;
  t.equal(originalCalled, false);
  t.equal(newCalled, true);

  t.done();
};

exports["defineGetter does not remove existing setters"] = function (t) {
  var o = {};
  var called = false;
  var expected = 'bar';
  var actual;

  utils.defineSetter(o, 'foo', function (val) {
    called = true;
    actual = val;
  });

  utils.defineGetter(o, 'foo', function () { /* NOP */ });

  o.foo = expected;
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};
