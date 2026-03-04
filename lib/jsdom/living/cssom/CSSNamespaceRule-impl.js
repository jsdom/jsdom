"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;

class CSSNamespaceRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this.namespaceURI = privateData.namespaceURI;
    this.prefix = privateData.prefix;
  }

  get type() {
    return 10; // NAMESPACE_RULE
  }

  get cssText() {
    if (this.prefix) {
      return `@namespace ${this.prefix} url("${this.namespaceURI}");`;
    }
    return `@namespace url("${this.namespaceURI}");`;
  }
}

exports.implementation = CSSNamespaceRuleImpl;
