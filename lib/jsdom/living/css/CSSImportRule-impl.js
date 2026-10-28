"use strict";

exports.isMatchingImportConditions = isMatchingImportConditions;
const values = require("./values/value.js");
const serialize = require("./serialize.js");
const CSSRule = require("./CSSRule-impl.js");
const CSSStyleSheet = require("../../../generated/idl/CSSStyleSheet.js");
const MediaList = require("../../../generated/idl/MediaList.js");
const mediaQueries = require("./match/media.js");
const supportsModule = require("./match/support.js");
function isMatchingImportConditions(rule, globalObject) {
  if (globalObject === undefined) {
    let sheet = rule.parentStyleSheet;
    while (sheet?.parentStyleSheet) {
      sheet = sheet.parentStyleSheet;
    }
    globalObject = sheet?.ownerNode?._ownerDocument.defaultView ?? rule._globalObject;
  }
  return rule._supports && mediaQueries(rule.media._list, globalObject);
}

// https://drafts.csswg.org/cssom-1/#cssimportrule
class CSSImportRuleImpl extends CSSRule.implementation {
  // https://drafts.csswg.org/cssom-1/#dom-cssimportrule-stylesheet
  styleSheet = null;

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const {
      prelude: [url, options, media],
    } = privateData;
    this._url = url;
    this._layerName = null;
    if (values.isFunction(url)) {
      this.href = url.value[0].value;
    } else {
      this.href = url.value;
    }
    if (values.isOmitted(options)) {
      this.layerName = null;
      this._scope = null;
      this._supports = true;
      this.supportsText = null;
    } else {
      const [layer, scope, supports] = options;
      if (values.isFunction(layer)) {
        this._layerName = layer.value;
        this.layerName = serialize.serializeComponentValue(layer.value);
      } else if (values.isOmitted(layer)) {
        this.layerName = null;
      } else {
        this.layerName = "";
      }
      if (values.isOmitted(scope)) {
        this._scope = null;
      } else {
        this._scope = scope;
      }
      if (values.isOmitted(supports)) {
        this.supportsText = null;
        this._supports = true;
      } else {
        this.supportsText = serialize.serializeComponentValue(supports.value);
        this._supports = supportsModule(supports.value, globalObject);
      }
    }
    this.media = MediaList.createImpl(globalObject, undefined, {
      list: values.isOmitted(media) ? undefined : media,
      owner: this,
    });
    if (this._supports) {
      // Expose the imported sheet before fetching completes, and retain it if fetching fails.
      // https://github.com/w3c/csswg-drafts/issues/14099
      // https://github.com/w3c/csswg-drafts/issues/13292
      this.styleSheet = CSSStyleSheet.createImpl(globalObject, [], {
        ownerRule: this,
        parentStyleSheet: this.parentStyleSheet,
        media: this.media,
        rules: "",
      });
    }
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      _scope,
      _url,
      layerName,
      media: { mediaText },
      supportsText,
    } = this;
    const url = values.isFunction(_url)
      ? serialize.serializeComponentValue(_url)
      : serialize.serializeURL(_url);
    let string = `@import ${url}`;
    if (layerName) {
      string += ` layer(${layerName})`;
    } else if (layerName === "") {
      string += " layer";
    }
    if (_scope) {
      string += ` ${serialize.serializeComponentValue(_scope)}`;
    }
    if (supportsText) {
      string += ` supports(${supportsText})`;
    }
    if (mediaText) {
      string += ` ${mediaText}`;
    }
    return `${string};`;
  }
  _abort() {
    this._controller?.abort();
  }

  _fetch() {
    let sheet = this.parentStyleSheet;
    while (sheet.parentStyleSheet) {
      sheet = sheet.parentStyleSheet;
    }
    const element = sheet.ownerNode;
    if (element?.sheet === sheet) {
      const { fetchStyleSheetImports } = require("./helpers/stylesheets.js");
      fetchStyleSheetImports(this.parentStyleSheet, element, element._ownerDocument._fetchSignal);
    }
  }
}
exports.implementation = CSSImportRuleImpl;
