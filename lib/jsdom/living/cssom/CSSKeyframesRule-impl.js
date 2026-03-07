"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const CSSRuleList = require("../../../generated/idl/CSSRuleList.js");
const { normalizeKeyText } = require("./CSSKeyframeRule-impl.js");
const cssParser = require("../helpers/css-parser.js");
const idlUtils = require("../../../generated/idl/utils.js");

class CSSKeyframesRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this.name = privateData.name;
    this.cssRules = CSSRuleList.createImpl(globalObject);
  }

  get type() {
    return 7; // KEYFRAMES_RULE
  }

  get length() {
    return this.cssRules._list.length;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this.cssRules._list.keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this.cssRules._list.length;
  }

  [idlUtils.indexedGet](index) {
    return this.cssRules._list[index] || null;
  }

  appendRule(rule) {
    const newRule = cssParser.parseKeyframeRule(rule, this._globalObject);
    newRule.parentRule = this;
    newRule.parentStyleSheet = this.parentStyleSheet;
    this.cssRules._list.push(newRule);
  }

  deleteRule(select) {
    const normalized = normalizeKeyText(select);
    const index = this.cssRules._list.findIndex(
      r => r.keyText === normalized
    );
    if (index !== -1) {
      this.cssRules._list.splice(index, 1);
    }
  }

  findRule(select) {
    const normalized = normalizeKeyText(select);
    // Per spec, return the last matching rule
    for (let i = this.cssRules._list.length - 1; i >= 0; i--) {
      if (this.cssRules._list[i].keyText === normalized) {
        return this.cssRules._list[i];
      }
    }
    return null;
  }

  get cssText() {
    const rules = this.cssRules._list.map(r => r.cssText).join(" ");
    let { name } = this;
    // CSS-wide keywords and "none" must be quoted per CSSOM spec
    const lower = name.toLowerCase();
    if (lower === "initial" || lower === "inherit" || lower === "unset" ||
        lower === "revert" || lower === "revert-layer" || lower === "default" || lower === "none") {
      name = `"${name}"`;
    }
    return `@keyframes ${name} { ${rules} }`;
  }
}

exports.implementation = CSSKeyframesRuleImpl;
