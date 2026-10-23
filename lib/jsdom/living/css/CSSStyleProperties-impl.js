"use strict";

const CSSStyleDeclaration = require("./CSSStyleDeclaration-impl.js");
// https://drafts.csswg.org/cssom-1/#cssstyleproperties
class CSSStylePropertiesImpl extends CSSStyleDeclaration.implementation {
  // https://drafts.csswg.org/cssom-1/#dom-cssstyleproperties-cssfloat
  get cssFloat() {
    return this.getPropertyValue("float");
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyleproperties-cssfloat
  set cssFloat(value) {
    this.setProperty("float", value);
  }
}
exports.implementation = CSSStylePropertiesImpl;
