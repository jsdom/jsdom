"use strict";

const NodeList = require("../../../generated/idl/NodeList");
const HTMLCollection = require("../../../generated/idl/HTMLCollection");
const { domSymbolTree } = require("../helpers/internal-constants");
const NODE_TYPE = require("../node-type");
const { convertNodesIntoNode } = require("../node");

const MAX_CACHED_ATTRIBUTE_SELECTORS = 16;
const MAX_CACHED_SELECTOR_LENGTH = 256;

// A conservative subset whose matches depend only on the queried subtree, not ancestors or dynamic state.
const simpleAttributeSelector = /^\[[a-zA-Z_][\w-]*(?:=(?:"[^"\\\n\r\f]*"|'[^'\\\n\r\f]*'))?\]$/u;

class ParentNodeImpl {
  get children() {
    if (!this._childrenList) {
      this._childrenList = HTMLCollection.createImpl(this._globalObject, [], {
        element: this,
        query: () => domSymbolTree.childrenToArray(this, {
          filter: node => node.nodeType === NODE_TYPE.ELEMENT_NODE
        })
      });
    } else {
      this._childrenList._update();
    }
    return this._childrenList;
  }

  get firstElementChild() {
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return child;
      }
    }

    return null;
  }

  get lastElementChild() {
    for (const child of domSymbolTree.childrenIterator(this, { reverse: true })) {
      if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return child;
      }
    }

    return null;
  }

  get childElementCount() {
    return this.children.length;
  }

  prepend(...nodes) {
    this._preInsert(convertNodesIntoNode(this._ownerDocument, nodes), this.firstChild);
  }

  append(...nodes) {
    this._append(convertNodesIntoNode(this._ownerDocument, nodes));
  }

  replaceChildren(...nodes) {
    const node = convertNodesIntoNode(this._ownerDocument, nodes);
    this._preInsertValidity(node, null, new Set(domSymbolTree.childrenIterator(this)));
    this._replaceAll(node);
  }

  querySelector(selectors) {
    if (shouldAlwaysSelectNothing(this)) {
      return null;
    }
    const domSelector = this._ownerDocument._getDOMSelector();
    return domSelector.querySelector(selectors, this);
  }

  // WARNING FOR INTERNAL USERS:
  // This returns a NodeList impl, not a NodeList wrapper. NodeList impls are not iterable and do not have indexed
  // properties. To iterate over them, use `for (let i = 0; i < nodeListImpl.length; ++i) { nodeListImpl.item(i) }`.
  querySelectorAll(selectors) {
    if (shouldAlwaysSelectNothing(this)) {
      return NodeList.createImpl(this._globalObject, [], { nodes: [] });
    }
    const nodes = querySelectorAllNodes(this, selectors);
    return NodeList.createImpl(this._globalObject, [], { nodes });
  }
}

function querySelectorAllNodes(root, selectors) {
  let results;
  if (selectors.length <= MAX_CACHED_SELECTOR_LENGTH && simpleAttributeSelector.test(selectors)) {
    const memoizedQueries = root._getMemoizedQueries();
    results = memoizedQueries.attributeSelectorResults;
    if (results === null) {
      results = new Map();
      memoizedQueries.attributeSelectorResults = results;
    }
    const cached = results.get(selectors);
    if (cached !== undefined) {
      return cached;
    }
  }
  const domSelector = root._ownerDocument._getDOMSelector();
  const nodes = domSelector.querySelectorAll(selectors, root);
  if (results) {
    // Bound retention when a root receives many different selectors without intervening mutations.
    if (results.size === MAX_CACHED_ATTRIBUTE_SELECTORS) {
      results.delete(results.keys().next().value);
    }
    results.set(selectors, nodes);
  }
  return nodes;
}

function shouldAlwaysSelectNothing(elImpl) {
  // This is true during initialization.
  return elImpl === elImpl._ownerDocument && !elImpl.documentElement;
}

module.exports = {
  implementation: ParentNodeImpl
};
