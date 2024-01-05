"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const NamedPropertiesTracker = require("../../lib/jsdom/named-properties-tracker.js");

function joinIterator(values) {
  let joinedValue = "";
  for (const val of values().keys()) {
    joinedValue += (joinedValue ? "," : "") + val;
  }
  return joinedValue;
}

describe("Helpers: named-properties-tracker", () => {
  test("get() should return the tracker previously created by create()", () => {
    const obj = {};

    assert.equal(NamedPropertiesTracker.get(obj), null);
    const tracker = NamedPropertiesTracker.create(obj, obj, () => {
      // doesn't matter this test
    });
    assert.equal(NamedPropertiesTracker.get(obj), tracker);
  });

  test("track() and untrack() should do nothing for empty names", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => {
      // doesn't matter for this test
    });

    tracker.track(undefined, "foo");
    tracker.track(null, "foo");
    tracker.track("", "foo");
    tracker.untrack(undefined, "foo");
    tracker.untrack(null, "foo");
    tracker.untrack("", "foo");
  });

  test("should define a getter which calls the resolver each time", () => {
    let state = "bar";
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, (object, name, values) => {
      assert.equal(object, obj);
      assert.equal(typeof values, "function");
      assert(values() instanceof Set);
      return "hello " + name + " " + state + " " + joinIterator(values);
    });

    tracker.track("foo", 123);
    assert.equal(obj.foo, "hello foo bar 123");
    state = "baz";
    assert.equal(obj.foo, "hello foo baz 123");
    tracker.track("foo", "bla");
    assert.equal(obj.foo, "hello foo baz 123,bla");
    tracker.track("foo", 456);
    assert.equal(obj.foo, "hello foo baz 123,bla,456");
  });

  test("the resolver should receive a `values` argument that is 'live'", () => {
    const obj = {};
    let liveValues;
    const tracker = NamedPropertiesTracker.create(obj, obj, (object, name, values) => {
      liveValues = values;
      return "foo";
    });

    tracker.track("foo", 123);
    assert.equal(obj.foo, "foo"); // `liveValues` is now set
    assert.equal(joinIterator(liveValues), "123");
    tracker.track("foo", "bar");
    assert.equal(joinIterator(liveValues), "123,bar");

    tracker.untrack("foo", 123);
    tracker.untrack("foo", "bar");
    // the map entry is now removed, however liveValues should still be live
    assert.equal(liveValues().size, 0);
    tracker.track("foo", "baz");
    assert.equal(joinIterator(liveValues), "baz");
  });

  test("named properties should be enumerable", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    let found = false;
    for (const key in obj) {
      if (key === "foo") {
        found = true;
      }
    }
    assert(found);
  });

  test("named properties should be configurable", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    tracker.track("dog", 456);

    Object.defineProperty(obj, "foo", {
      value: "baz"
    });

    delete obj.dog;

    assert.equal(obj.foo, "baz");
    assert(!("dog" in obj));
  });

  test("named properties should be settable", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    obj.foo = 10;

    assert.equal(obj.foo, 10);
  });

  test("a named property should not override an existing property", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    obj.foo = 10;
    tracker.track("foo", 123);
    assert.equal(obj.foo, 10);

    tracker.untrack("foo", 123);
    assert.equal(obj.foo, 10);
  });

  test("a named property should not override an existing property, even if undefined", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    obj.foo = undefined;
    tracker.track("foo", 123);
    assert.equal(obj.foo, undefined);
    assert("foo" in obj);
    assert.equal(obj.foo, undefined);

    tracker.untrack("foo", 123);
    assert("foo" in obj);
    assert.equal(obj.foo, undefined);
  });

  test("a named property should not override properties from the prototype", () => {
    function Abc() {
      // dummy constructor
    }
    Abc.prototype.foo = 12345;
    const obj = new Abc();
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    assert.equal(obj.foo, 12345);

    tracker.untrack("foo", 123);
    assert.equal(obj.foo, 12345);
  });

  test("a named property should not override Object properties", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");
    const props = ["__proto__", "toString", "constructor", "hasOwnProperty", "isPrototypeOf"];

    for (const prop of props) {
      const value = obj[prop];
      tracker.track(prop, 123);
      assert.equal(obj[prop], value, prop + " should not have been overridden");
    }
  });

  test("a named property that has been untracked should not be 'in' the object", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bla");

    tracker.track("foo", 123);
    tracker.untrack("foo", 123);
    assert(!("foo" in obj), "descriptor should have been removed");
  });
});
