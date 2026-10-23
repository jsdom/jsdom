"use strict";

const { ELEMENT_NODE, DOCUMENT_FRAGMENT_NODE } = require("../../node-type.js");
const { HTML_NS, SVG_NS } = require("../../helpers/namespaces.js");

exports.isHTMLDocument = document => document._parsingMode === "html";
exports.isHTMLElement = (element, ...types) => element !== null && element !== undefined &&
  element._namespaceURI === HTML_NS && (types.length === 0 || types.includes(element._localName));
exports.isSVGElement = (element, ...types) => element !== null && element !== undefined &&
  element._namespaceURI === SVG_NS && (types.length === 0 || types.includes(element._localName));
exports.isShadowRoot = node => node.nodeType === DOCUMENT_FRAGMENT_NODE && node._host !== undefined;
exports.getParentElement = element => element.parentElement ?? element.parentNode?._host;

exports.getElementSiblingIndex = (element, ofType, reverse) => {
  const parent = element.parentNode;
  if (parent === null) {
    return 1;
  }
  const queries = parent._getMemoizedQueries();
  queries.elementIndexes ??= {};
  const direction = reverse ? "reverse" : "forward";
  let state = queries.elementIndexes[direction];
  if (state === undefined) {
    state = {
      next: reverse ? parent.lastChild : parent.firstChild,
      count: 0,
      types: new Map(),
      positions: new Map()
    };
    queries.elementIndexes[direction] = state;
  }
  let position = state.positions.get(element);
  if (position === undefined) {
    while (state.next !== null) {
      const child = state.next;
      state.next = reverse ? child.previousSibling : child.nextSibling;
      if (child.nodeType !== ELEMENT_NODE) {
        continue;
      }
      let types = state.types.get(child._namespaceURI);
      if (types === undefined) {
        types = new Map();
        state.types.set(child._namespaceURI, types);
      }
      const type = (types.get(child._localName) ?? 0) + 1;
      types.set(child._localName, type);
      position = { index: ++state.count, type };
      state.positions.set(child, position);
      if (child === element) {
        break;
      }
    }
  }
  return ofType ? position.type : position.index;
};

exports.findAncestorElement = (element, accept, reject) => {
  for (let parent = exports.getParentElement(element); parent; parent = exports.getParentElement(parent)) {
    if (accept(parent)) {
      return parent;
    }
    if (reject && reject(parent)) {
      return undefined;
    }
  }
  return undefined;
};

exports.findNextSiblingElement = (element, predicate) => {
  for (let sibling = element.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
    if (predicate(sibling)) {
      return sibling;
    }
  }
  return undefined;
};

exports.findPreviousSiblingElement = (element, predicate) => {
  for (let sibling = element.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
    if (predicate(sibling)) {
      return sibling;
    }
  }
  return undefined;
};

exports.nextSiblingElements = function* (element) {
  for (let sibling = element.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
    yield sibling;
  }
};

exports.rightCombinedElements = function* (element, combinator, context) {
  if (combinator === "||" || (combinator !== null && typeof combinator !== "string")) {
    return;
  }
  const relation = combinator;
  if (element === context?.root._host) {
    if (relation === "+" || relation === "~") {
      return;
    }
    element = context.root;
  }
  switch (relation) {
    case ">":
      for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
        yield child;
      }
      return;
    case "+":
      if (element.nextElementSibling) {
        yield element.nextElementSibling;
      }
      return;
    case "~":
      yield* exports.nextSiblingElements(element);
      return;
    default:
      yield* exports.traverse(element);
  }
};

exports.traverse = function* (tree, { includeSubtrees, inclusive, limits, nodeTypes = [ELEMENT_NODE] } = {}) {
  const nodes = includeSubtrees ? tree._shadowIncludingInclusiveDescendants() : tree._inclusiveDescendants();
  for (const node of nodes) {
    if (node === tree && !inclusive) {
      continue;
    }
    if (limits && limits.some(limit => limit === node || limit.contains(node))) {
      continue;
    }
    if (nodeTypes.includes(node.nodeType)) {
      yield node;
    }
  }
};
