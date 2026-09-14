"use strict";

const documentBench = require("../document-bench");
const { implForWrapper } = require("../../lib/generated/idl/utils");
const {
  shadowIncludingInclusiveDescendantsIterator
} = require("../../lib/jsdom/living/helpers/dom-tree");

module.exports = () => {
  const { document, bench } = documentBench();

  for (const shape of ["flat", "deep", "fields", "nested shadow"]) {
    const root = document.createElement("div");
    let parent = root;
    for (let i = 0; i < 200; ++i) {
      const child = parent.appendChild(document.createElement("div"));
      if (shape === "deep") {
        parent = child;
      } else if (shape === "nested shadow") {
        parent = child.attachShadow({ mode: "closed" });
      } else if (shape === "fields") {
        child.innerHTML = "<label><span>Name</span><input></label>";
      }
    }

    const impl = implForWrapper(root);
    for (const limit of [10, Infinity]) {
      const mode = limit === Infinity ? "exhaustive" : "early exit";
      bench.add(`shadow-including traversal: ${shape}, ${mode}`, () => {
        let count = 0;
        for (const node of shadowIncludingInclusiveDescendantsIterator(impl)) {
          if (++count === limit) {
            return node;
          }
        }
        return count;
      });
    }
  }

  return bench;
};
