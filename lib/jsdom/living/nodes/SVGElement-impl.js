"use strict";
const { mixin } = require("../../utils");
const ElementImpl = require("./Element-impl").implementation;
const GlobalEventHandlersImpl = require("./GlobalEventHandlers-impl").implementation;
const DOMStringMap = require("../generated/DOMStringMap");

class SVGElementImpl extends ElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._style = new this._core.CSSStyleDeclaration(newCssText => {
      if (!this._settingCssText) {
        this._settingCssText = true;
        this.setAttribute("style", newCssText);
        this._settingCssText = false;
      }
    });

    this._dataset = DOMStringMap.createImpl([], { element: this });
  }

  get style() {
    return this._style;
  }
  set style(value) {
    this._style.cssText = value;
  }

  _attrModified(name, value, oldValue) {
    if (name === "style" && value !== oldValue && !this._settingCssText) {
      this._settingCssText = true;
      this._style.cssText = value;
      this._settingCssText = false;
    }

    super._attrModified.apply(this, arguments);
  }

  get dataset() {
    return this._dataset;
  }
}

mixin(SVGElementImpl.prototype, GlobalEventHandlersImpl.prototype);

module.exports = {
  implementation: SVGElementImpl
};
