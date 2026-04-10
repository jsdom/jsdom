"use strict";

const { LRUCache } = require("lru-cache");

const DEFAULT_MAX_SIZE = 2048;

function createCache(max = DEFAULT_MAX_SIZE) {
  return new LRUCache({ max });
}

exports.createCache = createCache;
