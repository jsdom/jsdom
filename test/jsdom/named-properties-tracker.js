"use strict";
const NamedPropertiesTracker = require("../../lib/jsdom/named-properties-tracker");

exports["get() should return the tracker previously created by create()"] = function (t) {
  const obj = {};

  t.ok(NamedPropertiesTracker.get(obj) === null);
  const tracker = NamedPropertiesTracker.create(obj, function () {});
  t.ok(NamedPropertiesTracker.get(obj) === tracker);
  t.done();
};

exports["track() and maybeUntrack() should do nothing for empty names"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () {});

  tracker.track(undefined);
  tracker.track(null);
  tracker.track("");
  tracker.maybeUntrack(undefined);
  tracker.maybeUntrack(null);
  tracker.maybeUntrack("");
  t.done();
};

exports["should define a getter which calls the resolver each time"] = function (t) {
  let state = "bar";
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function (object, name) {
    t.ok(object === obj);
    return "hello " + name + " " + state;
  });

  tracker.track("foo");
  t.strictEqual(obj.foo, "hello foo bar");
  state = "baz";
  t.strictEqual(obj.foo, "hello foo baz");

  t.done();
};

exports["named properties should be enumerable"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  tracker.track("foo");
  let found = false;
  for (let key in obj) {
    if (key === "foo") {
      found = true;
    }
  }
  t.ok(found);

  t.done();
};

exports["named properties should be configurable"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  tracker.track("foo");
  tracker.track("dog");

  Object.defineProperty(obj, "foo", {
    value: "baz"
  });

  delete obj.dog;

  t.strictEqual(obj.foo, "baz");
  t.ok(!("dog" in obj));
  t.done();
};

exports["named properties should be settable"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  tracker.track("foo");
  obj.foo = 10;

  t.strictEqual(obj.foo, 10);
  t.done();
};

exports["a named property should not override an existing property"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  obj.foo = 10;
  tracker.track("foo");
  t.strictEqual(obj.foo, 10);

  tracker.maybeUntrack("foo");
  t.strictEqual(obj.foo, 10);

  t.done();
};


exports["a named property should not override an existing property, even if undefined"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  obj.foo = undefined;
  tracker.track("foo");
  t.strictEqual(obj.foo, undefined);
  t.ok("foo" in obj);
  t.strictEqual(obj.foo, undefined);

  tracker.maybeUntrack("foo");
  t.ok("foo" in obj);
  t.strictEqual(obj.foo, undefined);

  t.done();
};

exports["a named property should not override properties from the prototype"] = function (t) {
  function Abc() {}
  Abc.prototype.foo = 12345;
  const obj = new Abc();
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  tracker.track("foo");
  t.strictEqual(obj.foo, 12345);

  tracker.maybeUntrack("foo");
  t.strictEqual(obj.foo, 12345);

  t.done();
};

exports["a named property should not override Object properties"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });
  const props = ["__proto__", "toString", "constructor", "hasOwnProperty", "isPrototypeOf"];

  props.forEach(function (prop) {
    const value = obj[prop];
    tracker.track(prop);
    t.strictEqual(obj[prop], value, prop + " should not have been overridden");
  });

  t.done();
};

exports["a named property without any result should not be 'in' the object"] = function (t) {
  let state = "bar";
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return state; });

  tracker.track("foo");
  tracker.maybeUntrack("foo");
  t.strictEqual(obj.foo, "bar");

  state = null;
  tracker.maybeUntrack("foo");
  t.strictEqual(obj.foo, null, "descriptor should not be removed if null is returned");

  state = undefined;
  tracker.maybeUntrack("foo");
  t.ok(!("foo" in obj), "descriptor should have been removed");

  t.done();
};
