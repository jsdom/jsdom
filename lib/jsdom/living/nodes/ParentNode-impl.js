"use strict";

const DOMException = require("../../../generated/idl/DOMException");
const NodeList = require("../../../generated/idl/NodeList");
const HTMLCollection = require("../../../generated/idl/HTMLCollection");
const { domSymbolTree } = require("../helpers/internal-constants");
const NODE_TYPE = require("../node-type");
const { convertNodesIntoNode } = require("../node");
const { matchTreesAgainstSelectors, parseGrammar } = require("@cdoublev/css");

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

    const cache = this._ownerDocument._selectorCache;
    const key = `:query(${selectors})`;
    if (cache.has(this, key)) {
      return cache.get(this, key);
    }

    selectors = parseGrammar(selectors, "<selector-list>");
    if (!selectors || selectors instanceof SyntaxError) {
      throw DOMException.create(this._globalObject, [
        "Invalid selectors",
        "SyntaxError"
      ]);
    }

    const context = { scopes: { roots: [this] } };
    const options = { first: true };
    const root = this.getRootNode({});
    const node = matchTreesAgainstSelectors([root], selectors, context, options);
    cache.set(this, key, node);

    return node;
  }

  // WARNING FOR INTERNAL USERS:
  // This returns a NodeList impl, not a NodeList wrapper. NodeList impls are not iterable and do not have indexed
  // properties. To iterate over them, use `for (let i = 0; i < nodeListImpl.length; ++i) { nodeListImpl.item(i) }`.
  querySelectorAll(selectors) {
    if (shouldAlwaysSelectNothing(this)) {
      return NodeList.createImpl(this._globalObject, [], { nodes: [] });
    }

    const cache = this._ownerDocument._selectorCache;
    const key = `:queryAll(${selectors})`;
    if (cache.has(this, key)) {
      const nodes = cache.get(this, key);
      return NodeList.createImpl(this._globalObject, [], { nodes });
    }

    selectors = parseGrammar(selectors, "<selector-list>");
    if (!selectors || selectors instanceof SyntaxError) {
      throw DOMException.create(this._globalObject, [
        "Invalid selectors",
        "SyntaxError"
      ]);
    }

    const context = { scopes: { roots: [this] } };
    const root = this.getRootNode({});
    const nodes = matchTreesAgainstSelectors([root], selectors, context);
    cache.set(this, key, nodes);

    return NodeList.createImpl(this._globalObject, [], { nodes });
  }
}

function shouldAlwaysSelectNothing(elImpl) {
  // This is true during initialization.
  return elImpl === elImpl._ownerDocument && !elImpl.documentElement;
}

module.exports = {
  implementation: ParentNodeImpl
};
