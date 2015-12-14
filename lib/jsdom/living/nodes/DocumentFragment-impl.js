"use strict";

const NodeImpl = require("./Node-impl").implementation;

const NODE_TYPE = require("../node-type");

class DocumentFragmentImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.nodeType = NODE_TYPE.DOCUMENT_FRAGMENT_NODE;
  }
}

module.exports = {
  implementation: DocumentFragmentImpl
};
