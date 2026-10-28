"use strict";

const CSSFunctionDescriptors = require("../../../generated/idl/CSSFunctionDescriptors.js");
const CSSRule = require("./CSSRule-impl.js");
// https://drafts.csswg.org/css-mixins-1/#cssfunctiondeclarations
class CSSFunctionDeclarationsImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this.style = CSSFunctionDescriptors.createImpl(globalObject, undefined, {
      declarations: privateData.declarations,
      parentRule: this,
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return this.style.cssText;
  }
}
exports.implementation = CSSFunctionDeclarationsImpl;
