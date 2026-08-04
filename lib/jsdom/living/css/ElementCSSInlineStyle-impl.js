"use strict";
const { CSSStyleProperties } = require("@cdoublev/css");

class ElementCSSInlineStyle {
  _initElementCSSInlineStyle() {
    this._style = CSSStyleProperties.create(this._globalObject, [], {
      ownerNode: this
    });
  }
  get style() {
    return this._style;
  }
}

module.exports = {
  implementation: ElementCSSInlineStyle
};
