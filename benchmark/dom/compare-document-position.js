"use strict";
const documentBench = require("../document-bench");

const SIBLINGS = 10000;

module.exports = () => {
  let parent, children, descendantTree, ancestorTree;

  const { bench } = documentBench(document => {
    parent = document.createElement("div");
    children = new Array(SIBLINGS);
    for (let i = 0; i < SIBLINGS; ++i) {
      children[i] = document.createElement("span");
      parent.appendChild(children[i]);
    }

    descendantTree = buildDeepTree(document, 1000, 10);
    ancestorTree = buildDeepTree(document, 1000, 10);
  });

  bench.add("compare siblings", () => {
    children[0].compareDocumentPosition(children[SIBLINGS / 2]);
  });

  bench.add("compare descendant", () => {
    descendantTree.parent.compareDocumentPosition(descendantTree.deepest);
  });

  bench.add("compare ancestor", () => {
    ancestorTree.deepest.compareDocumentPosition(ancestorTree.parent);
  });

  return bench;
};

function buildDeepTree(document, depth, junkChildren) {
  const parent = document.createElement("div");
  let deepest = parent;

  for (let i = 0; i < depth; ++i) {
    const newNode = document.createElement("div");
    for (let j = 0; j < junkChildren; ++j) {
      newNode.appendChild(document.createElement("div"));
    }
    deepest.appendChild(newNode);
    deepest = newNode;
  }

  return { parent, deepest };
}
