"use strict";

// Returns 0 if equal, +1 for after and -1 for before
// https://dom.spec.whatwg.org/#concept-range-bp-after
//
// The relative tree position comes from the DOM tree, which walks the two
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

  const { ancestor, leftChild, rightChild } = nodeA._commonAncestorInfo(nodeB);

  if (ancestor === null) {
    throw new Error(`Internal Error: Boundary points should have the same root!`);
  }

  // nodeA is an ancestor of nodeB: the boundary points are ordered by whether
  // offsetA is past the child of nodeA that contains nodeB.
  if (ancestor === nodeA) {
    return rightChild._treeIndex() < offsetA ? 1 : -1;
  }

  // nodeB is an ancestor of nodeA, i.e. the mirror of the above with the
  // boundary points swapped, so the result is inverted.
  if (ancestor === nodeB) {
    return leftChild._treeIndex() < offsetB ? -1 : 1;
  }

  // Disjoint subtrees: tree order alone decides.
  return leftChild._treeIndex() < rightChild._treeIndex() ? -1 : 1;
}

module.exports = {
  compareBoundaryPointsPosition
};
