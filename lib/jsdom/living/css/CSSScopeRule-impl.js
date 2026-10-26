"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const values = require("./values/value.js");
const CSSGroupingRule = require("./CSSGroupingRule-impl.js");
const ruleUtils = require("./utils/cssom.js");
const { serializeSelector } = require("./utils/serialize-selectors.js");
// https://drafts.csswg.org/css-cascade-6/#cssscoperule
class CSSScopeRuleImpl extends CSSGroupingRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const {
      definition,
      prelude
    } = privateData;
    const [start, end] = values.isOmitted(prelude) ? [values.omitted, values.omitted] : prelude;
    const contents = createRuleContents(privateData.block, this);
    const rules = contents.map(rule => {
      if (Array.isArray(rule)) {
        return ruleUtils.createDeclarationBlockRule(definition.value.rules[0].cssom, rule, this);
      }
      return rule;
    });
    this._rules = rules;
    this._start = start;
    this._end = end;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    let prelude = "@scope";
    if (this.start) {
      prelude += ` (${this.start})`;
    }
    if (this.end) {
      prelude += ` to (${this.end})`;
    }
    return this._serializeBlock(prelude);
  }

  // https://drafts.csswg.org/css-cascade-6/#dom-cssscoperule-end
  get end() {
    return values.isOmitted(this._end) ? null : serializeSelector(this._end[1].value, this.parentStyleSheet);
  }

  // https://drafts.csswg.org/css-cascade-6/#dom-cssscoperule-start
  get start() {
    return values.isOmitted(this._start) ? null : serializeSelector(this._start.value, this.parentStyleSheet);
  }
}
exports.implementation = CSSScopeRuleImpl;
