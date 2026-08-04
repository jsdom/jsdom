"use strict";

const { LRUCache } = require("lru-cache");

// Above the median (594) in 2024, below the maximum (1500) recommended by Lighthouse
// https://www.corewebvitals.io/pagespeed/fix-avoid-excessive-dom-size-lighthouse
const MAX_CACHE_SIZE = 1000;

class SelectorCache {
  #entries = new LRUCache({ max: MAX_CACHE_SIZE });

  clear() {
    this.#entries.clear();
  }

  get(node, key) {
    return this.#entries.get(node)?.get(key);
  }

  has(node, key) {
    return this.#entries.get(node)?.has(key) ?? false;
  }

  set(node, key, result) {
    let cache = this.#entries.get(node);
    if (!cache) {
      cache = new Map([[key, result]]);
      this.#entries.set(node, cache);
    } else {
      cache.set(key, result);
    }
    return cache;
  }
}

module.exports = SelectorCache;
