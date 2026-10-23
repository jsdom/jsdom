"use strict";

const idlUtils = require("../../../generated/idl/utils.js");
// https://drafts.csswg.org/cssom-1/#cssrulelist
class CSSRuleListImpl {
  constructor(globalObject, args, { rules }) {
    this._globalObject = globalObject;
    this._rules = rules;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._rules.keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this._rules.length;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrulelist-length
  get length() {
    return this._rules.length;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrulelist-item
  item(index) {
    return this._rules[index] ?? null;
  }
}
exports.implementation = CSSRuleListImpl;
