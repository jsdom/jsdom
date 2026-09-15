"use strict";

const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  function descend(parent, depth) {
    for (let i = 0; i < depth; ++i) {
      parent = parent.appendChild(document.createElement("div"));
    }
    return parent;
  }

  for (const [leftDepth, rightDepth, sharedDepth] of [[1000, 1000, 0], [1000, 10, 0], [10, 10, 1000]]) {
    const root = document.createElement("div");
    const commonAncestor = descend(root, sharedDepth);
    const left = descend(commonAncestor, leftDepth);
    const right = descend(commonAncestor, rightDepth);
    bench.add(`compare branches: depths ${leftDepth}/${rightDepth}, shared depth ${sharedDepth}`, () => {
      return left.compareDocumentPosition(right);
    });

    const range = document.createRange();
    range.setStart(left, 0);
    range.setEnd(right, 0);
    bench.add(`common ancestor: depths ${leftDepth}/${rightDepth}, shared depth ${sharedDepth}`, () => {
      return range.commonAncestorContainer;
    });
  }

  return bench;
};
