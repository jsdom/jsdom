"use strict";

const NODE_TYPE = require("../node-type");

class NonDocumentTypeChildNodeImpl {
  get nextElementSibling() {
    for (let sibling = this.nextSibling; sibling !== null; sibling = sibling.nextSibling) {
      if (sibling.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return sibling;
      }
    }
    return null;
  }

  get previousElementSibling() {
    for (let sibling = this.previousSibling; sibling !== null; sibling = sibling.previousSibling) {
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
