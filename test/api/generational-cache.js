"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { GenerationalCache } = require("../../lib/jsdom/living/css/helpers/generational-cache");

describe("GenerationalCache", () => {
  it("should initialize with 4 for the max cache size.", () => {
    const cache = new GenerationalCache();
    assert.strictEqual(cache.max, 4, "max cache size");
  });

  it("should initialize with 4 for the max cache size", () => {
    const cache = new GenerationalCache(2);
    assert.strictEqual(cache.max, 4, "max cache size");
  });

  it("should initialize with correct max cache size", () => {
    const cache = new GenerationalCache(5);
    assert.strictEqual(cache.max, 5, "max cache size");
  });

  it("should set max cache size and clear cache", () => {
    const cache = new GenerationalCache(2);
    cache.set("foo", "bar");
    assert.strictEqual(cache.size, 1, "cache is added");
    cache.max = 5;
    assert.strictEqual(cache.max, 5, "max cache size");
    assert.strictEqual(cache.size, 0, "cache is cleared");
  });

  it("should set max cache size and clear cache", () => {
    const cache = new GenerationalCache(5);
    cache.set("foo", "bar");
    assert.strictEqual(cache.size, 1, "cache is added");
    cache.max = 2;
    assert.strictEqual(cache.max, 4, "max cache size");
    assert.strictEqual(cache.size, 0, "cache is cleared");
  });

  it("should be within max cache size", () => {
    const cache = new GenerationalCache(9);
    const boundary = Math.ceil(cache.max / 2);
    const sizes = [];
    for (let i = 1; i < 20; i++) {
      cache.set(`key${i}`, i);
      sizes.push(cache.size);
      if (i < cache.max) {
        assert.strictEqual(cache.size, i, `${i}`);
      } else {
        assert.strictEqual(cache.size, (i % boundary) + boundary, `${i}`);
      }
    }
    assert.deepEqual(
      sizes,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 5, 6, 7, 8, 9, 5, 6, 7, 8, 9],
      "The size is limited to a maximum of 9"
    );
  });

  it("should set and get values", () => {
    const cache = new GenerationalCache(10);
    cache.set("key1", "value1");
    cache.set("key2", { foo: "bar" });

    assert.strictEqual(
      cache.get("key1"),
      "value1",
      "gets primitive value"
    );
    assert.deepEqual(
      cache.get("key2"),
      { foo: "bar" },
      "gets object value"
    );
    assert.strictEqual(
      cache.get("unknown"),
      undefined,
      "returns undefined for missing keys"
    );
  });

  it("should check existence with has()", () => {
    const cache = new GenerationalCache(10);
    cache.set("key1", "value1");

    assert.strictEqual(cache.has("key1"), true, "have key1");
    assert.strictEqual(cache.has("key2"), false, "not have key2");
  });

  it("should delete values", () => {
    const cache = new GenerationalCache(10);
    cache.set("key1", "value1");
    cache.delete("key1");

    assert.strictEqual(cache.has("key1"), false, "key1 is deleted");
    assert.strictEqual(
      cache.get("key1"),
      undefined,
      "return undefined for deleted key"
    );
  });

  it("should clear all values", () => {
    const cache = new GenerationalCache(10);
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.clear();

    assert.strictEqual(cache.has("key1"), false, "key1 is cleared");
    assert.strictEqual(cache.has("key2"), false, "key2 is cleared");
  });

  it("should shift generations and evict old items", () => {
    const cache = new GenerationalCache(4);
    cache.set("k1", "v1");
    cache.set("k2", "v2");
    assert.strictEqual(
      cache.has("k1"),
      true,
      "k1 exists in old generation"
    );
    assert.strictEqual(
      cache.has("k2"),
      true,
      "k2 exists in old generation"
    );

    cache.set("k3", "v3");
    cache.set("k4", "v4");
    assert.strictEqual(cache.has("k1"), false, "k1 is evicted");
    assert.strictEqual(cache.has("k2"), false, "k2 is evicted");
    assert.strictEqual(
      cache.has("k3"),
      true,
      "k3 survives in old generation"
    );
    assert.strictEqual(
      cache.has("k4"),
      true,
      "k4 survives in old generation"
    );
  });

  it("should promote accessed old items to current generation", () => {
    const cache = new GenerationalCache(4);
    cache.set("k1", "v1");
    cache.set("k2", "v2");
    const val = cache.get("k1");
    assert.strictEqual(val, "v1", "get promoted value");
    cache.set("k3", "v3");
    assert.strictEqual(
      cache.has("k1"),
      true,
      "k1 survives because it was promoted"
    );
    assert.strictEqual(cache.has("k2"), false, "k2 is evicted");
    assert.strictEqual(
      cache.has("k3"),
      true,
      "k3 survives in old generation"
    );
  });
});
