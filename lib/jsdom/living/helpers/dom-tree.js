"use strict";

// Portions adapted from SymbolTree (https://github.com/jsdom/js-symbol-tree).
// Copyright (c) 2015 Joris van der Wel
// Licensed under the MIT license; see LICENSE.txt.

const NODE_DOCUMENT_POSITION = require("../node-document-position");

// DOM links are allocated only when a node joins a tree or gains children. In
// particular, reading the tree must not allocate storage for Attr or new nodes.
// Insertion callers provide detached children. Mutations here only change links:
// NodeImpl handles validation, adoption, ranges, observers, slots, and reactions.
class Links {
  parent = null;
  previousSibling = null;
  nextSibling = null;
  firstChild = null;
  lastChild = null;
  childCount = 0;
  // null: append-time indexes are valid; undefined: they need rebuilding;
  // array: a lazily indexed prefix of the children.
  cachedChildren = null;
  cachedIndex = -1;
}

function ensureLinks(node) {
  const data = node._links;
  if (data) {
    return data;
  }
  node._links = new Links();
  return node._links;
}

function lastInclusiveDescendant(node) {
  let child;
  while ((child = node.lastChild)) {
    node = child;
  }
  return node;
}

function nextAfterSubtree(node, root) {
  while (node !== root && node !== null) {
    const data = node._links;
    if (data === null) {
      return null;
    }
    if (data.nextSibling) {
      return data.nextSibling;
    }
    node = data.parent;
  }
  return null;
}

function nextInTree(node, root) {
  const data = node._links;
  return data === null ? null : data.firstChild || nextAfterSubtree(node, root);
}

function previousInTree(node, root) {
  if (node === root) {
    return null;
  }
  const data = node._links;
  if (data === null) {
    return null;
  }
  return data.previousSibling ? lastInclusiveDescendant(data.previousSibling) : data.parent;
}

// Iterators capture the next light-tree node before yielding the current one.
// This matters when a consumer removes or moves the current/next node.
class ChildrenIterator extends Iterator {
  constructor(next) {
    super();
    this.current = next;
  }

  next() {
    const value = this.current;
    if (value === null) {
      return { value: undefined, done: true };
    }
    this.current = value.nextSibling;
    return { value, done: false };
  }
}

class DescendantsIterator extends Iterator {
  constructor(root, next) {
    super();
    this.root = root;
    this.current = next;
  }

  next() {
    const value = this.current;
    if (value === null) {
      return { value: undefined, done: true };
    }
    this.current = nextInTree(value, this.root);
    return { value, done: false };
  }
}

// https://dom.spec.whatwg.org/#concept-shadow-including-descendant
class ShadowIncludingIterator extends DescendantsIterator {
  constructor(root) {
    super(root, root);
    this.previous = null;
    this.stack = null;
  }

  next() {
    // A host's shadow root is inspected after visiting the host. Its light-tree
    // successor was captured before visiting it. Keep both mutation semantics.
    if (this.previous && this.previous._shadowRoot) {
      this.stack ||= [];
      this.stack.push(this.root, this.current);
      this.root = this.previous._shadowRoot;
      this.current = this.root;
    }
    while (this.current === null && this.stack && this.stack.length > 0) {
      this.current = this.stack.pop();
      this.root = this.stack.pop();
    }
    const value = this.current;
    this.previous = value;
    if (value === null) {
      return { value: undefined, done: true };
    }
    this.current = nextInTree(value, this.root);
    return { value, done: false };
  }
}

// Collection refreshes avoid iterator-result objects and intermediate filter iterators.
function childrenToArray(node, filter) {
  const array = [];
  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (filter === undefined || filter(child)) {
      array.push(child);
    }
  }
  return array;
}

function descendantsToArray(root, node, filter) {
  const array = [];
  while (node !== null) {
    if (filter === undefined || filter(node)) {
      array.push(node);
    }
    node = nextInTree(node, root);
  }
  return array;
}

function compareTreePosition(left, right) {
  if (left === right) {
    return 0;
  }
  // NodeImpl represents an unattached Attr by its null owner element.
  if (left === null || right === null) {
    return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED;
  }

  const leftParent = left.parentNode;
  const rightParent = right.parentNode;
  if (leftParent === rightParent) {
    if (leftParent === null) {
      return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED;
    }
    return left._treeIndex() < right._treeIndex() ?
      NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_FOLLOWING :
      NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_PRECEDING;
  }
  // When one node is a root, only the other node's root is needed. Avoid
  // counting depths and comparing ancestors on every step of a deep chain.
  if (leftParent === null) {
    return rightParent.getRootNode() === left ?
      NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_CONTAINED_BY | NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_FOLLOWING :
      NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED;
  }
  if (rightParent === null) {
    return leftParent.getRootNode() === right ?
      NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_CONTAINS | NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_PRECEDING :
      NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED;
  }

  const { ancestor, leftChild, rightChild } = commonAncestorInfo(left, right);
  if (ancestor === null) {
    return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED;
  }
  if (ancestor === left) {
    return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_CONTAINED_BY | NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_FOLLOWING;
  }
  if (ancestor === right) {
    return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_CONTAINS | NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_PRECEDING;
  }
  return leftChild._treeIndex() < rightChild._treeIndex() ?
    NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_FOLLOWING :
    NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_PRECEDING;
}

