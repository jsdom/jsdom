"use strict";

const DOMException = require("../../../generated/idl/DOMException.js");
const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const CSSRuleList = require("../../../generated/idl/CSSRuleList.js");
const cssParser = require("../helpers/css-parser.js");

class CSSGroupingRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this.cssRules = CSSRuleList.createImpl(globalObject);
  }

  insertRule(rule, index) {
    if (index > this.cssRules._list.length) {
      throw DOMException.create(this._globalObject, [
        "Index is out of range.",
        "IndexSizeError"
      ]);
    }

    let newRule;
    try {
      newRule = cssParser.parseRule(rule, this._globalObject);
    } catch (e) {
      // In nesting context, declaration text creates CSSNestedDeclarations
      if (this._isInNestingContext()) {
        newRule = cssParser.parseDeclarationsAsNestedRule(rule, this._globalObject);
        if (!newRule) {
          throw e;
        }
      } else {
        throw e;
      }
    }

    // @import and @namespace rules are not allowed inside grouping rules
    // CSSImportRule.type === 3, CSSNamespaceRule type check via constructor name
    if (newRule.type === 3) {
      throw DOMException.create(this._globalObject, [
        "@import rules are not allowed inside grouping rules.",
        "HierarchyRequestError"
      ]);
    }
    if (newRule.type === 10) {
      throw DOMException.create(this._globalObject, [
        "@namespace rules are not allowed inside grouping rules.",
        "HierarchyRequestError"
      ]);
    }
    // @font-face is not valid inside a style rule (nesting context)
    if (newRule.type === 5) {
      let ancestor = this;
      while (ancestor) {
        if (ancestor.type === 1) {
          throw DOMException.create(this._globalObject, [
            "@font-face rules are not allowed inside style rules.",
            "HierarchyRequestError"
          ]);
        }
        ancestor = ancestor.parentRule;
      }
    }

    newRule.parentRule = this;
    newRule.parentStyleSheet = this.parentStyleSheet;
    this.cssRules._list.splice(index, 0, newRule);

    return index;
  }

  _isInNestingContext() {
    let ancestor = this;
    while (ancestor) {
      if (ancestor.type === 1) {
        return true;
      }
      ancestor = ancestor.parentRule;
    }
    return false;
  }

  deleteRule(index) {
    if (index >= this.cssRules._list.length) {
      throw DOMException.create(this._globalObject, [
        "Index is out of range.",
        "IndexSizeError"
      ]);
    }

    const rule = this.cssRules._list[index];
    rule.parentStyleSheet = null;
    rule.parentRule = null;
    this.cssRules._list.splice(index, 1);
  }
}

/**
 * Serialize the body of a grouping rule per CSSOM spec.
 * Produces multi-line output with indented child rules.
 */
function serializeGroupingRuleBody(rules) {
  let body = "{\n";
  for (const rule of rules) {
    const ruleText = rule.cssText;
    // Skip empty CSSNestedDeclarations per CSSOM serialization spec
    if (ruleText) {
      body += `  ${ruleText}\n`;
    }
  }
  body += "}";
  return body;
}

exports.implementation = CSSGroupingRuleImpl;
exports.serializeGroupingRuleBody = serializeGroupingRuleBody;
