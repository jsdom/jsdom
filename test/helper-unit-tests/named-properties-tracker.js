"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const NamedPropertiesTracker = require("../../lib/jsdom/named-properties-tracker.js");

function joinIterator(values) {
  let joinedValue = "";
  for (const val of values().keys()) {
    joinedValue += (joinedValue ? "," : "") + val;
  }
  return joinedValue;
}

describe("Helpers: named-properties-tracker", () => {
  specify("get() should return the tracker previously created by create()", () => {
    const obj = {};

    assert.ok(NamedPropertiesTracker.get(obj) === null);
    const tracker = NamedPropertiesTracker.create(obj, obj, () => {
      // doesn't matter this test
    });
    assert.ok(NamedPropertiesTracker.get(obj) === tracker);
  });

  specify("track() and untrack() should do nothing for empty names", () => {
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

  specify("should define a getter which calls the resolver each time", () => {
    let state = "bar";
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, (object, name, values) => {
      assert.ok(object === obj);
      assert.strictEqual(typeof values, "function");
      assert.ok(values() instanceof Set);
      return "hello " + name + " " + state + " " + joinIterator(values);
    });

    tracker.track("foo", 123);
    assert.strictEqual(obj.foo, "hello foo bar 123");
    state = "baz";
    assert.strictEqual(obj.foo, "hello foo baz 123");
    tracker.track("foo", "bla");
    assert.strictEqual(obj.foo, "hello foo baz 123,bla");
    tracker.track("foo", 456);
    assert.strictEqual(obj.foo, "hello foo baz 123,bla,456");
  });

  specify("the resolver should receive a `values` argument that is 'live'", () => {
    const obj = {};
    let liveValues;
    const tracker = NamedPropertiesTracker.create(obj, obj, (object, name, values) => {
      liveValues = values;
      return "foo";
    });

    tracker.track("foo", 123);
    assert.strictEqual(obj.foo, "foo"); // `liveValues` is now set
    assert.strictEqual(joinIterator(liveValues), "123");
    tracker.track("foo", "bar");
    assert.strictEqual(joinIterator(liveValues), "123,bar");

    tracker.untrack("foo", 123);
    tracker.untrack("foo", "bar");
    // the map entry is now removed, however liveValues should still be live
    assert.strictEqual(liveValues().size, 0);
    tracker.track("foo", "baz");
    assert.strictEqual(joinIterator(liveValues), "baz");
  });

  specify("named properties should be enumerable", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    let found = false;
    for (const key in obj) {
      if (key === "foo") {
        found = true;
      }
    }
    assert.ok(found);
  });

  specify("named properties should be configurable", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    tracker.track("dog", 456);

    Object.defineProperty(obj, "foo", {
      value: "baz"
    });

    delete obj.dog;

    assert.strictEqual(obj.foo, "baz");
    assert.ok(!("dog" in obj));
  });

  specify("named properties should be settable", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    obj.foo = 10;

    assert.strictEqual(obj.foo, 10);
  });

  specify("a named property should not override an existing property", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    obj.foo = 10;
    tracker.track("foo", 123);
    assert.strictEqual(obj.foo, 10);

    tracker.untrack("foo", 123);
    assert.strictEqual(obj.foo, 10);
  });

  specify("a named property should not override an existing property, even if undefined", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    obj.foo = undefined;
    tracker.track("foo", 123);
    assert.strictEqual(obj.foo, undefined);
    assert.ok("foo" in obj);
    assert.strictEqual(obj.foo, undefined);

    tracker.untrack("foo", 123);
    assert.ok("foo" in obj);
    assert.strictEqual(obj.foo, undefined);
  });

  specify("a named property should not override properties from the prototype", () => {
    function Abc() {
      // dummy constructor
    }
    Abc.prototype.foo = 12345;
    const obj = new Abc();
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");

    tracker.track("foo", 123);
    assert.strictEqual(obj.foo, 12345);

    tracker.untrack("foo", 123);
    assert.strictEqual(obj.foo, 12345);
  });

  specify("a named property should not override Object properties", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bar");
    const props = ["__proto__", "toString", "constructor", "hasOwnProperty", "isPrototypeOf"];

    for (const prop of props) {
      const value = obj[prop];
      tracker.track(prop, 123);
      assert.strictEqual(obj[prop], value, prop + " should not have been overridden");
    }
  });

  specify("a named property that has been untracked should not be 'in' the object", () => {
    const obj = {};
    const tracker = NamedPropertiesTracker.create(obj, obj, () => "bla");

    tracker.track("foo", 123);
    tracker.untrack("foo", 123);
    assert.ok(!("foo" in obj), "descriptor should have been removed");
  });
});
