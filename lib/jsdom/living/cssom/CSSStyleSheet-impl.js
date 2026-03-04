"use strict";

const DOMException = require("../../../generated/idl/DOMException.js");
const StyleSheetImpl = require("./StyleSheet-impl.js").implementation;
const CSSRuleList = require("../../../generated/idl/CSSRuleList.js");
const MediaList = require("../../../generated/idl/MediaList.js");
const { parseRule, parseStylesheet } = require("../helpers/css-parser.js");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");

class CSSStyleSheetImpl extends StyleSheetImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._constructed = "constructed" in privateData ? privateData.constructed : true;
    this.ownerRule = privateData.ownerRule || null;
    this.cssRules = CSSRuleList.createImpl(globalObject);

    if (!this.media) {
      this.media = MediaList.createImpl(globalObject, [], {
        mediaText: privateData.mediaText || ""
      });
    }
  }

  // Legacy alias for cssRules
  get rules() {
    return this.cssRules;
  }

  insertRule(rule, index) {
    if (index > this.cssRules._list.length) {
      throw DOMException.create(this._globalObject, [
        "Index is out of range.",
        "IndexSizeError"
      ]);
    }

    const newRule = parseRule(rule, this._globalObject);
    const ruleType = newRule.type;
    const list = this.cssRules._list;

    // @import rules (type 3) can only be preceded by other @import and @layer statement rules
    if (ruleType === 3) {
      for (let i = 0; i < index; i++) {
        const t = list[i].type;
        if (t !== 3 && t !== 17) {
          throw DOMException.create(this._globalObject, [
            "@import rules must precede all other rules.",
            "HierarchyRequestError"
          ]);
        }
      }
    }

    // @namespace rules (type 10) cannot be inserted if ANY non-import/namespace/layer-statement
    // rules exist anywhere in the list (per CSSOM spec).
    if (ruleType === 10) {
      const hasOtherRules = list.some(r => r.type !== 3 && r.type !== 10 && r.type !== 17);
      if (hasOtherRules) {
        throw DOMException.create(this._globalObject, [
          "Cannot insert @namespace rule when other rules exist.",
          "InvalidStateError"
        ]);
      }
    }

    // Non-@import/namespace/layer-statement rules cannot be inserted before @import or @namespace rules
    if (ruleType !== 3 && ruleType !== 10 && ruleType !== 17) {
      for (let i = index; i < list.length; i++) {
        const t = list[i].type;
        if (t === 3 || t === 10) {
          throw DOMException.create(this._globalObject, [
            "Cannot insert a rule before @import or @namespace rules.",
            "HierarchyRequestError"
          ]);
        }
      }
    }

    // Validate namespace prefixes in style rule selectors
    if (ruleType === 1) {
      const declaredPrefixes = new Set();
      for (const r of list) {
        if (r.type === 10) {
          declaredPrefixes.add(r.prefix);
        }
      }
      // Match namespace prefix usage: identifier| (not *| or bare |)
      const nsPrefixPattern = /(?:^|[\s,>+~(])([a-zA-Z_][\w-]*)\|/g;
      let m;
      while ((m = nsPrefixPattern.exec(newRule.selectorText)) !== null) {
        if (!declaredPrefixes.has(m[1])) {
          throw DOMException.create(this._globalObject, [
            "Undeclared namespace prefix in selector.",
            "SyntaxError"
          ]);
        }
      }
    }

    newRule.parentStyleSheet = wrapperForImpl(this);
    this.cssRules._list.splice(index, 0, newRule);

    return index;
  }

  deleteRule(index) {
    if (index >= this.cssRules._list.length) {
      throw DOMException.create(this._globalObject, [
        "Index is out of range.",
        "IndexSizeError"
      ]);
    }

    const rule = this.cssRules._list[index];

    // Cannot delete a @namespace rule if any non-import/namespace rules exist
    if (rule.type === 10) {
      const hasOtherRules = this.cssRules._list.some(r => r.type !== 3 && r.type !== 10 && r.type !== 17);
      if (hasOtherRules) {
        throw DOMException.create(this._globalObject, [
          "Cannot delete @namespace rule when other rules exist.",
          "InvalidStateError"
        ]);
      }
    }

    // If this is an @import rule, unlink its imported stylesheet
    if (rule.type === 3 && rule.styleSheet) {
      rule.styleSheet.parentStyleSheet = null;
    }

    rule.parentStyleSheet = null;
    rule.parentRule = null;
    this.cssRules._list.splice(index, 1);
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
    parseStylesheet(text, this._globalObject, { styleSheet: this });
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
    parseStylesheet(text, this._globalObject, { styleSheet: this });

    return wrapperForImpl(this);
  }
}

exports.implementation = CSSStyleSheetImpl;
