"use strict";

// Portions adapted from SymbolTree (https://github.com/jsdom/js-symbol-tree).
// Copyright (c) 2015 Joris van der Wel
// Licensed under the MIT license; see LICENSE.txt.

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

// Reads share an empty record with the same shape as allocated links. It is
// never modified: mutations allocate links before attaching a node.
const emptyLinks = new Links();

function links(node) {
  return node._links || emptyLinks;
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

function following(node, { root = null, skipChildren = false } = {}) {
  if (!skipChildren) {
    const child = node.firstChild;
    if (child) {
      return child;
    }
  }
  return nextAfterSubtree(node, root);
}

function nextAfterSubtree(node, root) {
  while (node !== root && node !== null) {
    const data = links(node);
    if (data.nextSibling) {
      return data.nextSibling;
    }
    node = data.parent;
  }
  return null;
}

function nextInTree(node, root) {
  return node.firstChild || nextAfterSubtree(node, root);
}

function preceding(node, { root = null } = {}) {
  return previousInTree(node, root);
}

function previousInTree(node, root) {
  if (node === root) {
    return null;
  }
  const data = links(node);
  return data.previousSibling ? lastInclusiveDescendant(data.previousSibling) : data.parent;
}

// Iterators capture the next light-tree node before yielding the current one.
// This matters when a consumer removes or moves the current/next node.
class SiblingsIterator {
  constructor(root, next) {
    this.root = root;
    this.current = next;
  }

  next() {
    const value = this.current;
    if (value === null) {
      return { value: this.root, done: true };
    }
    this.current = value.nextSibling;
    return { value, done: false };
  }

  [Symbol.iterator]() {
    return this;
  }
}

class PreviousSiblingsIterator extends SiblingsIterator {
  next() {
    const value = this.current;
    if (value === null) {
      return { value: this.root, done: true };
    }
    this.current = value.previousSibling;
    return { value, done: false };
  }
}

class AncestorsIterator extends SiblingsIterator {
  next() {
    const value = this.current;
    if (value === null) {
      return { value: this.root, done: true };
    }
    this.current = value.parentNode;
    return { value, done: false };
  }
}

class DescendantsIterator extends SiblingsIterator {
  next() {
    const value = this.current;
    if (value === null) {
      return { value: this.root, done: true };
    }
    this.current = nextInTree(value, this.root);
    return { value, done: false };
  }
}

class PrecedingIterator extends SiblingsIterator {
  next() {
    const value = this.current;
    if (value === null) {
      return { value: this.root, done: true };
    }
    this.current = previousInTree(value, this.root);
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

function childrenIterator(node, { reverse = false } = {}) {
  return reverse ? new PreviousSiblingsIterator(node, node.lastChild) : new SiblingsIterator(node, node.firstChild);
}

function nextSiblingsIterator(node) {
  return new SiblingsIterator(node, node.nextSibling);
}

function previousSiblingsIterator(node) {
  return new PreviousSiblingsIterator(node, node.previousSibling);
}

function ancestorsIterator(node) {
  return new AncestorsIterator(node, node);
}

function treeIterator(root, { reverse = false } = {}) {
  return reverse ? new PrecedingIterator(root, lastInclusiveDescendant(root)) : new DescendantsIterator(root, root);
}

function shadowIncludingInclusiveDescendantsIterator(root) {
  return new ShadowIncludingIterator(root);
}

function shadowIncludingDescendantsIterator(root) {
  const iterator = new ShadowIncludingIterator(root);
  iterator.next();
  return iterator;
}

function childrenToArray(node, { array = [], filter, thisArg } = {}) {
  let child = node.firstChild;
  while (child) {
    if (!filter || filter.call(thisArg, child)) {
      array.push(child);
    }
    child = child.nextSibling;
  }
  return array;
}

function treeToArray(root, { array = [], filter, thisArg } = {}) {
  let node = root;
  while (node) {
    if (!filter || filter.call(thisArg, node)) {
      array.push(node);
    }
    node = nextInTree(node, root);
  }
  return array;
}

// The bit values match Node.DOCUMENT_POSITION_*. Disconnected ordering is
// supplied by NodeImpl, which also handles Attr nodes.
const TreePosition = Object.freeze({
  DISCONNECTED: 1,
  PRECEDING: 2,
  FOLLOWING: 4,
  CONTAINS: 8,
  CONTAINED_BY: 16
});

function rootOf(node) {
  let ancestor;
  while ((ancestor = node.parentNode)) {
    node = ancestor;
  }
  return node;
}

function compareTreePosition(left, right) {
  if (left === right) {
    return 0;
  }
  // NodeImpl represents an unattached Attr by its null owner element.
  if (left === null || right === null) {
    return TreePosition.DISCONNECTED;
  }

  const leftParent = left.parentNode;
  const rightParent = right.parentNode;
  if (leftParent === rightParent) {
    if (leftParent === null) {
      return TreePosition.DISCONNECTED;
    }
    return left._treeIndex() < right._treeIndex() ? TreePosition.FOLLOWING : TreePosition.PRECEDING;
  }
  // When one node is a root, only the other node's root is needed. Avoid
  // counting depths and comparing ancestors on every step of a deep chain.
  if (leftParent === null) {
    return rootOf(rightParent) === left ?
      TreePosition.CONTAINED_BY | TreePosition.FOLLOWING :
      TreePosition.DISCONNECTED;
  }
  if (rightParent === null) {
    return rootOf(leftParent) === right ?
      TreePosition.CONTAINS | TreePosition.PRECEDING :
      TreePosition.DISCONNECTED;
  }

  // Walk together so equally deep nodes can stop at their common ancestor.
  // Keep the paths for unequal depths instead of walking the DOM links twice.
  const leftAncestors = [];
  const rightAncestors = [];
  let a = left;
  let b = right;
  while (a !== null || b !== null) {
    if (a === right) {
      return TreePosition.CONTAINS | TreePosition.PRECEDING;
    }
    if (b === left) {
      return TreePosition.CONTAINED_BY | TreePosition.FOLLOWING;
    }
    if (a === b) {
      return leftAncestors.at(-1)._treeIndex() < rightAncestors.at(-1)._treeIndex() ?
        TreePosition.FOLLOWING :
        TreePosition.PRECEDING;
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
    return TreePosition.DISCONNECTED;
  }
  // Neither node is an ancestor of the other, so the paths diverge before
  // either array is exhausted.
  while (leftAncestors[i] === rightAncestors[j]) {
    --i;
    --j;
  }
  return leftAncestors[i]._treeIndex() < rightAncestors[j]._treeIndex() ?
    TreePosition.FOLLOWING :
TreePosition.PRECEDING;
}

function appendChild(node, child) {
  const data = ensureLinks(node);
  const childData = ensureLinks(child);
  childData.parent = node;
  childData.previousSibling = data.lastChild;
  if (data.lastChild) {
    links(data.lastChild).nextSibling = child;
  } else {
    data.firstChild = child;
  }
  data.lastChild = child;
  // Appending preserves every existing child's index.
  childData.cachedIndex = data.childCount++;
  return child;
}

function insertBefore(reference, child) {
  const referenceData = links(reference);
  const data = links(referenceData.parent);
  const childData = ensureLinks(child);
  childData.parent = referenceData.parent;
  childData.previousSibling = referenceData.previousSibling;
  childData.nextSibling = reference;
  if (referenceData.previousSibling) {
    links(referenceData.previousSibling).nextSibling = child;
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
  const data = links(node);
  if (data.parent === null) {
    return node;
  }
  const parentData = links(data.parent);
  if (data.previousSibling) {
    links(data.previousSibling).nextSibling = data.nextSibling;
  } else {
    parentData.firstChild = data.nextSibling;
  }
  if (data.nextSibling) {
    links(data.nextSibling).previousSibling = data.previousSibling;
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
  TreePosition,
  lastInclusiveDescendant, following, preceding,
  childrenIterator, nextSiblingsIterator, previousSiblingsIterator, ancestorsIterator, treeIterator,
  shadowIncludingInclusiveDescendantsIterator, shadowIncludingDescendantsIterator,
  childrenToArray, treeToArray, compareTreePosition,
  appendChild, insertBefore, remove
};
