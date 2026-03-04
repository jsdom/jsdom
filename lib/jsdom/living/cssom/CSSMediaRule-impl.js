"use strict";

const CSSConditionRuleImpl = require("./CSSConditionRule-impl.js").implementation;
const { serializeGroupingRuleBody } = require("./CSSGroupingRule-impl.js");
const MediaList = require("../../../generated/idl/MediaList.js");

class CSSMediaRuleImpl extends CSSConditionRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._media = MediaList.createImpl(globalObject, [], {
      mediaText: privateData.conditionText || ""
    });
  }

  get type() {
    return 4; // MEDIA_RULE
  }

  get media() {
    return this._media;
  }

  get conditionText() {
    return this._media.mediaText;
  }

  get cssText() {
    return `@media ${this._media.mediaText} ${serializeGroupingRuleBody(this._cssRules._list)}`;
  }
}

exports.implementation = CSSMediaRuleImpl;
