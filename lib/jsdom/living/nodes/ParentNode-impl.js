"use strict";

const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../node-type");

const createHTMLCollection = require("../html-collection").create;
const updateHTMLCollection = require("../html-collection").update;

class ParentNodeImpl {
  get children() {
    if (!this._childrenList) {
      this._childrenList = createHTMLCollection(this, () => {
        return domSymbolTree.childrenToArray(this, { filter(node) {
          return node.nodeType === NODE_TYPE.ELEMENT_NODE;
        } });
      });
    } else {
      updateHTMLCollection(this._childrenList);
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

  get childElementCountfunction () {
    return this.children.length;
  }
}

module.exports = {
  implementation: ParentNodeImpl
};
