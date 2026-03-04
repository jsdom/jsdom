"use strict";

const idlUtils = require("../../../generated/idl/utils.js");

class CSSRuleListImpl {
  constructor(globalObject) {
    this._globalObject = globalObject;
    this._list = [];
  }

  get length() {
    return this._list.length;
  }

  item(index) {
    return this._list[index] || null;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._list.keys();
  }
}

exports.implementation = CSSRuleListImpl;
