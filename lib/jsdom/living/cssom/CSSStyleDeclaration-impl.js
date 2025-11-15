"use strict";

const cssstyle = require("cssstyle");
const idlUtils = require("../generated/utils");

class CSSStyleDeclaration {
  constructor(globalObject, args, { options = {} }) {
    this._style = new cssstyle.CSSStyleDeclaration(globalObject, options);
    this._list = [];
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

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this._style.length;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._list.keys();
  }
}

module.exports = {
  implementation: CSSStyleDeclaration
};
