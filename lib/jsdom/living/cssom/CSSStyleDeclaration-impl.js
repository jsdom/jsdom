"use strict";

const cssstyle = require("cssstyle");

class CSSStyleDeclaration {
  constructor(globalObject, args, { options = {} }) {
    this._style = new cssstyle.CSSStyleDeclaration(globalObject, options);
  }

  get cssText() {
    return this._style.cssText;
  }

  set cssText(value) {
    this._style.cssText = value;
  }

  get length() {
    return this._style.length;
  }

  item(index) {
    return this._style.item(index);
  }

  getPropertyValue(property) {
    return this._style.getPropertyValue(property);
  }

  getPropertyPriority(property) {
    return this._style.getPropertyPriority(property);
  }

  setProperty(property, value, priority = "") {
    this._style.setProperty(property, value, priority);
  }

  removeProperty(property) {
    return this._style.removeProperty(property);
  }

  get parentRule() {
    return this._style.parentRule;
  }

  _setOptions(opt) {
    this._style.setOptions(opt);
  }
}

module.exports = {
  implementation: CSSStyleDeclaration
};
