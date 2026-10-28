"use strict";

const CSSConditionRule = require("./CSSConditionRule-impl.js");
const serialize = require("./serialize.js");
// https://drafts.csswg.org/css-conditional-5/#csscontainerrule
class CSSContainerRuleImpl extends CSSConditionRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const conditions = privateData.prelude.map(([name, query]) =>
      Object.freeze({
        name: serialize.serializeComponentValue(name),
        query: serialize.serializeComponentValue(query),
      }),
    );
    this.conditions = Object.freeze(conditions);
    if (this.conditions.length === 1) {
      const [{ name, query }] = conditions;
      this.containerName = name;
      this.containerQuery = query;
    } else {
      this.containerName = "";
      this.containerQuery = "";
    }
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return this._serializeBlock(`@container ${this.conditionText}`);
  }
}
exports.implementation = CSSContainerRuleImpl;
