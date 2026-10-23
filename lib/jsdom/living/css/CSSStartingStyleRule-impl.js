"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const CSSGroupingRule = require("./CSSGroupingRule-impl.js");
const ruleUtils = require("./utils/cssom.js");
// https://drafts.csswg.org/css-transitions-2/#cssstartingstylerule
class CSSStartingStyleRuleImpl extends CSSGroupingRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { definition } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const rules = contents.map(rule => {
      if (Array.isArray(rule)) {
        return ruleUtils.createDeclarationBlockRule(definition.value.rules[0].cssom, rule, this);
      }
      return rule;
    });
    this._rules = rules;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return this._serializeBlock("@starting-style");
  }
}
exports.implementation = CSSStartingStyleRuleImpl;
