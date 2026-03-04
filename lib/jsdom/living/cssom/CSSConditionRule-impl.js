"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl.js").implementation;

class CSSConditionRuleImpl extends CSSGroupingRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._conditionText = privateData.conditionText || "";
  }

  get conditionText() {
    return this._conditionText;
  }
}

exports.implementation = CSSConditionRuleImpl;
