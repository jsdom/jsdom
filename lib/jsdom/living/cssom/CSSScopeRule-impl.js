"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl.js").implementation;
const { serializeGroupingRuleBody } = require("./CSSGroupingRule-impl.js");

class CSSScopeRuleImpl extends CSSGroupingRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._start = privateData.start || null;
    this._end = privateData.end || null;
  }

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  get cssText() {
    let prelude = "";
    if (this._start) {
      prelude += ` (${this._start})`;
    }
    if (this._end) {
      prelude += ` to (${this._end})`;
    }
    return `@scope${prelude} ${serializeGroupingRuleBody(this._cssRules._list)}`;
  }
}

module.exports = {
  implementation: CSSScopeRuleImpl
};
