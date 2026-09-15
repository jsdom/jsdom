"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  const deletionParent = document.createElement("div");
  const subtree = document.createElement("section");
  let descendant = subtree;
  for (let i = 0; i < 200; ++i) {
    descendant = descendant.appendChild(document.createElement("div"));
  }
  const deletionRange = document.createRange();
  bench.add("deleteContents: fully contained deep subtree", () => deletionRange.deleteContents(), {
    beforeEach() {
      deletionParent.appendChild(subtree);
      deletionRange.selectNode(subtree);
    }
  });

  for (const siblingCount of [0, 1000]) {
    const parent = document.createElement("div");
    const left = parent.appendChild(document.createTextNode("left"));
    const right = parent.appendChild(document.createTextNode("right"));
    for (let i = 0; i < siblingCount; ++i) {
      parent.appendChild(document.createElement("span"));
    }
    const wrapper = document.createElement("b");
    const range = document.createRange();
    bench.add(`surroundContents: adjacent text with ${siblingCount} unrelated siblings`, () => {
      range.surroundContents(wrapper);
    }, {
      beforeEach() {
        wrapper.remove();
        wrapper.replaceChildren();
        left.data = "left";
        right.data = "right";
        range.setStart(left, 2);
        range.setEnd(right, 3);
      }
    });
  }

  return bench;
};
