"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const MediaList = require("../../../generated/idl/MediaList.js");
const CSSStyleSheet = require("../../../generated/idl/CSSStyleSheet.js");

class CSSImportRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._href = privateData.href || "";
    this._layerName = privateData.layerName !== undefined ? privateData.layerName : null;
    this._supportsText = privateData.supportsText !== undefined ? privateData.supportsText : null;

    this._media = MediaList.createImpl(globalObject, [], {
      mediaText: privateData.mediaText || ""
    });

    this._styleSheet = CSSStyleSheet.createImpl(globalObject, [], {
      ownerRule: this,
      parentStyleSheet: this._parentStyleSheet,
      constructed: false
    });
  }

  get type() {
    return 3; // IMPORT_RULE
  }

  get href() {
    return this._href;
  }

  get media() {
    return this._media;
  }

  get styleSheet() {
    return this._styleSheet;
  }

  get layerName() {
    return this._layerName;
  }

  get supportsText() {
    return this._supportsText;
  }

  get cssText() {
    const escapedHref = this._href.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    let result = `@import url("${escapedHref}")`;
    if (this._layerName !== null) {
      result += this._layerName ? ` layer(${this._layerName})` : " layer";
    }
    if (this._supportsText !== null) {
      result += ` supports(${this._supportsText})`;
    }
    const { mediaText } = this._media;
    if (mediaText) {
      result += ` ${mediaText}`;
    }
    return result + ";";
  }
}

exports.implementation = CSSImportRuleImpl;
