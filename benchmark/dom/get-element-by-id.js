"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  // Lookup by unique ID in a moderately-sized document.
  // Best case for the cache: only one element with this ID, so get() returns the cached element directly.
  {
    const ELEMENTS = 1000;
    const { document } = (new JSDOM()).window;
    for (let i = 0; i < ELEMENTS; i++) {
      const el = document.createElement("div");
      el.id = `el-${i}`;
      document.body.appendChild(el);
    }

    bench.add(`getElementById: unique ID among ${ELEMENTS}`, () => {
      document.getElementById("el-500");
    });
  }

  // Lookup when multiple elements share the same ID.
  // Forces a tree-order walk each time, since the cache can't pin a single element.
  {
    const DUPLICATES = 10;
    const ELEMENTS = 1000;
    const { document } = (new JSDOM()).window;
    for (let i = 0; i < ELEMENTS; i++) {
      const el = document.createElement("div");
      el.id = i < DUPLICATES ? "dup" : `el-${i}`;
      document.body.appendChild(el);
    }

    bench.add(`getElementById: duplicate ID (${DUPLICATES}x) among ${ELEMENTS}`, () => {
      document.getElementById("dup");
    });
  }

  // Lookup after tree mutations: remove and re-add an element each iteration.
  // Tests that cache invalidation (add/delete) doesn't introduce regressions in mutation-heavy workloads.
  {
    const ELEMENTS = 1000;
    const { document } = (new JSDOM()).window;
    const container = document.createElement("div");
    document.body.appendChild(container);
    for (let i = 0; i < ELEMENTS; i++) {
      const el = document.createElement("div");
      el.id = `el-${i}`;
      container.appendChild(el);
    }
    const target = document.getElementById("el-500");

    bench.add(`getElementById after mutation: ${ELEMENTS} elements`, () => {
      container.removeChild(target);
      container.appendChild(target);
      document.getElementById("el-500");
    });
  }

  // Bulk insert then lookup: measures getElementById during DOM construction.
  // Common pattern: build up a document, then query by ID.
  {
    const ELEMENTS = 200;
    const { document } = (new JSDOM()).window;

    bench.add(`bulk insert ${ELEMENTS} + getElementById`, () => {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < ELEMENTS; i++) {
        const el = document.createElement("div");
        el.id = `item-${i}`;
        frag.appendChild(el);
      }
      document.body.appendChild(frag);
      document.getElementById("item-100");
    }, {
      afterEach() {
        document.body.innerHTML = "";
      }
    });
  }

  return bench;
};
