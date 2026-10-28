"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const idlUtils = require("../../../generated/idl/utils.js");
const ruleUtils = require("./utils/cssom.js");
const serialize = require("./serialize.js");
const CSSRule = require("./CSSRule-impl.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const { invalidateStyle } = require("./utils/style.js");
// https://drafts.csswg.org/css-animations-1/#csskeyframesrule
class CSSKeyframesRuleImpl extends CSSRule.implementation {
  get cssRules() {
    return ruleUtils.getRuleList(this);
  }

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { prelude } = privateData;
    const rules = createRuleContents(privateData.block, this);
    this._name = prelude.value;
    this._rules = rules;
  }

  [idlUtils.indexedGet](index) {
    return this._rules[index];
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._rules.keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this._rules.length;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const token = parser.parseGrammar(
      serialize.serializeIdentifierFromPrimitive(this.name),
      "<keyframes-name>",
      this,
    );
    const name = values.isFailure(token)
      ? serialize.serializeStringFromPrimitive(this.name)
      : serialize.serializeComponentValue(token);
    const rules = this._rules.map((rule) => rule.cssText).join("\n");
    return `@keyframes ${name} {\n${rules ? `${rules}\n` : ""}}`;
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframesrule-length
  get length() {
    return this._rules.length;
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframesrule-name
  get name() {
    return this._name;
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframesrule-name
  set name(name) {
    // Setter validation is unspecified; browsers accept the string directly.
    // https://github.com/w3c/csswg-drafts/issues/9364
    this._name = name;
    invalidateStyle(this._globalObject, this.parentStyleSheet);
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframesrule-appendrule
  appendRule(rule) {
    // Invalid input leaves the rule list unchanged.
    // https://github.com/w3c/csswg-drafts/issues/6972
    const parsed = parser.parseRule(rule, this);
    if (!values.isFailure(parsed)) {
      this._rules.push(parsed);
      invalidateStyle(this._globalObject, this.parentStyleSheet);
    }
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframesrule-deleterule
  deleteRule(selector) {
    selector = parser.parseGrammar(selector, "<keyframe-selector>#", this);
    if (!values.isFailure(selector)) {
      selector = serialize.serializeComponentValues(selector);
      const index = this._rules.findLastIndex((rule) => rule.keyText === selector);
      if (index > -1) {
        ruleUtils.removeRule(this, index);
      }
    }
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframesrule-findrule
  findRule(selector) {
    selector = parser.parseGrammar(selector, "<keyframe-selector>#", this);
    if (!values.isFailure(selector)) {
      selector = serialize.serializeComponentValues(selector);
      return this._rules.findLast((rule) => rule.keyText === selector) ?? null;
    }
    return null;
  }
}
exports.implementation = CSSKeyframesRuleImpl;
