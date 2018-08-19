"use strict";

const idlUtils = require("../generated/utils");
const NodeList = require("../generated/NodeList");
const HTMLCollection = require("../generated/HTMLCollection");
const { addNwsapi } = require("../helpers/selectors");
const { domSymbolTree } = require("../helpers/internal-constants");
const NODE_TYPE = require("../node-type");
const { convertNodesIntoNode } = require("../node");

class ParentNodeImpl {
  get children() {
    if (!this._childrenList) {
      this._childrenList = HTMLCollection.createImpl([], {
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
    this.insertBefore(convertNodesIntoNode(this._ownerDocument, nodes), this.firstChild);
  }

  append(...nodes) {
    this.appendChild(convertNodesIntoNode(this._ownerDocument, nodes));
  }

  querySelector(selectors) {
    if (shouldAlwaysSelectNothing(this)) {
      return null;
    }
    const matcher = addNwsapi(this);
    return idlUtils.implForWrapper(matcher.first(selectors, idlUtils.wrapperForImpl(this)));
  }

  // Warning for internal users: this returns a NodeList containing IDL wrappers instead of impls
  querySelectorAll(selectors) {
    if (shouldAlwaysSelectNothing(this)) {
      return NodeList.create([], { nodes: [] });
    }
    const matcher = addNwsapi(this);
    const list = matcher.select(selectors, idlUtils.wrapperForImpl(this));

    return NodeList.create([], { nodes: list.map(n => idlUtils.tryImplForWrapper(n)) });
  }
}

function shouldAlwaysSelectNothing(elImpl) {
  // This is true during initialization.
  return elImpl === elImpl._ownerDocument && !elImpl.documentElement;
}

module.exports = {
  implementation: ParentNodeImpl
};
