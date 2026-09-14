"use strict";

const treeHelpers = require("../helpers/dom-tree");
const NODE_TYPE = require("../node-type");

class NonDocumentTypeChildNodeImpl {
  get nextElementSibling() {
    for (const sibling of treeHelpers.nextSiblingsIterator(this)) {
      if (sibling.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return sibling;
      }
    }
    return null;
  }

  get previousElementSibling() {
    for (const sibling of treeHelpers.previousSiblingsIterator(this)) {
      if (sibling.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return sibling;
      }
    }
    return null;
  }
}

module.exports = {
  implementation: NonDocumentTypeChildNodeImpl
};
