"use strict";

const whatwgURL = require("whatwg-url");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");
const DOMException = require("../../../generated/idl/DOMException.js");
const ruleUtils = require("./utils/cssom.js");
const CSSImportRule = require("../../../generated/idl/CSSImportRule.js");
const MediaList = require("../../../generated/idl/MediaList.js");
const StyleSheet = require("./StyleSheet-impl.js");
const parser = require("./parse/parser.js");
function createMediaList(list, globalObject, owner, preserve = false) {
  if (list === null) {
    list = "";
  } else if (MediaList.isImpl(list)) {
    if (preserve) {
      return list;
    }
    list = list.mediaText;
  }
  list = parser.parseGrammar(list, "<media-query-list>", globalObject);
  return MediaList.createImpl(globalObject, undefined, {
    list,
    owner,
  });
}

// https://drafts.csswg.org/cssom-1/#cssstylesheet
class CSSStyleSheetImpl extends StyleSheet.implementation {
  _stylePlan = null;

  // https://drafts.csswg.org/cssom-1/#concept-css-style-sheet-disallow-modification-flag
  _disallowModification = false;

  // https://drafts.csswg.org/cssom/#last-css-style-sheet-set-name
  _lastName = null;

  // https://drafts.csswg.org/cssom/#preferred-css-style-sheet-set-name
  _preferredName = null;

  // https://drafts.csswg.org/cssom-1/#create-a-constructed-cssstylesheet
  // https://drafts.csswg.org/cssom-1/#dictdef-cssstylesheetinit
  // https://drafts.csswg.org/cssom-1/#create-a-css-style-sheet
  // https://html.spec.whatwg.org/multipage/infrastructure.html#create-a-css-style-sheet
  constructor(globalObject, [options], privateData) {
    super();
    this._globalObject = globalObject;
    if (options) {
      // Create a constructed CSS style sheet
      const { baseURL, disabled, media } = options;
      const document = globalObject._document;
      const documentBaseURL = document.baseURL();
      let parsedBaseURL = documentBaseURL;
      if (baseURL !== null) {
        parsedBaseURL = whatwgURL.parseURL(baseURL, { baseURL: documentBaseURL });
      }
      if (parsedBaseURL === null) {
        throw DOMException.create(globalObject, [
          `Invalid stylesheet base URL "${baseURL}".`,
          "NotAllowedError",
        ]);
      }
      this._alternate = false;
      this._baseURL = whatwgURL.serializeURL(parsedBaseURL);
      this._constructed = true;
      this._document = document;
      this._encoding = document._encoding;
      this._location = null;
      this._originClean = true;
      this._rules = [];
      this.disabled = disabled;
      this.media = createMediaList(media, globalObject, this);
      this.ownerNode = null;
      this.ownerRule = null;
      this.parentStyleSheet = null;
      this._title = "";
    } else {
      // Create a CSS style sheet (not "constructed")
      const {
        alternate = false,
        disabled = false,
        encoding = "UTF-8",
        location = null,
        media = "",
        parentStyleSheet = null,
        originClean = true,
        ownerRule = null,
        ownerNode = null,
        rules,
        title = "",
      } = privateData;
      this._alternate = alternate;
      this._baseURL =
        location ??
        ownerNode?._ownerDocument.baseURLSerialized() ??
        globalObject._document.baseURLSerialized();
      this._constructed = false;
      this._document = null;
      this._encoding = encoding;
      this._location = location;
      this._originClean = originClean;
      this.disabled = disabled;
      this.media = createMediaList(media, globalObject, this, true);
      this.ownerNode = ownerNode;
      this.ownerRule = ownerRule;
      this.parentStyleSheet = parentStyleSheet;
      this._title = title ?? "";
      this._rules = parser.parseStyleSheet(rules, this, privateData.onError);
    }
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-cssrules
  get cssRules() {
    if (!this._originClean) {
      throw DOMException.create(this._globalObject, [
        "Cannot read rules from a cross-origin stylesheet.",
        "SecurityError",
      ]);
    }
    return ruleUtils.getRuleList(this);
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-rules
  get rules() {
    return this.cssRules;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-addrule
  addRule(selector, contents, index) {
    this.insertRule(`${selector} { ${contents} }`, index ?? this._rules.length);
    return -1;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-deleterule
  deleteRule(index) {
    if (!this._originClean) {
      throw DOMException.create(this._globalObject, [
        "Cannot delete rules from a cross-origin stylesheet.",
        "SecurityError",
      ]);
    }
    if (this._disallowModification) {
      throw DOMException.create(this._globalObject, [
        "Cannot delete rules while a stylesheet replacement is pending.",
        "NotAllowedError",
      ]);
    }
    ruleUtils.removeRule(this, index);
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-insertrule
  insertRule(rule, index) {
    if (!this._originClean) {
      throw DOMException.create(this._globalObject, [
        "Cannot insert rules into a cross-origin stylesheet.",
        "SecurityError",
      ]);
    }
    if (this._disallowModification) {
      throw DOMException.create(this._globalObject, [
        "Cannot insert rules while a stylesheet replacement is pending.",
        "NotAllowedError",
      ]);
    }
    return ruleUtils.insertRule(this, rule, index, !this._constructed);
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-removerule
  removeRule(index) {
    this.deleteRule(index);
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-replace
  replace(text) {
    if (!this._constructed || this._disallowModification) {
      return this._globalObject.Promise.reject(
        DOMException.create(this._globalObject, [
          this._constructed
            ? "Cannot replace rules while a stylesheet replacement is pending."
            : "Cannot replace rules in a stylesheet that was not constructed.",
          "NotAllowedError",
        ]),
      );
    }
    this._disallowModification = true;
    return this._globalObject.Promise.resolve().then(() => {
      this._replace(text);
      this._disallowModification = false;
      return wrapperForImpl(this);
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylesheet-replacesync
  replaceSync(text) {
    if (!this._constructed || this._disallowModification) {
      throw DOMException.create(this._globalObject, [
        this._constructed
          ? "Cannot replace rules while a stylesheet replacement is pending."
          : "Cannot replace rules in a stylesheet that was not constructed.",
        "NotAllowedError",
      ]);
    }
    this._replace(text);
  }

  _replace(text) {
    const rules = parser.parseStyleSheet(text, this).filter((rule) => !CSSImportRule.isImpl(rule));
    ruleUtils.replaceRules(this, rules);
  }
}
exports.implementation = CSSStyleSheetImpl;
