"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  bench.add("appendChild: no siblings", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);
  });

  bench.add("appendChild: many siblings", () => {
    const parent = document.createElement("div");
    for (let i = 0; i < 1000; ++i) {
      parent.appendChild(document.createElement("span"));
    }
  });

  bench.add("appendChild: many parents", () => {
    const DEPTH = 500;
    const nodes = new Array(DEPTH);
    for (let n = 0; n < DEPTH; ++n) {
      nodes[n] = document.createElement("div");
    }
    for (let n = 1; n < DEPTH; ++n) {
      nodes[n - 1].appendChild(nodes[n]);
    }
  });

  bench.add("insertBefore: many siblings", () => {
    const parent = document.createElement("div");
    for (let i = 0; i < 1000; ++i) {
      parent.insertBefore(document.createElement("div"), parent.firstChild);
    }
  });

  bench.add("removeChild: no siblings", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);
    parent.removeChild(child);
  });

  bench.add("removeChild: many siblings", () => {
    const parent = document.createElement("div");
    const children = [];
    for (let i = 0; i < 1000; ++i) {
      const child = document.createElement("div");
      children.push(child);
      parent.appendChild(child);
    }
    for (const child of children) {
      parent.removeChild(child);
    }
  });

  bench.add("removeChild: many parents", () => {
    const DEPTH = 100;
    const nodes = new Array(DEPTH + 1);
    nodes[0] = document.createElement("div");
    for (let n = 0; n < DEPTH; ++n) {
      nodes[n + 1] = document.createElement("div");
      nodes[n].appendChild(nodes[n + 1]);
    }
    for (let n = 0; n < DEPTH; ++n) {
      nodes[n].removeChild(nodes[n + 1]);
    }
  });

  return bench;
};
