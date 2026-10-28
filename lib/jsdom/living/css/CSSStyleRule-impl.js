"use strict";
const selectorSyntax = require("./utils/selector-syntax.js");

const { createRuleContents } = require("./utils/cssom.js");
const values = require("./values/value.js");
const CSSGroupingRule = require("./CSSGroupingRule-impl.js");
const CSSNestedDeclarations = require("../../../generated/idl/CSSNestedDeclarations.js");
const CSSScopeRule = require("../../../generated/idl/CSSScopeRule.js");
const CSSStyleProperties = require("../../../generated/idl/CSSStyleProperties.js");
const CSSStyleRule = require("../../../generated/idl/CSSStyleRule.js");
const parser = require("./parse/parser.js");
const { createContext } = require("./parse/context.js");
const { serializeSelector } = require("./utils/serialize-selectors.js");
const { invalidateStyle } = require("./utils/style.js");
const nestingCompound = selectorSyntax.compound(selectorSyntax.nesting, selectorSyntax.empty, null);
const relativeSelectorList = selectorSyntax.list([
  selectorSyntax.selector([nestingCompound], true),
]);

function isNestedInStyleRule({ parentRule }) {
  return (
    parentRule &&
    !CSSScopeRule.isImpl(parentRule) &&
    (CSSStyleRule.isImpl(parentRule) || isNestedInStyleRule(parentRule))
  );
}

// https://drafts.csswg.org/cssom-1/#cssstylerule
// https://drafts.csswg.org/css-nesting-1/#cssom-style
class CSSStyleRuleImpl extends CSSGroupingRule.implementation {
  _style = null;

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { parentStyleSheet } = this;
    const { definition, prelude } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = Array.isArray(contents[0]) ? contents.shift() : [];
    const rules = contents.flatMap((rule) => {
      if (Array.isArray(rule)) {
        const resolved = parser.resolveDeclarations(rule, definition.value.shorthands);
        if (resolved.length === 0) {
          return [];
        }
        return CSSNestedDeclarations.createImpl(globalObject, undefined, {
          declarations: resolved,
          definition: definition.value.rules[0],
          parentRule: this,
          parentStyleSheet,
        });
      }
      return rule;
    });
    this._selectors = prelude ?? relativeSelectorList;
    this._rules = rules;
    this._declarations = declarations;
    this._baseURL = parentStyleSheet?._baseURL ?? globalObject._document.baseURLSerialized();
  }

  get style() {
    if (this._style === null) {
      this._style = CSSStyleProperties.createImpl(this._globalObject, undefined, {
        declarations: this._declarations,
        parentRule: this,
        baseURL: this._baseURL,
      });
      this._declarations = null;
    }
    return this._style;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      _rules,
      selectorText,
      style: { cssText: declarations },
    } = this;
    if (_rules.length > 0) {
      return this._serializeBlock(selectorText, declarations);
    }
    return declarations ? `${selectorText} { ${declarations} }` : `${selectorText} { }`;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylerule-selectortext
  // https://drafts.csswg.org/css-nesting-1/#cssom
  get selectorText() {
    // Absolutize the selector of a nested style rule
    if (isNestedInStyleRule(this)) {
      return this._selectors
        .map((selector) => {
          const string = serializeSelector(selector, this.parentStyleSheet);
          if (
            selector.units[0].combinator !== null ||
            !selectorSyntax.containsNestingSelector(selector)
          ) {
            return `& ${string}`;
          }
          return string;
        })
        .join(", ");
    }
    return serializeSelector(this._selectors, this.parentStyleSheet);
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstylerule-selectortext
  set selectorText(selector) {
    const context = createContext(this);
    selector = parser.parseGrammar(selector, context.definition.prelude, context);
    if (!values.isFailure(selector)) {
      this._selectors = selector;
      invalidateStyle(this._globalObject, this.parentStyleSheet);
    }
  }
}
exports.implementation = CSSStyleRuleImpl;
