"use strict";
const { randomUUID } = require("node:crypto");
const { parseURL, serializeURL } = require("whatwg-url");
const WeakValueMap = require("../helpers/weak-value-map");

// One store is shared by jsdom windows. Each creating document keeps its entries alive; the weak index lets an
// abandoned JSDOM and its blobs be collected without requiring an explicit window.close().
const store = new WeakValueMap();
const environmentEntries = new WeakMap();

// https://w3c.github.io/FileAPI/#add-an-entry
exports.addEntry = (object, environment) => {
  const url = `blob:${environment._origin}/${randomUUID()}`;
  const entry = { object, environment };
  let entries = environmentEntries.get(environment);
  if (entries === undefined) {
    entries = new Map();
    environmentEntries.set(environment, entries);
  }
  entries.set(url, entry);
  store.set(url, entry);
  return url;
};

// https://w3c.github.io/FileAPI/#blob-url-resolve
exports.resolveEntry = url => store.get(serializeURL(url, true)) ?? null;

// https://w3c.github.io/FileAPI/#check-for-same-partition-blob-url-usage
// https://storage.spec.whatwg.org/#obtain-a-storage-key-for-non-storage-purposes
// Storage keys currently consist of an origin. Compare opaque origin identities, not their "null" serialization.
exports.samePartition = (entry, environment) => {
  return environment !== null && entry.environment._originIdentity === environment._originIdentity;
};

// https://w3c.github.io/FileAPI/#dfn-revokeObjectURL
exports.revokeEntry = (url, environment) => {
  const record = parseURL(url);
  if (record === null || record.scheme !== "blob") {
    return;
  }
  const entry = exports.resolveEntry(record);
  if (entry === null || !exports.samePartition(entry, environment)) {
    return;
  }

  // Resolution ignores fragments, but removal uses the complete serialized URL.
  const serialized = serializeURL(record);
  store.delete(serialized);
  environmentEntries.get(entry.environment).delete(serialized);
};

// https://w3c.github.io/FileAPI/#lifeTime
exports.cleanUpDocument = environment => {
  const entries = environmentEntries.get(environment);
  if (entries !== undefined) {
    for (const url of entries.keys()) {
      store.delete(url);
    }
    entries.clear();
  }
};
