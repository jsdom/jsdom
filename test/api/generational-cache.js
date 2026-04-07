"use strict";

const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

describe("Generational Cache Rotation Logic", () => {
  const MAX_CACHE_SIZE = 2048;

  function createGenerationalCache() {
    let currentCache = new Map();
    let oldCache = new Map();

    function setCachedValue(key, value) {
      currentCache.set(key, value);
      if (currentCache.size >= MAX_CACHE_SIZE) {
        oldCache = currentCache;
        currentCache = new Map();
      }
    }

    function getCachedValue(key) {
      let value = currentCache.get(key);
      if (value !== undefined) {
        return value;
      }

      value = oldCache.get(key);
      if (value !== undefined) {
        setCachedValue(key, value);
        return value;
      }
      return undefined;
    }

    return {
      setCachedValue,
      getCachedValue,
      getTotalSize: () => currentCache.size + oldCache.size
    };
  }

  it("should strictly bound the total size to at most MAX_CACHE_SIZE + 1 ", () => {
    const cache = createGenerationalCache();

    for (let i = 1; i <= MAX_CACHE_SIZE; i++) {
      cache.setCachedValue(`key_${i}`, `val_${i}`);
    }

    let maxObservedSize = 0;

    for (let loop = 0; loop < 100; loop++) {
      for (let i = 1; i <= MAX_CACHE_SIZE; i++) {
        cache.getCachedValue(`key_${i}`);
      }
      cache.setCachedValue(`new_key_${loop}`, `new_val`);

      const totalSize = cache.getTotalSize();
      if (totalSize > maxObservedSize) {
        maxObservedSize = totalSize;
      }
    }

    assert.ok(
      maxObservedSize <= MAX_CACHE_SIZE * 2,
      `Cache size is within maximum allowed size. Max size was ${maxObservedSize}.`
    );
    assert.equal(
      maxObservedSize,
      MAX_CACHE_SIZE + 1,
      "Strict bounds check passes."
    );
  });
});
