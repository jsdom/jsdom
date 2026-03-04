"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl.js").implementation;
const { serializeGroupingRuleBody } = require("./CSSGroupingRule-impl.js");

class CSSLayerBlockRuleImpl extends CSSGroupingRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._name = privateData.name || "";
  }

  get type() {
    return 16; // LAYER_BLOCK_RULE
  }

  get name() {
    return this._name;
  }

  get cssText() {
    const name = this._name ? ` ${this._name}` : "";
    return `@layer${name} ${serializeGroupingRuleBody(this._cssRules._list)}`;
  }
}

exports.implementation = CSSLayerBlockRuleImpl;
