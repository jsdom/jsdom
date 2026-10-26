"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const CSSGroupingRule = require("./CSSGroupingRule-impl.js");
const ruleUtils = require("./utils/cssom.js");
const serialize = require("./serialize.js");
// https://drafts.csswg.org/css-conditional-3/#cssconditionrule
class CSSConditionRuleImpl extends CSSGroupingRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const {
      definition,
      prelude
    } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const rules = contents.map(rule => {
      if (Array.isArray(rule)) {
        return ruleUtils.createDeclarationBlockRule(definition.value.rules[0].cssom, rule, this);
      }
      return rule;
    });
    this._condition = prelude;
    this._rules = rules;
  }

  // https://drafts.csswg.org/css-conditional-3/#dom-cssconditionrule-conditiontext
  get conditionText() {
    return serialize.serializeComponentValue(this._condition);
  }
}
exports.implementation = CSSConditionRuleImpl;
