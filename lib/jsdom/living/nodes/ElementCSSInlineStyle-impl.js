"use strict";
const { CSSStyleDeclaration } = require("cssstyle");

class ElementCSSInlineStyle {
  _initElementCSSInlineStyle() {
    this._settingCssText = false;

    if (this._ownerDocument._defaultView._disableCSS) {
      this._style = new CSSStyleDeclaration();
    } else {
      this._style = new CSSStyleDeclaration(newCssText => {
        if (!this._settingCssText) {
          this._settingCssText = true;
          this.setAttributeNS(null, "style", newCssText);
          this._settingCssText = false;
        }
      });
    }
  }
  get style() {
    return this._style;
  }
}

module.exports = {
  implementation: ElementCSSInlineStyle
};
