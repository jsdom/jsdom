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
      this.setAttributeNS(null, "style", newCssText);
      this._settingCssText = false;
    }
  }
  get style() {
    return idlUtils.wrapperForImpl(this._style);
  }
}

module.exports = {
  implementation: ElementCSSInlineStyle
};
