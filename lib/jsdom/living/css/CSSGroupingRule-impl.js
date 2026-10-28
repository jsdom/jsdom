"use strict";

const ruleUtils = require("./utils/cssom.js");
const CSSRule = require("./CSSRule-impl.js");
// https://drafts.csswg.org/cssom-1/#cssgroupingrule
class CSSGroupingRuleImpl extends CSSRule.implementation {
  get cssRules() {
    return ruleUtils.getRuleList(this);
  }

  _serializeBlock(prelude, declarations = "") {
    const contents = this._rules.map((rule) => rule.cssText).filter((text) => text !== "");
    if (declarations) {
      contents.unshift(declarations);
    }
    const lines = contents.map((text) => `  ${text}`);
    return `${prelude} {\n${lines.length ? `${lines.join("\n")}\n` : ""}}`;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssgroupingrule-deleterule
  deleteRule(index) {
    ruleUtils.removeRule(this, index);
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssgroupingrule-insertrule
  insertRule(rule, index) {
    return ruleUtils.insertRule(this, rule, index);
  }
}
exports.implementation = CSSGroupingRuleImpl;
