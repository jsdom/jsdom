"use strict";

const CSSRule = require("./CSSRule-impl.js");
const serialize = require("./serialize.js");
// https://drafts.csswg.org/css-cascade-5/#csslayerstatementrule
class CSSLayerStatementRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._names = privateData.prelude;
    this.nameList = Object.freeze(privateData.prelude.map(serialize.serializeComponentValue));
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return `@layer ${this.nameList.join(", ")};`;
  }
}
exports.implementation = CSSLayerStatementRuleImpl;
