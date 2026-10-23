"use strict";

const serialize = require("./serialize.js");
const CSSRule = require("./CSSRule-impl.js");
const values = require("./values/value.js");
// https://drafts.csswg.org/cssom-1/#cssnamespacerule
class CSSNamespaceRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const {
      prelude: [prefix, location]
    } = privateData;
    this.namespaceURI = values.isFunction(location) ? location.value[0].value : location.value;
    this.prefix = values.isOmitted(prefix) ? "" : prefix.value;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      namespaceURI,
      prefix
    } = this;
    const url = serialize.serializeURLFromPrimitive(namespaceURI);
    return prefix ? `@namespace ${serialize.serializeIdentifierFromPrimitive(prefix)} ${url};` : `@namespace ${url};`;
  }
}
exports.implementation = CSSNamespaceRuleImpl;
