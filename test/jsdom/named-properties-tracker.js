"use strict";
const NamedPropertiesTracker = require("../../lib/jsdom/named-properties-tracker");

function joinIterator(values) {
  let joinedValue = "";
  for (const val of values().keys()) {
    joinedValue += (joinedValue ? "," : "") + val;
  }
  return joinedValue;
}

exports["get() should return the tracker previously created by create()"] = function (t) {
  const obj = {};

  t.ok(NamedPropertiesTracker.get(obj) === null);
  const tracker = NamedPropertiesTracker.create(obj, function () {});
  t.ok(NamedPropertiesTracker.get(obj) === tracker);
  t.done();
};

exports["track() and untrack() should do nothing for empty names"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () {});

  tracker.track(undefined, "foo");
  tracker.track(null, "foo");
  tracker.track("", "foo");
  tracker.untrack(undefined, "foo");
  tracker.untrack(null, "foo");
  tracker.untrack("", "foo");
  t.done();
};

exports["should define a getter which calls the resolver each time"] = function (t) {
  let state = "bar";
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function (object, name, values) {
    t.ok(object === obj);
    t.strictEqual(typeof values, "function");
    t.ok(values() instanceof Set);
    return "hello " + name + " " + state + " " + joinIterator(values);
  });

  tracker.track("foo", 123);
  t.strictEqual(obj.foo, "hello foo bar 123");
  state = "baz";
  t.strictEqual(obj.foo, "hello foo baz 123");
  tracker.track("foo", "bla");
  t.strictEqual(obj.foo, "hello foo baz 123,bla");
  tracker.track("foo", 456);
  t.strictEqual(obj.foo, "hello foo baz 123,bla,456");
  t.done();
};

exports["the resolver should receive a `values` argument that is 'live'"] = function (t) {
  const obj = {};
  let liveValues;
  const tracker = NamedPropertiesTracker.create(obj, function (object, name, values) {
    liveValues = values;
    return "foo";
  });

  tracker.track("foo", 123);
  t.strictEqual(obj.foo, "foo"); // `liveValues` is now set
  t.strictEqual(joinIterator(liveValues), "123");
  tracker.track("foo", "bar");
  t.strictEqual(joinIterator(liveValues), "123,bar");

  tracker.untrack("foo", 123);
  tracker.untrack("foo", "bar");
  // the map entry is now removed, however liveValues should still be live
  t.strictEqual(liveValues().size, 0);
  tracker.track("foo", "baz");
  t.strictEqual(joinIterator(liveValues), "baz");

  t.done();
};

exports["named properties should be enumerable"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  tracker.track("foo", 123);
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

  tracker.track("foo", 123);
  tracker.track("dog", 456);

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

  tracker.track("foo", 123);
  obj.foo = 10;

  t.strictEqual(obj.foo, 10);
  t.done();
};

exports["a named property should not override an existing property"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  obj.foo = 10;
  tracker.track("foo", 123);
  t.strictEqual(obj.foo, 10);

  tracker.untrack("foo", 123);
  t.strictEqual(obj.foo, 10);

  t.done();
};

exports["a named property should not override an existing property, even if undefined"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  obj.foo = undefined;
  tracker.track("foo", 123);
  t.strictEqual(obj.foo, undefined);
  t.ok("foo" in obj);
  t.strictEqual(obj.foo, undefined);

  tracker.untrack("foo", 123);
  t.ok("foo" in obj);
  t.strictEqual(obj.foo, undefined);

  t.done();
};

exports["a named property should not override properties from the prototype"] = function (t) {
  function Abc() {}
  Abc.prototype.foo = 12345;
  const obj = new Abc();
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });

  tracker.track("foo", 123);
  t.strictEqual(obj.foo, 12345);

  tracker.untrack("foo", 123);
  t.strictEqual(obj.foo, 12345);

  t.done();
};

exports["a named property should not override Object properties"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bar"; });
  const props = ["__proto__", "toString", "constructor", "hasOwnProperty", "isPrototypeOf"];

  props.forEach(function (prop) {
    const value = obj[prop];
    tracker.track(prop, 123);
    t.strictEqual(obj[prop], value, prop + " should not have been overridden");
  });

  t.done();
};

exports["a named property that has been untracked should not be 'in' the object"] = function (t) {
  const obj = {};
  const tracker = NamedPropertiesTracker.create(obj, function () { return "bla"; });

  tracker.track("foo", 123);
  tracker.untrack("foo", 123);
  t.ok(!("foo" in obj), "descriptor should have been removed");

  t.done();
};
