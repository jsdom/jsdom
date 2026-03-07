"use strict";

const CSSConditionRuleImpl = require("./CSSConditionRule-impl.js").implementation;
const { serializeGroupingRuleBody } = require("./CSSGroupingRule-impl.js");

class CSSSupportsRuleImpl extends CSSConditionRuleImpl {
  get type() {
    return 12; // SUPPORTS_RULE
  }

  get cssText() {
    return `@supports ${this._conditionText} ${serializeGroupingRuleBody(this.cssRules._list)}`;
  }
}

exports.implementation = CSSSupportsRuleImpl;
