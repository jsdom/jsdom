"use strict";

const DOMException = require("domexception");

const NODE_TYPE = require("../node-type");

const AbstractRangeImpl = require("./AbstractRange-impl").implementation;

// https://dom.spec.whatwg.org/#staticrange
class StaticRangeImpl extends AbstractRangeImpl {
  // https://dom.spec.whatwg.org/#dom-staticrange-staticrange
  constructor(args) {
    const { startContainer, startOffset, endContainer, endOffset } = args[0];

    if (
      startContainer.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE ||
      startContainer.nodeType === NODE_TYPE.ATTRIBUTE_NODE ||
      endContainer.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE ||
      endContainer.nodeType === NODE_TYPE.ATTRIBUTE_NODE
    ) {
      throw new DOMException("The supplied node is incorrect.", "InvalidNodeTypeError");
    }

    super([], {
      start: {
        node: startContainer,
        offset: startOffset
      },
      end: {
        node: endContainer,
        offset: endOffset
      }
    });
  }
}

module.exports = {
  implementation: StaticRangeImpl
};
