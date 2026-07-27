"use strict";
const documentBench = require("../document-bench");

// Range mutation, sized along the two axes that matter for it: how much the
// range covers, and how large the surrounding tree is. The second axis is the
// interesting one, because containment is decided with boundary-point
// comparisons and those walk the tree rather than the range.
//
// The surrounding tree is built once per task (beforeAll) and only the boundary
// container is restored between iterations (beforeEach), so the timed window
// holds just the range operation and the per-iteration allocation stays
// proportional to the span rather than to the whole tree.
module.exports = () => {
  const { document, bench } = documentBench();

  function buildRow(index) {
    const row = document.createElement("div");
    row.appendChild(document.createTextNode(`row ${index}`));
    row.appendChild(document.createElement("span"));
    return row;
  }

  // container
  //   span.filler * siblingCount
  //   div            <- `parent`, the shared boundary container
  //     header
  //     #comment     <- start marker
  //     div * listSize
  //     #comment     <- end marker
  //     footer
  function buildTree(listSize, siblingCount) {
    const container = document.createElement("div");
    for (let i = 0; i < siblingCount; ++i) {
      const filler = document.createElement("span");
      filler.appendChild(document.createTextNode("filler"));
      container.appendChild(filler);
    }

    const parent = document.createElement("div");
    container.appendChild(parent);

    // Rebuilds `parent` outright rather than just the span, so it also restores
    // an op that took the markers with it (selectNodeContents).
    const tree = { container, parent, start: null, end: null };
    tree.reset = () => {
      parent.replaceChildren();
      parent.appendChild(document.createElement("header"));
      tree.start = document.createComment("start");
      parent.appendChild(tree.start);
      for (let i = 0; i < listSize; ++i) {
        parent.appendChild(buildRow(i));
      }
      tree.end = document.createComment("end");
      parent.appendChild(tree.end);
      parent.appendChild(document.createElement("footer"));
    };
    tree.reset();

    return tree;
  }

  /** A range over the marker span: both boundary points are inside `parent`. */
  function addSpanTask(name, listSize, siblingCount, run, { destructive = true } = {}) {
    let tree,
      range;
    bench.add(name, () => run(range), {
      beforeAll() {
        tree = buildTree(listSize, siblingCount);
      },
      beforeEach() {
        if (destructive) {
          tree.reset();
        }
        range = document.createRange();
        range.setStartAfter(tree.start);
        range.setEndBefore(tree.end);
      }
    });
  }

  addSpanTask("deleteContents: small span, small tree", 10, 20, range => range.deleteContents());
  addSpanTask("deleteContents: small span, large tree", 10, 2000, range => range.deleteContents());
  addSpanTask("deleteContents: large span, large tree", 500, 2000, range => range.deleteContents());
  addSpanTask("extractContents: small span, large tree", 10, 2000, range => range.extractContents());
  addSpanTask("cloneContents: small span, large tree", 10, 2000, range => range.cloneContents(), {
    destructive: false
  });

  let selectTree, selectRange, partialTree, partialRange;

  // selectNodeContents() produces the same shared-container shape, over every
  // child of the container rather than a marked span.
  bench.add("deleteContents: selectNodeContents", () => selectRange.deleteContents(), {
    beforeAll() {
      selectTree = buildTree(200, 500);
    },
    beforeEach() {
      selectTree.reset();
      selectRange = document.createRange();
      selectRange.selectNodeContents(selectTree.parent);
    }
  });

  // Partially contained boundaries: the range starts and ends inside different
  // text nodes, so neither boundary container is fully covered. This is the
  // shape that cannot be reduced to one container's children, and it keeps the
  // general path measured.
  bench.add("deleteContents: partially contained boundaries", () => partialRange.deleteContents(), {
    beforeAll() {
      partialTree = buildTree(100, 500);
    },
    beforeEach() {
      partialTree.reset();
      const rows = partialTree.parent.getElementsByTagName("div");
      partialRange = document.createRange();
      partialRange.setStart(rows[0].firstChild, 2);
      partialRange.setEnd(rows[rows.length - 1].firstChild, 2);
    }
  });

  return bench;
};
