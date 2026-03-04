"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const MediaList = require("../../../generated/idl/MediaList.js");
const CSSStyleSheet = require("../../../generated/idl/CSSStyleSheet.js");

class CSSImportRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this.href = privateData.href;
    this.layerName = privateData.layerName;
    this.supportsText = privateData.supportsText;

    this.media = MediaList.createImpl(globalObject, [], {
      mediaText: privateData.mediaText
    });

    this.styleSheet = CSSStyleSheet.createImpl(globalObject, [], {
      ownerRule: this,
      parentStyleSheet: this.parentStyleSheet,
      constructed: false
    });
  }

  get type() {
    return 3; // IMPORT_RULE
  }

  get cssText() {
    const escapedHref = this.href.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    let result = `@import url("${escapedHref}")`;
    if (this.layerName !== null) {
      result += this.layerName ? ` layer(${this.layerName})` : " layer";
    }
    if (this.supportsText !== null) {
      result += ` supports(${this.supportsText})`;
    }
    const { mediaText } = this.media;
    if (mediaText) {
      result += ` ${mediaText}`;
    }
    return result + ";";
  }
}

exports.implementation = CSSImportRuleImpl;
