"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const CSSFontFaceDescriptors = require("../../../generated/idl/CSSFontFaceDescriptors.js");
const CSSRule = require("./CSSRule-impl.js");
// https://drafts.csswg.org/css-fonts-4/#cssfontfacerule
class CSSFontFaceRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    this.style = CSSFontFaceDescriptors.createImpl(globalObject, undefined, {
      declarations,
      parentRule: this,
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      style: { cssText },
    } = this;
    return cssText ? `@font-face { ${cssText} }` : "@font-face { }";
  }
}
exports.implementation = CSSFontFaceRuleImpl;
