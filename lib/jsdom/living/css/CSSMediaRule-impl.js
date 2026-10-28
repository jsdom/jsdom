"use strict";

const CSSConditionRule = require("./CSSConditionRule-impl.js");
const MediaList = require("../../../generated/idl/MediaList.js");
const mediaQueries = require("./match/media.js");
// https://drafts.csswg.org/css-conditional-3/#cssmediarule
class CSSMediaRuleImpl extends CSSConditionRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this.media = MediaList.createImpl(globalObject, undefined, {
      list: this._condition,
      owner: this,
    });
  }

  get conditionText() {
    return this.media.mediaText;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    return this._serializeBlock(`@media ${this.media.mediaText}`);
  }

  // https://drafts.csswg.org/css-conditional-3/#dom-cssmediarule-matches
  get matches() {
    let sheet = this.parentStyleSheet;
    if (!sheet) {
      return false;
    }
    while (sheet.parentStyleSheet) {
      sheet = sheet.parentStyleSheet;
    }
    if (!sheet._ownerRoot) {
      return false;
    }
    const globalObject = sheet.ownerNode._ownerDocument.defaultView;
    return globalObject !== null && mediaQueries(this.media._list, globalObject);
  }
}
exports.implementation = CSSMediaRuleImpl;
