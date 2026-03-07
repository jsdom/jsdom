"use strict";

const CSSConditionRuleImpl = require("./CSSConditionRule-impl.js").implementation;
const { serializeGroupingRuleBody } = require("./CSSGroupingRule-impl.js");

class CSSContainerRuleImpl extends CSSConditionRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this.containerName = privateData.containerName;
    this.containerQuery = privateData.containerQuery;
  }

  get conditionText() {
    if (this.containerName) {
      return this.containerName + " " + this.containerQuery;
    }
    return this.containerQuery;
  }

  get type() {
    return 0; // No standard type constant for container rules
  }

  get cssText() {
    return `@container ${this.conditionText} ${serializeGroupingRuleBody(this.cssRules._list)}`;
  }
}

exports.implementation = CSSContainerRuleImpl;
