"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const CSSMarginDescriptors = require("../../../generated/idl/CSSMarginDescriptors.js");
const CSSRule = require("./CSSRule-impl.js");
// https://drafts.csswg.org/cssom-1/#cssmarginrule
class CSSMarginRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { name } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    this.name = name;
    this.style = CSSMarginDescriptors.createImpl(globalObject, undefined, {
      declarations,
      parentRule: this,
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      name,
      style: { cssText },
    } = this;
    return cssText ? `@${name} { ${cssText} }` : `@${name} { }`;
  }
}
exports.implementation = CSSMarginRuleImpl;
