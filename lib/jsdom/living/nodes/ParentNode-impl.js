"use strict";

const NodeList = require("../../../generated/idl/NodeList");
const HTMLCollection = require("../../../generated/idl/HTMLCollection");
const NODE_TYPE = require("../node-type");
const { convertNodesIntoNode } = require("../node");
const selectorHelpers = require("../css/helpers/selectors.js");

class ParentNodeImpl {
  get children() {
    if (!this._childrenList) {
      this._childrenList = HTMLCollection.createImpl(this._globalObject, [], {
        element: this,
        query: () => this._childrenToArray(node => node.nodeType === NODE_TYPE.ELEMENT_NODE)
      });
    } else {
      this._childrenList._update();
    }
    return this._childrenList;
  }

  get firstElementChild() {
    for (let child = this.firstChild; child !== null; child = child.nextSibling) {
      if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return child;
      }
    }

    return null;
  }

  get lastElementChild() {
    for (let child = this.lastChild; child !== null; child = child.previousSibling) {
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
    this._preInsertValidity(node, null, new Set(this._children()));
    this._replaceAll(node);
  }

  querySelector(selectors) {
    return selectorHelpers.query(this, selectors, true);
  }

  querySelectorAll(selectors) {
    const nodes = selectorHelpers.query(this, selectors, false);
    return NodeList.createImpl(this._globalObject, [], { nodes });
  }
}

module.exports = {
  implementation: ParentNodeImpl
};
