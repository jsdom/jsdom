"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const idlUtils = require("../../lib/generated/idl/utils.js");
const { domSymbolTree } = require("../../lib/jsdom/living/helpers/internal-constants.js");
const { memoizeQuery } = require("../../lib/jsdom/utils.js");

describe("Memoized queries", () => {
  it("leaves objects without memoized-query storage unsupported", () => {
    const object = {};
    let calls = 0;
    const query = memoizeQuery(value => {
      ++calls;
      return value;
    });

    assert.equal(query.call(object, "value"), "value");
    assert.equal(query.call(object, "value"), "value");
    assert.equal(calls, 2);
    assert.equal(object._memoizedQueries, undefined);
  });

  it("allocates on first use and invalidates without breaking the old live collection", () => {
    const { document } = (new JSDOM()).window;
    const root = document.createElement("div");
    const rootImpl = idlUtils.implForWrapper(root);
    const first = document.createElement("span");

    assert.equal(rootImpl._memoizedQueries, null);

    const oldCollection = root.getElementsByTagName("span");
    assert.notEqual(rootImpl._memoizedQueries, null);
    assert.equal(root.getElementsByTagName("span"), oldCollection);

    root.append(first);
    assert.equal(rootImpl._memoizedQueries, null);
    assert.deepEqual([...oldCollection], [first]);

    const newCollection = root.getElementsByTagName("span");
    assert.notEqual(newCollection, oldCollection);
    assert.equal(root.getElementsByTagName("span"), newCollection);
  });

  it("allocates label associations lazily", () => {
    const { document } = (new JSDOM()).window;
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.htmlFor = "first";
    input.id = "first";
    document.body.append(label, input);

    const documentImpl = idlUtils.implForWrapper(document);
    assert.equal(documentImpl._memoizedQueries, null);

    assert.deepEqual([...input.labels], [label]);
    assert.notEqual(documentImpl._memoizedQueries, null);
  });

  it("does not recurse through a second ancestor walk during invalidation", () => {
    const depth = 20_000;
    const { document } = (new JSDOM()).window;
    const nodes = Array.from({ length: depth }, () => document.createElement("div"));

    // Build the chain directly so test setup does not call _modified() once for every level.
    for (let i = 1; i < depth; ++i) {
      domSymbolTree.appendChild(idlUtils.implForWrapper(nodes[i - 1]), idlUtils.implForWrapper(nodes[i]));
    }

    assert.doesNotThrow(() => nodes.at(-1).toggleAttribute("data-mutated"));
  });
});
