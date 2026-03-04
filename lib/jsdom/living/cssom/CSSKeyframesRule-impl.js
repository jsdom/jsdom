"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const CSSRuleList = require("../../../generated/idl/CSSRuleList.js");
const { parseKeyframeRule } = require("../helpers/css-parser.js");
const idlUtils = require("../../../generated/idl/utils.js");
const { wrapperForImpl } = idlUtils;

class CSSKeyframesRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._name = privateData.name || "";
    this._cssRules = CSSRuleList.createImpl(globalObject);
  }

  get type() {
    return 7; // KEYFRAMES_RULE
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get cssRules() {
    return this._cssRules;
  }

  get length() {
    return this._cssRules._list.length;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._cssRules._list.keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this._cssRules._list.length;
  }

  [idlUtils.indexedGet](index) {
    return this._cssRules._list[index] || null;
  }

  appendRule(rule) {
    const newRule = parseKeyframeRule(rule, this._globalObject);
    newRule._parentRule = wrapperForImpl(this);
    newRule._parentStyleSheet = this._parentStyleSheet;
    this._cssRules._list.push(newRule);
  }

  deleteRule(select) {
    const normalized = select.trim();
    const index = this._cssRules._list.findIndex(
      r => r._keyText === normalized
    );
    if (index !== -1) {
      this._cssRules._list.splice(index, 1);
    }
  }

  findRule(select) {
    const normalized = select.trim();
    // Per spec, return the last matching rule
    for (let i = this._cssRules._list.length - 1; i >= 0; i--) {
      if (this._cssRules._list[i]._keyText === normalized) {
        return this._cssRules._list[i];
      }
    }
    return null;
  }

  get cssText() {
    const rules = this._cssRules._list.map(r => wrapperForImpl(r).cssText).join(" ");
    let { _name: name } = this;
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
