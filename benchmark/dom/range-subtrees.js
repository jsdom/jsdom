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

  for (const siblingCount of [0, 1000]) {
    const parent = document.createElement("div");
    const selected = parent.appendChild(document.createElement("b"));
    selected.textContent = "selected";
    for (let i = 0; i < siblingCount; ++i) {
      let node = parent.appendChild(document.createElement("section"));
      for (let depth = 0; depth < 20; ++depth) {
        node = node.appendChild(document.createElement("div"));
      }
      node.textContent = "unselected";
    }

    const range = document.createRange();
    range.selectNode(selected);
    bench.add(`toString: one child with ${siblingCount} unrelated subtrees`, () => range.toString(), {
      beforeEach() {
        parent.insertBefore(selected, parent.firstChild);
        range.selectNode(selected);
      }
    });

    const collapsed = document.createRange();
    collapsed.setStart(parent, 0);
    collapsed.collapse(true);
    bench.add(`toString: collapsed with ${siblingCount} unrelated subtrees`, () => collapsed.toString());

    const deletion = document.createRange();
    bench.add(`deleteContents: one child with ${siblingCount} unrelated subtrees`, () => deletion.deleteContents(), {
      beforeEach() {
        parent.insertBefore(selected, parent.firstChild);
        deletion.selectNode(selected);
      }
    });
  }

  return bench;
};
