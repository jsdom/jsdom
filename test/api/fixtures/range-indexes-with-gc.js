"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

function createIndexedParent(document) {
  const parent = document.body.appendChild(document.createElement("div"));
  parent.innerHTML = "<i></i><span><b></b></span><i></i><i></i>";
  // Shift the append-time indexes, then index past the subtree we will remove.
  parent.prepend(document.createElement("i"));
  const range = document.createRange();
  range.selectNode(parent.children[3]);
  assert.equal(range.startOffset, 3);
  return parent;
}

function removeIndexedSubtrees(document) {
  const parents = [];
  const references = [];
  for (const operation of ["remove", "clear", "move"]) {
    const parent = createIndexedParent(document);
    parents.push(parent);
    const subtree = parent.children[2];
    references.push([operation, new WeakRef(subtree)], [`${operation} descendant`, new WeakRef(subtree.firstChild)]);

    if (operation === "clear") {
      parent.replaceChildren();
    } else {
      if (operation === "move") {
        const target = document.body.appendChild(document.createElement("div"));
        target.innerHTML = "<i></i><i></i><i></i>";
        target.insertBefore(subtree, target.children[1]);
        const range = document.createRange();
        range.selectNode(target.children[2]);
        assert.equal(range.startOffset, 2);
        parents.push(target);
      }
      subtree.remove();
    }
  }
  return { parents, references };
}

(async () => {
  const { document } = new JSDOM().window;
  const { parents, references } = removeIndexedSubtrees(document);

  let retained;
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    retained = references.filter(([, reference]) => reference.deref() !== undefined);
    if (retained.length === 0) {
      break;
    }
  }

  // Both the original and destination parents must outlive the removed subtrees.
  assert(parents.every(parent => parent.isConnected));
  console.log(retained.length === 0 ? "collected" : `retained: ${retained.map(([name]) => name).join(", ")}`);
})();
