"use strict";
const CSSStyleProperties = require("../../../generated/idl/CSSStyleProperties.js");

class ElementCSSInlineStyle {
  get style() {
    this._style ??= CSSStyleProperties.createImpl(this._globalObject, [], {
      ownerNode: this,
    });
    return this._style;
  }
}

module.exports = {
  implementation: ElementCSSInlineStyle,
};
