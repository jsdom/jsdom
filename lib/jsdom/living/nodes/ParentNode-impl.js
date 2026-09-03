"use strict";

const NodeList = require("../../../generated/idl/NodeList");
const HTMLCollection = require("../../../generated/idl/HTMLCollection");
const { domSymbolTree } = require("../helpers/internal-constants");
const NODE_TYPE = require("../node-type");
const { convertNodesIntoNode } = require("../node");

// The ID cache omits empty IDs. Keep the fast path to simple string contents; everything else falls through to
// DOMSelector.
const exactIdAttributeSelectorRegExp = /^\[id="([^"\\\u0000-\u001F\u007F\uD800-\uDFFF]+)"\]$/u;

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

    const id = getExactIdFromSelector(selectors);
    if (id !== null && this._isInDocumentTree) {
      const candidate = this._ownerDocument.getElementById(id);
      if (candidate === null) {
        return null;
      }
      if (candidate !== this && this.contains(candidate)) {
        return candidate;
      }
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
    const domSelector = this._ownerDocument._getDOMSelector();
    const nodes = domSelector.querySelectorAll(selectors, this);
    return NodeList.createImpl(this._globalObject, [], { nodes });
  }
}

function getExactIdFromSelector(selectors) {
  if (!selectors.startsWith("[id=")) {
    return null;
  }

  const match = exactIdAttributeSelectorRegExp.exec(selectors);
  return match === null ? null : match[1];
}

function shouldAlwaysSelectNothing(elImpl) {
  // This is true during initialization.
  return elImpl === elImpl._ownerDocument && !elImpl.documentElement;
}

module.exports = {
  implementation: ParentNodeImpl
};
