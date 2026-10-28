"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const CSSGroupingRule = require("./CSSGroupingRule-impl.js");
const CSSPageDescriptors = require("../../../generated/idl/CSSPageDescriptors.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const serialize = require("./serialize.js");
// https://drafts.csswg.org/cssom-1/#csspagerule
class CSSPageRuleImpl extends CSSGroupingRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { prelude } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents.filter(Array.isArray).flat();
    const rules = contents.filter((rule) => !Array.isArray(rule));
    this._selectors = prelude;
    this.style = CSSPageDescriptors.createImpl(globalObject, undefined, {
      declarations,
      parentRule: this,
    });
    this._rules = rules;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      _rules,
      selectorText,
      style: { cssText: declarations },
    } = this;
    let value = _rules.map((rule) => rule.cssText);
    if (declarations) {
      value.unshift(declarations);
    }
    value = value.join(" ");
    if (selectorText) {
      if (value) {
        return `@page ${selectorText} { ${value} }`;
      }
      return `@page ${selectorText} { }`;
    }
    if (value) {
      return `@page { ${value} }`;
    }
    return "@page { }";
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssgroupingrule-selectortext
  get selectorText() {
    return serialize.serializeComponentValue(this._selectors);
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssgroupingrule-selectortext
  set selectorText(selector) {
    selector = parser.parseGrammar(selector, "<page-selector-list>?", this);
    if (!values.isFailure(selector)) {
      this._selectors = selector;
    }
  }
}
exports.implementation = CSSPageRuleImpl;
