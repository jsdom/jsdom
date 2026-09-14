"use strict";

const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../../lib/api");
const tree = require("../../lib/jsdom/living/helpers/dom-tree");

describe("Range index calculation", () => {
  it("does not query sibling indexes for mutations without live Ranges", () => {
    const { window } = new JSDOM();
    const parent = window.document.createElement("div");
    const children = Array.from({ length: 10 }, () => window.document.createElement("span"));
    parent.append(...children);
    const child = window.document.createElement("span");
    const originalIndex = tree.index;
    let queries = 0;
    tree.index = node => {
      ++queries;
      return originalIndex(node);
    };
    try {
      parent.insertBefore(child, children[5]);
      parent.removeChild(child);
      assert.equal(queries, 0);
    } finally {
      tree.index = originalIndex;
      window.close();
    }
  });
});
