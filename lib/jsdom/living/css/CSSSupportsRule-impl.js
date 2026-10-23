"use strict";

const CSSConditionRule = require("./CSSConditionRule-impl.js");
const supports = require("./match/support.js");
// https://drafts.csswg.org/css-conditional-3/#csssupportsrule
class CSSSupportsRuleImpl extends CSSConditionRule.implementation {
  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return this._serializeBlock(`@supports ${this.conditionText}`);
  }

  // https://drafts.csswg.org/css-conditional-3/#dom-csssupportsrule-matches
  get matches() {
    return supports(this._condition, this._globalObject);
  }
}
exports.implementation = CSSSupportsRuleImpl;
