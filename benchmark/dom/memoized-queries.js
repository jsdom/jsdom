"use strict";
const documentBench = require("../document-bench");

const DEPTH = 12;
const READS = 100;
const TAG_NAMES = ["a", "abbr", "address", "article", "aside", "b", "blockquote", "button"];

module.exports = () => {
  const { document, bench } = documentBench();
  const root = document.createElement("div");
  let target = root;

  for (let i = 1; i < DEPTH; ++i) {
    const child = document.createElement("div");
    target.append(child);
    target = child;
  }

  const queryRoot = document.createElement("div");
  for (const tagName of TAG_NAMES) {
    queryRoot.append(document.createElement(tagName));
  }
  for (const tagName of TAG_NAMES) {
    queryRoot.getElementsByTagName(tagName);
  }
  queryRoot.getElementsByTagNameNS(null, "a");

  bench.add(`toggleAttribute(): depth ${DEPTH} without query reads`, () => {
    target.toggleAttribute("data-mutated");
  });

  bench.add(`getElementsByTagName(): ${READS} cached reads`, () => {
    for (let i = 0; i < READS; ++i) {
      queryRoot.getElementsByTagName("a");
    }
  });

  let tagNameIndex = 0;
  bench.add(`getElementsByTagName(): ${READS} cached reads across eight names`, () => {
    for (let i = 0; i < READS; ++i) {
      queryRoot.getElementsByTagName(TAG_NAMES[tagNameIndex++ & 7]);
    }
  });

  bench.add(`getElementsByTagNameNS(): ${READS} cached null-namespace reads`, () => {
    for (let i = 0; i < READS; ++i) {
      queryRoot.getElementsByTagNameNS(null, "a");
    }
  });

  bench.add("getElementsByTagName(): mutation followed by a read", () => {
    queryRoot.firstChild.toggleAttribute("data-mutated");
    queryRoot.getElementsByTagName("a");
  });

  return bench;
};
