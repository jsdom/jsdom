"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const CSSGroupingRule = require("./CSSGroupingRule-impl.js");
const ruleUtils = require("./utils/cssom.js");
const serialize = require("./serialize.js");
const values = require("./values/value.js");
// https://drafts.csswg.org/css-cascade-5/#csslayerblockrule
class CSSLayerBlockRuleImpl extends CSSGroupingRule.implementation {
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
    this._name = values.isOmitted(prelude) ? null : prelude;
    this.name = serialize.serializeComponentValue(prelude);
    this._rules = rules;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return this._serializeBlock(this.name ? `@layer ${this.name}` : "@layer");
  }
}
exports.implementation = CSSLayerBlockRuleImpl;
