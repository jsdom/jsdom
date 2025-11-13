"use strict";

const CSSStyleProperties = require("../generated/CSSStyleProperties");
const idlUtils = require("../generated/utils");

class ElementCSSInlineStyle {
  _initElementCSSInlineStyle() {
    this._settingCssText = false;
    this._style = CSSStyleProperties.createImpl(this._globalObject, [], {
      options: {
        context: idlUtils.wrapperForImpl(this),
        onChange: this._styleChangeCallback.bind(this)
      }
    });
  }
  _styleChangeCallback(newCssText) {
    if (!this._settingCssText) {
      this._settingCssText = true;
      this._style._list = [];
      for (let i = 0; i < this._style.length; i++) {
        this._style._list[i] = this._style.item(i);
      }
      this.setAttributeNS(null, "style", newCssText);
      this._settingCssText = false;
    }
  }
  get style() {
    return idlUtils.wrapperForImpl(this._style);
  }
  set style(value) {
    if (typeof value === "string") {
      this._style.cssText = value;
    }
  }
}

module.exports = {
  implementation: ElementCSSInlineStyle
};
