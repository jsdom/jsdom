"use strict";
const utils = require("../../lib/jsdom/utils");

exports["defineSetter defines a setter"] = t => {
  const o = {};
  let called = false;
  const expected = "bar";
  let actual;

  utils.defineSetter(o, "foo", val => {
    called = true;
    actual = val;
  });

  o.foo = expected;
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};

exports["defineSetter replaces existing setters"] = t => {
  const o = {};
  let originalCalled = false;
  let newCalled = false;

  utils.defineSetter(o, "foo", () => originalCalled = true);
  utils.defineSetter(o, "foo", () => newCalled = true);

  o.foo = true;
  t.equal(originalCalled, false);
  t.equal(newCalled, true);

  t.done();
};

exports["defineSetter does not remove existing getters"] = t => {
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
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};

exports["defineGetter defines a getter"] = t => {
  const o = {};
  let called = false;
  const expected = "bar";
  let actual;

  utils.defineGetter(o, "foo", () => {
    called = true;
    return expected;
  });

  actual = o.foo;
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};

exports["defineGetter replaces existing getters"] = t => {
  const o = {};
  let originalCalled = false;
  let newCalled = false;

  utils.defineGetter(o, "foo", () => originalCalled = true);
  utils.defineGetter(o, "foo", () => newCalled = true);

  /* eslint-disable no-unused-expressions */
  o.foo;
  /* eslint-enable no-unused-expressions */

  t.equal(originalCalled, false);
  t.equal(newCalled, true);

  t.done();
};

exports["defineGetter does not remove existing setters"] = t => {
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
  t.equal(called, true);
  t.equal(actual, expected);

  t.done();
};

exports["createFrom returns an object with the given [[Prototype]]"] = t => {
  const proto = {};

  const o = utils.createFrom(proto);
  t.strictEqual(Object.getPrototypeOf(o), proto);

  t.done();
};


exports["createFrom returns an object extended with the given properties"] = t => {
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
    t.deepEqual(Object.getOwnPropertyDescriptor(o, name),
      Object.getOwnPropertyDescriptor(properties, name),
      name + " descriptors should be deeply equal"
    );
  }

  t.done();
};

exports["inheritFrom sets Subclass.prototype to an object w/ [[Prototype]] Superclass.prototype"] = t => {
  function Subclass() {}
  function Superclass() {}

  utils.inheritFrom(Superclass, Subclass);

  t.strictEqual(Object.getPrototypeOf(Subclass.prototype),
    Superclass.prototype);

  t.done();
};

exports["inheritFrom sets Subclass.prototype.constructor to Subclass"] = t => {
  function Subclass() {}
  function Superclass() {}

  utils.inheritFrom(Superclass, Subclass);

  t.strictEqual(Subclass.prototype.constructor, Subclass);

  t.done();
};

exports["inheritFrom extends Subclass.prototype with the given properties"] = t => {
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
    t.deepEqual(
      Object.getOwnPropertyDescriptor(Subclass.prototype, name),
      Object.getOwnPropertyDescriptor(properties, name),
      name + " descriptors should be deeply equal"
    );
  }

  t.done();
};

exports["isValidTargetOrigin properly validates target origin"] = t => {
  t.strictEqual(utils.isValidTargetOrigin("*"), true);
  t.strictEqual(utils.isValidTargetOrigin("/"), true);
  t.strictEqual(utils.isValidTargetOrigin("https://www.google.com/"), true);
  t.strictEqual(utils.isValidTargetOrigin("https://www.google.com"), true);
  t.strictEqual(utils.isValidTargetOrigin("http://www.google.com/"), true);
  t.strictEqual(utils.isValidTargetOrigin("http://www.google.com"), true);

  t.strictEqual(utils.isValidTargetOrigin("www.google.com/"), false);
  t.strictEqual(utils.isValidTargetOrigin("www.google.com"), false);
  t.strictEqual(utils.isValidTargetOrigin("google.com"), false);
  t.strictEqual(utils.isValidTargetOrigin("google"), false);
  t.strictEqual(utils.isValidTargetOrigin("?"), false);

  t.done();
};
