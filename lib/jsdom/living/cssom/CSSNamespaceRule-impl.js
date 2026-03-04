"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;

class CSSNamespaceRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._namespaceURI = privateData.namespaceURI || "";
    this._prefix = privateData.prefix || "";
  }

  get type() {
    return 10; // NAMESPACE_RULE
  }

  get namespaceURI() {
    return this._namespaceURI;
  }

  get prefix() {
    return this._prefix;
  }

  get cssText() {
    if (this._prefix) {
      return `@namespace ${this._prefix} url("${this._namespaceURI}");`;
    }
    return `@namespace url("${this._namespaceURI}");`;
  }
}

exports.implementation = CSSNamespaceRuleImpl;
