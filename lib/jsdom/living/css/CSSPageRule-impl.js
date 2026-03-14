"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl.js").implementation;
const { CSSStyleDeclaration } = require("./CSSStyleDeclaration.js");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");

const validPagePseudos = new Set(["first", "left", "right", "blank"]);

/**
 * Parse and validate a page selector. Returns the normalized selector string,
 * or null if the selector is invalid.
 *
 * Valid page selectors: "", "named", ":first", "named:first", "named:first:left"
 * Invalid: "named :first" (space), ":notapagepseudo", ":first :left" (space)
 */
function parsePageSelector(value) {
  const trimmed = value.trim();
  if (trimmed === "") {
    return "";
  }

  // Match: optional ident, followed by zero or more :pseudo parts, no whitespace allowed
  const match = trimmed.match(/^([a-zA-Z_\-\\][a-zA-Z0-9_\-\\]*)?((?::[a-zA-Z]+)*)$/);
  if (!match) {
    return null;
  }

  const pageName = match[1] || "";
  const pseudoPart = match[2] || "";

  if (!pageName && !pseudoPart) {
    return null;
  }

  // Validate each pseudo page
  if (pseudoPart) {
    const pseudos = pseudoPart.slice(1).split(":");
    for (const pseudo of pseudos) {
      if (!validPagePseudos.has(pseudo.toLowerCase())) {
        return null;
      }
    }
    // Normalize pseudo pages to lowercase
    const normalizedPseudos = pseudos.map(p => `:${p.toLowerCase()}`).join("");
    return pageName + normalizedPseudos;
  }

  return pageName;
}

class CSSPageRuleImpl extends CSSGroupingRuleImpl {
  #selectorText;

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this.#selectorText = privateData.selectorText;
    this._style = new CSSStyleDeclaration(globalObject, [], {
      context: wrapperForImpl(this)
    });
  }

  get type() {
    return 6; // PAGE_RULE
  }

  get selectorText() {
    return this.#selectorText;
  }

  set selectorText(value) {
    const parsed = parsePageSelector(value);
    if (parsed !== null) {
      this.#selectorText = parsed;
    }
  }

  get style() {
    return this._style;
  }

  // TODO: delete this setter when CSSStyleDeclaration is converted to webidl2js
  // (then [PutForwards=cssText] on the WebIDL attribute will handle it)
  set style(value) {
    this._style.cssText = value;
  }

  get cssText() {
    const styleText = this._style.cssText;
    const selector = this.#selectorText ? ` ${this.#selectorText}` : "";
    if (styleText) {
      return `@page${selector} { ${styleText} }`;
    }
    return `@page${selector} { }`;
  }
}

exports.implementation = CSSPageRuleImpl;
