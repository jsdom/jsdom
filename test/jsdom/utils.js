"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const utils = require("../../lib/jsdom/utils");

describe("jsdom/utils", () => {
  specify("defineSetter defines a setter", () => {
    const o = {};
    let called = false;
    const expected = "bar";
    let actual;

    utils.defineSetter(o, "foo", val => {
      called = true;
      actual = val;
    });

    o.foo = expected;
    assert.equal(called, true);
    assert.equal(actual, expected);
  });

  specify("defineSetter replaces existing setters", () => {
    const o = {};
    let originalCalled = false;
    let newCalled = false;

    utils.defineSetter(o, "foo", () => originalCalled = true);
    utils.defineSetter(o, "foo", () => newCalled = true);

    o.foo = true;
    assert.equal(originalCalled, false);
    assert.equal(newCalled, true);
  });

  specify("defineSetter does not remove existing getters", () => {
    const o = {};
    let called = false;
    const expected = "bar";
    let actual;

    utils.defineGetter(o, "foo", () => {
      called = true;
      return expected;
    });

    utils.defineSetter(o, "foo", () => { });

    actual = o.foo;
    assert.equal(called, true);
    assert.equal(actual, expected);
  });

  specify("defineGetter defines a getter", () => {
    const o = {};
    let called = false;
    const expected = "bar";
    let actual;

    utils.defineGetter(o, "foo", () => {
      called = true;
      return expected;
    });

    actual = o.foo;
    assert.equal(called, true);
    assert.equal(actual, expected);
  });

  specify("defineGetter replaces existing getters", () => {
    const o = {};
    let originalCalled = false;
    let newCalled = false;

    utils.defineGetter(o, "foo", () => originalCalled = true);
    utils.defineGetter(o, "foo", () => newCalled = true);

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

    utils.defineSetter(o, "foo", val => {
      called = true;
      actual = val;
    });

    utils.defineGetter(o, "foo", () => { });

    o.foo = expected;
    assert.equal(called, true);
    assert.equal(actual, expected);
  });

  specify("createFrom returns an object with the given [[Prototype]]", () => {
    const proto = {};

    const o = utils.createFrom(proto);
    assert.strictEqual(Object.getPrototypeOf(o), proto);
  });

  specify("createFrom returns an object extended with the given properties", () => {
    const properties = {
      get accessor() {},
      set accessor(value) {},
      foo: "bar"
    };

    Object.defineProperties(properties, {
      frozen: {
        value: "brrr",
        configurable: false,
        writable: false
      },
      hidden: {
        value: "shhh",
        enumerable: false
      }
    });

    const o = utils.createFrom({}, properties);

    for (const name of Object.getOwnPropertyNames(o)) {
      assert.deepEqual(Object.getOwnPropertyDescriptor(o, name),
        Object.getOwnPropertyDescriptor(properties, name),
        name + " descriptors should be deeply equal"
      );
    }
  });

  specify("inheritFrom sets Subclass.prototype to an object w/ [[Prototype]] Superclass.prototype", () => {
    function Subclass() {}
    function Superclass() {}

    utils.inheritFrom(Superclass, Subclass);

    assert.strictEqual(Object.getPrototypeOf(Subclass.prototype),
      Superclass.prototype);
  });

  specify("inheritFrom sets Subclass.prototype.constructor to Subclass", () => {
    function Subclass() {}
    function Superclass() {}

    utils.inheritFrom(Superclass, Subclass);

    assert.strictEqual(Subclass.prototype.constructor, Subclass);
  });

  specify("inheritFrom extends Subclass.prototype with the given properties", () => {
    function Subclass() {}
    function Superclass() {}
    const properties = {
      get accessor() {},
      set accessor(value) {},
      foo: "bar"
    };

    Object.defineProperties(properties, {
      frozen: {
        value: "brrr",
        configurable: false,
        writable: false
      },
      hidden: {
        value: "shhh",
        enumerable: false
      }
    });

    utils.inheritFrom(Superclass, Subclass, properties);

    for (const name of Object.getOwnPropertyNames(Subclass.prototype)) {
      assert.deepEqual(
        Object.getOwnPropertyDescriptor(Subclass.prototype, name),
        Object.getOwnPropertyDescriptor(properties, name),
        name + " descriptors should be deeply equal"
      );
    }
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
