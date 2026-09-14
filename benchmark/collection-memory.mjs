import assert from "node:assert/strict";
import console from "node:console";
import jsdom from "../lib/api.js";
import { parseArgs } from "node:util";
import process from "node:process";
import { setImmediate } from "node:timers/promises";

const { values } = parseArgs({
  options: {
    "size": { type: "string", default: "500" },
    "collections": { type: "string", default: "100" },
    "names": { type: "string", default: "distinct" },
    "prime-name-keys": { type: "boolean", default: false }
  }
});
const size = Number(values.size);
const collectionCount = Number(values.collections);
assert(Number.isSafeInteger(size) && size > 0);
assert(Number.isSafeInteger(collectionCount) && collectionCount > 0);
assert(["none", "distinct", "duplicate"].includes(values.names));
assert.equal(typeof globalThis.gc, "function", "Run using npm run benchmark:collection-memory");

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = window;
const collections = [];
for (let j = 0; j < collectionCount; ++j) {
  const parent = document.createElement("div");
  for (let i = 0; i < size; ++i) {
    const child = parent.appendChild(document.createElement("div"));
    if (values.names !== "none") {
      const suffix = values.names === "distinct" ? i : "shared";
      child.id = `id-${j}-${suffix}`;
      child.setAttribute("name", `name-${j}-${suffix}`);
    }
  }
  // Materialize each backing list without reading a string property on the collection proxy.
  collections.push(parent.children);
}

function primeNameKeys() {
  const keys = new Set();
  for (const collection of collections) {
    // Indexed access avoids constructing the collection's named cache.
    for (let element = collection[0]; element !== null; element = element.nextElementSibling) {
      for (const attribute of ["id", "name"]) {
        const value = element.getAttribute(attribute);
        if (value !== null) {
          keys.add(value);
        }
      }
    }
  }
}

if (values["prime-name-keys"]) {
  // Release the temporary `Set` before either retained-heap measurement.
  primeNameKeys();
}

async function retainedHeap() {
  // Allow pending document lifecycle work to finish and collect allocation garbage.
  for (let i = 0; i < 3; ++i) {
    await setImmediate();
    globalThis.gc();
  }
  return process.memoryUsage().heapUsed;
}

const beforeBytes = await retainedHeap();
for (const collection of collections) {
  assert.equal(collection.length, size);
}
const afterBytes = await retainedHeap();
// Keep the collections and their elements reachable through both measurements.
for (const collection of collections) {
  assert.equal(collection.length, size);
}
console.log(JSON.stringify({
  node: process.version,
  size,
  collections: collectionCount,
  names: values.names,
  primeNameKeys: values["prime-name-keys"],
  beforeBytes,
  afterBytes,
  retainedBytes: afterBytes - beforeBytes,
  bytesPerCollection: (afterBytes - beforeBytes) / collectionCount
}));
window.close();
