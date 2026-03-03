"use strict";
const { CSSStyleDeclaration } = require("../cssom/style-declaration/CSSStyleDeclaration");

class ElementCSSInlineStyle {
  _initElementCSSInlineStyle() {
    this._settingCssText = false;
    this._style = new CSSStyleDeclaration(this._globalObject, undefined, {
      context: this,
      onChangeCallback: newCssText => {
        if (!this._settingCssText) {
          this._settingCssText = true;
          this.setAttributeNS(null, "style", newCssText);
          this._settingCssText = false;
        }
      }
    });
  }
  get style() {
    return this._style;
  }
}

module.exports = {
  implementation: ElementCSSInlineStyle
};
