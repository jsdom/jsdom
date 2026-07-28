"use strict";

const { TreePosition } = require("symbol-tree");
const { domSymbolTree } = require("../helpers/internal-constants");

// Returns 0 if equal, +1 for after and -1 for before
// https://dom.spec.whatwg.org/#concept-range-bp-after
//
// The relative tree position comes from symbol-tree, which walks the two
// ancestor chains and compares indices within their lowest common ancestor.
// Deriving it from a tree-order scan instead — walking forward from one node
// until the other is found or the tree runs out — costs O(nodes following the
// node) per comparison, and the Range containment tests call this once or twice
// per candidate node.
function compareBoundaryPointsPosition(bpA, bpB) {
  const { node: nodeA, offset: offsetA } = bpA;
  const { node: nodeB, offset: offsetB } = bpB;

  if (nodeA === nodeB) {
    if (offsetA === offsetB) {
      return 0;
    } else if (offsetA < offsetB) {
      return -1;
    }

    return 1;
  }

  const position = domSymbolTree.compareTreePosition(nodeA, nodeB);

  if (position & TreePosition.DISCONNECTED) {
    throw new Error(`Internal Error: Boundary points should have the same root!`);
  }

  // nodeA is an ancestor of nodeB: the boundary points are ordered by whether
  // offsetA is past the child of nodeA that contains nodeB.
  if (position & TreePosition.CONTAINED_BY) {
    let child = nodeB;
    while (domSymbolTree.parent(child) !== nodeA) {
      child = domSymbolTree.parent(child);
    }

    return domSymbolTree.index(child) < offsetA ? 1 : -1;
  }

  // nodeB is an ancestor of nodeA, i.e. the mirror of the above with the
  // boundary points swapped, so the result is inverted.
  if (position & TreePosition.CONTAINS) {
    let child = nodeA;
    while (domSymbolTree.parent(child) !== nodeB) {
      child = domSymbolTree.parent(child);
    }

    return domSymbolTree.index(child) < offsetB ? -1 : 1;
  }

  // Disjoint subtrees: tree order alone decides.
  return position & TreePosition.PRECEDING ? 1 : -1;
}

module.exports = {
  compareBoundaryPointsPosition
};
