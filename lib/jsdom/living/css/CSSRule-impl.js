"use strict";

class CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    this._globalObject = globalObject;
    this.parentRule = privateData.parentRule;
    this.parentStyleSheet = privateData.parentStyleSheet;
  }

  _invalidateStyleCache() {
    this.parentStyleSheet?._invalidateStyleCache();
  }

  _setParentStyleSheet(sheet) {
    this.parentStyleSheet = sheet;
    if (this.cssRules) {
      for (const rule of this.cssRules._list) {
        rule._setParentStyleSheet(sheet);
      }
    }
  }

  // Subclasses must override type and cssText
  get type() {
    return 0;
  }

  get cssText() {
    return "";
  }

  set cssText(_value) {
    // Per spec, setting cssText does nothing
  }
}

exports.implementation = CSSRuleImpl;
