"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  for (const shape of ["adjacent elements", "mixed nodes", "no elements"]) {
    const parents = [];
    const firstNodes = [];
    const lastNodes = [];
    for (let i = 0; i < 100; ++i) {
      const parent = document.createElement("div");
      const gap = shape === "adjacent elements" ? "" : "text<!-- comment -->".repeat(4);
      parent.innerHTML = shape === "no elements" ? gap : `${gap}<span></span>${gap}<span></span>${gap}`;
      parents.push(parent);
      firstNodes.push(parent.firstChild);
      lastNodes.push(parent.lastChild);
    }

    bench.add(`firstElementChild: ${shape}`, () => {
      let count = 0;
      for (const parent of parents) {
        if (parent.firstElementChild !== null) {
          ++count;
        }
      }
      return count;
    });

    bench.add(`lastElementChild: ${shape}`, () => {
      let count = 0;
      for (const parent of parents) {
        if (parent.lastElementChild !== null) {
          ++count;
        }
      }
      return count;
    });

    bench.add(`nextElementSibling: ${shape}`, () => {
      let count = 0;
      for (const node of firstNodes) {
        if (node.nextElementSibling !== null) {
          ++count;
        }
      }
      return count;
    });

    bench.add(`previousElementSibling: ${shape}`, () => {
      let count = 0;
      for (const node of lastNodes) {
        if (node.previousElementSibling !== null) {
          ++count;
        }
      }
      return count;
    });
  }

  return bench;
};
