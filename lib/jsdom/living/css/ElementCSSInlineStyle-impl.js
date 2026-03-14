"use strict";
const { CSSStyleDeclaration } = require("./CSSStyleDeclaration");

class ElementCSSInlineStyle {
  _initElementCSSInlineStyle() {
    this._settingCssText = false;
    this._style = new CSSStyleDeclaration(this._globalObject, [], {
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
