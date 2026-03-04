"use strict";

class CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    this._globalObject = globalObject;
    this._parentRule = privateData.parentRule || null;
    this._parentStyleSheet = privateData.parentStyleSheet || null;
  }

  get parentRule() {
    return this._parentRule;
  }

  get parentStyleSheet() {
    return this._parentStyleSheet;
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
