"use strict";

// https://dom.spec.whatwg.org/#mutationrecord
class MutationRecordImpl {
  constructor(args, privateData) {
    this.type = privateData.type;
    this.target = privateData.target;
    this.addedNodes = privateData.addedNodes;
    this.removedNodes = privateData.removedNodes;
    this.previousSibling = privateData.previousSibling;
    this.nextSibling = privateData.nextSibling;
    this.attributeName = privateData.attributeName;
    this.attributeNamespace = privateData.attributeNamespace;
    this.oldValue = privateData.oldValue;
  }
}

module.exports = {
  implementation: MutationRecordImpl
};
