"use strict";

const HTMLCollection = require("../generated/HTMLCollection");
const { domSymbolTree } = require("../helpers/internal-constants");
const NODE_TYPE = require("../node-type");
const { convertNodesIntoNode } = require("../node");

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
    this._preInsertValidity(node, null);
    this._replaceAll(node);
  }
}

module.exports = {
  implementation: ParentNodeImpl
};
