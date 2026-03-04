"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl.js").implementation;
const { CSSStyleDeclaration } = require("./CSSStyleDeclaration.js");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");

class CSSStyleRuleImpl extends CSSGroupingRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._selectorText = privateData.selectorText || "";
    this._style = new CSSStyleDeclaration(globalObject, [], {
      context: wrapperForImpl(this)
    });
  }

  get type() {
    return 1; // STYLE_RULE
  }

  get selectorText() {
    return this._selectorText;
  }

  set selectorText(value) {
    this._selectorText = value;
  }

  get style() {
    return this._style;
  }

  // TODO: delete this setter when CSSStyleDeclaration is converted to webidl2js
  // (then [PutForwards=cssText] on the WebIDL attribute will handle it)
  set style(value) {
    this._style.cssText = value;
  }

  get cssText() {
    const styleText = this._style.cssText;
    const rules = this._cssRules._list;

    if (rules.length === 0 && !styleText) {
      return `${this._selectorText} { }`;
    }

    if (rules.length === 0) {
      return `${this._selectorText} { ${styleText} }`;
    }

    // Has nested rules: use multi-line format
    let body = "";
    if (styleText) {
      body += `\n  ${styleText}`;
    }
    for (const rule of rules) {
      const ruleText = wrapperForImpl(rule).cssText;
      // Skip empty CSSNestedDeclarations per CSSOM serialization spec
      if (ruleText) {
        body += `\n  ${ruleText}`;
      }
    }
    return `${this._selectorText} {${body}\n}`;
  }
}

module.exports = {
  implementation: CSSStyleRuleImpl
};
