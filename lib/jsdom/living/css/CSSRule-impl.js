"use strict";

// https://drafts.csswg.org/cssom-1/#cssrule
class CSSRuleImpl {
  constructor(globalObject, args, {
    definition,
    parentRule = null,
    parentStyleSheet = null
  }) {
    this._globalObject = globalObject;
    this._definition = definition;
    this.parentRule = parentRule;
    this.parentStyleSheet = parentStyleSheet;
  }

  // https://drafts.csswg.org/cssom/#dom-cssrule-csstext
  get cssText() {
    return this._serialize();
  }

  set cssText(value) {
    // The legacy setter intentionally leaves the rule unchanged.
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-type
  get type() {
    switch (this._definition.cssom) {
      case "CSSStyleRule":
        return 1;
      case "CSSImportRule":
        return 3;
      case "CSSMediaRule":
        return 4;
      case "CSSFontFaceRule":
        return 5;
      case "CSSPageRule":
        return 6;
      case "CSSKeyframesRule":
        return 7;
      case "CSSKeyframeRule":
        return 8;
      case "CSSMarginRule":
        return 9;
      case "CSSNamespaceRule":
        return 10;
      case "CSSCounterStyleRule":
        return 11;
      case "CSSSupportsRule":
        return 12;
      case "CSSFontFeatureValuesRule":
        return 14;
      default:
        return 0;
    }
  }
}
exports.implementation = CSSRuleImpl;
