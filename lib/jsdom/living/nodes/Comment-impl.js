"use strict";

const NodeImpl = require("./Node-impl").implementation;

const NODE_TYPE = require("../node-type");

class CommentImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.nodeType = NODE_TYPE.COMMENT_NODE;
  }
}

module.exports = {
  implementation: CommentImpl
};
