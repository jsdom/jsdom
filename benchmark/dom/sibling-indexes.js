"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  for (const liveRange of [false, true]) {
    const suffix = liveRange ? "with a live Range" : "without live Ranges";
    const removalParent = document.createElement("div");
    const insertionParent = document.createElement("div");
    const removalChildren = Array.from({ length: 1000 }, () => document.createElement("span"));
    const insertionChildren = Array.from({ length: 1000 }, () => document.createElement("span"));
    const reference = document.createElement("span");
    const removalRange = liveRange ? document.createRange() : null;
    const insertionRange = liveRange ? document.createRange() : null;

    // Restore the trees outside the timed region. Repeated mutations at the end
    // invalidate sibling-index caches and expose unnecessary rescans.
    bench.add(`removeChild: last of 1000 siblings, ${suffix}`, () => {
      while (removalParent.lastChild) {
        removalParent.removeChild(removalParent.lastChild);
      }
    }, {
      beforeEach() {
        removalParent.replaceChildren(...removalChildren);
        if (liveRange) {
          removalRange.selectNodeContents(removalParent);
        }
      }
    });

    bench.add(`insertBefore: 1000 siblings before last child, ${suffix}`, () => {
      for (const child of insertionChildren) {
        insertionParent.insertBefore(child, reference);
      }
    }, {
      beforeEach() {
        insertionParent.replaceChildren(reference);
        if (liveRange) {
          insertionRange.selectNodeContents(insertionParent);
        }
      }
    });
  }

  return bench;
};