// Return the common ancestor and its child on each path. A child is null when that endpoint is the ancestor itself.
function commonAncestorInfo(left, right) {
  if (left === right) {
    return { ancestor: left, leftChild: null, rightChild: null };
  }
  if (left.parentNode === right.parentNode) {
    return { ancestor: left.parentNode, leftChild: left, rightChild: right };
  }

  // Walk together so equally deep nodes can stop at their common ancestor.
  // Keep the paths for unequal depths instead of walking the DOM links twice.
  const leftAncestors = [];
  const rightAncestors = [];
  let a = left;
  let b = right;
  while (a !== null || b !== null) {
    if (a === right) {
      return { ancestor: right, leftChild: leftAncestors.at(-1), rightChild: null };
    }
    if (b === left) {
      return { ancestor: left, leftChild: null, rightChild: rightAncestors.at(-1) };
    }
    if (a === b) {
      return { ancestor: a, leftChild: leftAncestors.at(-1), rightChild: rightAncestors.at(-1) };
    }
    if (a !== null) {
      leftAncestors.push(a);
      a = a.parentNode;
    }
    if (b !== null) {
      rightAncestors.push(b);
      b = b.parentNode;
    }
  }
  let i = leftAncestors.length - 1;
  let j = rightAncestors.length - 1;
  if (leftAncestors[i] !== rightAncestors[j]) {
    return { ancestor: null, leftChild: null, rightChild: null };
  }
  // Neither node is an ancestor of the other, so the paths diverge before
  // either array is exhausted.
  while (leftAncestors[i] === rightAncestors[j]) {
    --i;
    --j;
  }
  return { ancestor: leftAncestors[i + 1], leftChild: leftAncestors[i], rightChild: rightAncestors[j] };
}

function treeIndex(node) {
  const data = node._links;
  if (data === null || data.parent === null) {
    return -1;
  }
  const parentData = data.parent._links;
  if (data.previousSibling === null) {
    return 0;
  }
  if (data.nextSibling === null) {
    return parentData.childCount - 1;
  }
  if (parentData.cachedChildren === null) {
    return data.cachedIndex;
  }
  const cached = parentData.cachedChildren ||= [];
  // A shifted node can retain an old index inside the rebuilt prefix. Check
  // identity as well as the index before using it.
  if (cached[data.cachedIndex] === node) {
    return data.cachedIndex;
  }
  let child = cached.length === 0 ? parentData.firstChild : cached.at(-1).nextSibling;
  while (child !== node) {
    child._links.cachedIndex = cached.length;
    cached.push(child);
    child = child.nextSibling;
  }
  data.cachedIndex = cached.length;
  cached.push(node);
  return data.cachedIndex;
}

function appendChild(node, child) {
  const data = ensureLinks(node);
  const childData = ensureLinks(child);
  childData.parent = node;
  childData.previousSibling = data.lastChild;
  if (data.lastChild) {
    data.lastChild._links.nextSibling = child;
  } else {
    data.firstChild = child;
  }
  data.lastChild = child;
  // Appending preserves every existing child's index.
  childData.cachedIndex = data.childCount++;
  return child;
}

function insertBefore(reference, child) {
  const referenceData = reference._links;
  const data = referenceData.parent._links;
  const childData = ensureLinks(child);
  childData.parent = referenceData.parent;
  childData.previousSibling = referenceData.previousSibling;
  childData.nextSibling = reference;
  if (referenceData.previousSibling) {
    referenceData.previousSibling._links.nextSibling = child;
  } else {
    data.firstChild = child;
  }
  referenceData.previousSibling = child;
  ++data.childCount;
  const cached = data.cachedChildren;
  if (cached === null) {
    data.cachedChildren = undefined;
  } else if (cached && cached[referenceData.cachedIndex] === reference) {
    // Only the inserted child and following siblings need new indexes.
    cached.length = referenceData.cachedIndex;
  }
  return child;
}

function remove(node) {
  const data = node._links;
  if (data === null || data.parent === null) {
    return node;
  }
  const parentData = data.parent._links;
  if (data.previousSibling) {
    data.previousSibling._links.nextSibling = data.nextSibling;
  } else {
    parentData.firstChild = data.nextSibling;
  }
  if (data.nextSibling) {
    data.nextSibling._links.previousSibling = data.previousSibling;
  } else {
    // Removing the last child preserves the remaining indexes.
    parentData.lastChild = data.previousSibling;
  }
  const cached = parentData.cachedChildren;
  if (data.nextSibling !== null && cached === null) {
    parentData.cachedChildren = undefined;
  } else if (cached && cached[data.cachedIndex] === node) {
    // Truncating also releases cached references to the removed subtree.
    cached.length = data.cachedIndex;
  }
  --parentData.childCount;
  data.parent = null;
  data.previousSibling = null;
  data.nextSibling = null;
  data.cachedIndex = -1;
  return node;
}

module.exports = {
  ChildrenIterator, DescendantsIterator, ShadowIncludingIterator,
  childrenToArray, descendantsToArray,
  nextInTree, nextAfterSubtree, previousInTree, lastInclusiveDescendant,
  compareTreePosition, commonAncestorInfo,
  treeIndex, appendChild, insertBefore, remove
};
