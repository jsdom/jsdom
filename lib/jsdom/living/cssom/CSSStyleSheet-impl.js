"use strict";

const StyleSheetImpl = require("./StyleSheet-impl.js").implementation;
const CSSRuleList = require("../../../generated/idl/CSSRuleList.js");
const MediaList = require("../../../generated/idl/MediaList.js");
const DOMException = require("../../../generated/idl/DOMException.js");
const CSSImportRule = require("../../../generated/idl/CSSImportRule.js");
const cssParser = require("../helpers/css-parser.js");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");

class CSSStyleSheetImpl extends StyleSheetImpl {
  constructor(globalObject, args, privateData = {}) {
    super(globalObject, args, privateData);

    this._constructed = "constructed" in privateData ? privateData.constructed : true;
    this.ownerRule = privateData.ownerRule || null;
    this.cssRules = CSSRuleList.createImpl(globalObject);

    this.media = MediaList.createImpl(globalObject, [], {
      mediaText: privateData.mediaText || ""
    });
  }

  // Legacy alias for cssRules
  get rules() {
    return this.cssRules;
  }

  insertRule(rule, index) {
    // TODO: check origin-clean flag
    // TODO: check disallow modification flag

    const parsed = cssParser.parseRule(rule, this._globalObject);
    if (CSSImportRule.isImpl(parsed) && this._constructed) {
      throw DOMException.create(this._globalObject, [
        "Cannot insert @import rules into a constructed stylesheet.",
        "SyntaxError"
      ]);
    }

    return this.cssRules._insertParsed(parsed, index, null, this);
  }

  deleteRule(index) {
    // TODO: check origin-clean flag
    // TODO: check disallow modification flag

    this.cssRules._remove(index);
  }

  // Legacy method
  addRule(selector, style, index) {
    const rule = `${selector} { ${style} }`;
    if (index === undefined) {
      index = this.cssRules._list.length;
    }
    this.insertRule(rule, index);
    return -1;
  }

  // Legacy method
  removeRule(index) {
    this.deleteRule(index);
  }

  replaceSync(text) {
    if (!this._constructed) {
      throw DOMException.create(this._globalObject, [
        "Cannot call replaceSync on non-constructed CSSStyleSheet.",
        "NotAllowedError"
      ]);
    }

    // Clear existing rules
    this.cssRules._list.length = 0;

    // Parse and populate
    cssParser.parseStylesheet(text, this._globalObject, { styleSheet: this });
  }

  async replace(text) {
    if (!this._constructed) {
      throw DOMException.create(this._globalObject, [
        "Cannot call replace on non-constructed CSSStyleSheet.",
        "NotAllowedError"
      ]);
    }

    // Clear existing rules
    this.cssRules._list.length = 0;

    // Parse and populate
    cssParser.parseStylesheet(text, this._globalObject, { styleSheet: this });

    // webidl2js doesn't auto-wrap return values: https://github.com/jsdom/webidl2js/issues/257
    return wrapperForImpl(this);
  }
}

exports.implementation = CSSStyleSheetImpl;
