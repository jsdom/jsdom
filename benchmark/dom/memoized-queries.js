"use strict";
const documentBench = require("../document-bench");

const DEPTH = 12;

module.exports = () => {
  const { document, bench } = documentBench();
  const root = document.createElement("div");
  let target = root;

  for (let i = 1; i < DEPTH; ++i) {
    const child = document.createElement("div");
    target.append(child);
    target = child;
  }

  bench.add(`toggleAttribute(): depth ${DEPTH} without query reads`, () => {
    target.toggleAttribute("data-mutated");
  });

  return bench;
};
