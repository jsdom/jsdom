"use strict";

const CharacterDataImpl = require("./CharacterData-impl").implementation;

const NODE_TYPE = require("../node-type");

class ProcessingInstructionImpl extends CharacterDataImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.nodeType = NODE_TYPE.PROCESSING_INSTRUCTION_NODE;
    this.target = privateData.target;
  }
}

module.exports = {
  implementation: ProcessingInstructionImpl
};
