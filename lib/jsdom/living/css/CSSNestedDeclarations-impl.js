"use strict";

const CSSRule = require("./CSSRule-impl.js");
const CSSStyleProperties = require("../../../generated/idl/CSSStyleProperties.js");
// https://drafts.csswg.org/css-nesting-1/#cssnesteddeclarations
class CSSNestedDeclarationsImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this.style = CSSStyleProperties.createImpl(globalObject, undefined, {
      declarations: privateData.declarations,
      parentRule: this
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return this.style.cssText;
  }
}
exports.implementation = CSSNestedDeclarationsImpl;
