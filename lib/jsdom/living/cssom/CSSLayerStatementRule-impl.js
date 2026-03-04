"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;

class CSSLayerStatementRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._nameList = Object.freeze(privateData.nameList || []);
  }

  get type() {
    return 17; // LAYER_STATEMENT_RULE
  }

  get nameList() {
    return this._nameList;
  }

  get cssText() {
    return `@layer ${this._nameList.join(", ")};`;
  }
}

exports.implementation = CSSLayerStatementRuleImpl;
