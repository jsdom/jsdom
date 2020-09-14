"use strict";
const cssstyle = require("cssstyle");

class ElementCSSInlineStyle {
  _onInlineStyleChange(newStyle) {
    // empty. overwrite in Window.js
  }
  _initElementCSSInlineStyle() {
    this._settingCssText = false;
    this._style = new cssstyle.CSSStyleDeclaration(newCssText => {
      if (!this._settingCssText) {
        this._settingCssText = true;
        this.setAttributeNS(null, "style", newCssText);
        this._settingCssText = false;
      }
      // TODO remove
      // computedStyle sould have constant length
      if (this._globalObject._computedStyle[this]) {
        this._globalObject._computedStyle[this]._update();
      }
    });
  }
  get style() {
    return this._style;
  }
  set style(value) {
    this._style.cssText = value;
  }
}

module.exports = {
  implementation: ElementCSSInlineStyle
};
