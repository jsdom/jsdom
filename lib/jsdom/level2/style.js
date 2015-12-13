"use strict";
const resourceLoader = require("../browser/resource-loader");
const core = require("../level1/core");
const utils = require("../utils");
const defineGetter = utils.defineGetter;
const cssom = require("cssom");
const cssstyle = require("cssstyle");
const resolveHref = require("../utils").resolveHref;
const assert = require("assert");

const domSymbolTree = require("../living/helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../living/node-type");

// What works now:
// - Accessing the rules defined in individual stylesheets
// - Modifications to style content attribute are reflected in style property
// - Modifications to style property are reflected in style content attribute
// TODO
// - Modifications to style element's textContent are reflected in sheet property.
// - Modifications to style element's sheet property are reflected in textContent.
// - Modifications to link.href property are reflected in sheet property.
// - Less-used features of link: disabled
// - Less-used features of style: disabled, scoped, title
// - CSSOM-View
//   - getComputedStyle(): requires default stylesheet, cascading, inheritance,
//     filtering by @media (screen? print?), layout for widths/heights
// - Load events are not in the specs, but apparently some browsers
//   implement something. Should onload only fire after all @imports have been
//   loaded, or only the primary sheet?

core.StyleSheet = cssom.StyleSheet;
core.MediaList = cssom.MediaList;
core.CSSStyleSheet = cssom.CSSStyleSheet;
core.CSSRule = cssom.CSSRule;
core.CSSStyleRule = cssom.CSSStyleRule;
core.CSSMediaRule = cssom.CSSMediaRule;
core.CSSImportRule = cssom.CSSImportRule;
core.CSSStyleDeclaration = cssstyle.CSSStyleDeclaration;

// Relavant specs
// http://www.w3.org/TR/DOM-Level-2-Style (2000)
// http://www.w3.org/TR/cssom-view/ (2008)
// http://dev.w3.org/csswg/cssom/ (2010) Meant to replace DOM Level 2 Style
// http://www.whatwg.org/specs/web-apps/current-work/multipage/ HTML5, of course
// http://dev.w3.org/csswg/css-style-attr/  not sure what's new here

// Objects that aren't in cssom library but should be:
//   CSSRuleList  (cssom just uses array)
//   CSSFontFaceRule
//   CSSPageRule

// These rules don't really make sense to implement, so CSSOM draft makes them
// obsolete.
//   CSSCharsetRule
//   CSSUnknownRule

// These objects are considered obsolete by CSSOM draft, although modern
// browsers implement them.
//   CSSValue
//   CSSPrimitiveValue
//   CSSValueList
//   RGBColor
//   Rect
//   Counter

// http://dev.w3.org/csswg/cssom/#stylesheetlist
function StyleSheetList() {}

Object.setPrototypeOf(StyleSheetList.prototype, Array.prototype);

StyleSheetList.prototype.item = function item(i) {
  return this[i];
};

core.StyleSheetList = StyleSheetList;

// http://dev.w3.org/csswg/cssom/#extensions-to-the-document-interface
defineGetter(core.Document.prototype, "styleSheets", function () {
  if (!this._styleSheets) {
    this._styleSheets = new StyleSheetList();
  }
  return this._styleSheets;
});


/**
 * @this {core.HTMLLinkElement|core.HTMLStyleElement}
 * @param {string} url
 * @param {cssom.CSSStyleSheet} sheet
 * @see http://dev.w3.org/csswg/cssom/#requirements-on-user-agents-implementing0
 */
function fetchStylesheet(url, sheet) {
  resourceLoader.load(this, url, function (data) {
    // TODO: abort if the content-type is not text/css, and the document is
    // in strict mode
    url = sheet.href = resourceLoader.resolveResourceUrl(this.ownerDocument, url);
    evaluateStylesheet.call(this, data, sheet, url);
  });
}
/**
 * @this {core.HTMLLinkElement|core.HTMLStyleElement}
 * @param {string} data
 * @param {cssom.CSSStyleSheet} sheet
 * @param {string} baseUrl
 */
function evaluateStylesheet(data, sheet, baseUrl) {
  // this is the element
  const newStyleSheet = cssom.parse(data);
  const spliceArgs = newStyleSheet.cssRules;
  spliceArgs.unshift(0, sheet.cssRules.length);
  Array.prototype.splice.apply(sheet.cssRules, spliceArgs);
  scanForImportRules.call(this, sheet.cssRules, baseUrl);
}
/**
 * @this {core.HTMLLinkElement|core.HTMLStyleElement}
 * @param {cssom.CSSStyleSheet} sheet
 * @param {string} baseUrl
 */
function scanForImportRules(cssRules, baseUrl) {
  if (!cssRules) {
    return;
  }

  for (let i = 0; i < cssRules.length; ++i) {
    if (cssRules[i].cssRules) {
      // @media rule: keep searching inside it.
      scanForImportRules.call(this, cssRules[i].cssRules, baseUrl);
    } else if (cssRules[i].href) {
      // @import rule: fetch the resource and evaluate it.
      // See http://dev.w3.org/csswg/cssom/#css-import-rule
      //     If loading of the style sheet fails its cssRules list is simply
      //     empty. I.e. an @import rule always has an associated style sheet.
      fetchStylesheet.call(this, resolveHref(baseUrl, cssRules[i].href), this.sheet);
    }
  }
}

core.HTMLLinkElement.prototype._attach = function () {
  core.HTMLElement.prototype._attach.apply(this, arguments);
  this.ownerDocument.styleSheets.push(this.sheet);

  if (!/(?:[ \t\n\r\f]|^)stylesheet(?:[ \t\n\r\f]|$)/i.test(this.rel)) {
    // rel is a space-separated list of tokens, and the original rel types
    // are case-insensitive.
    return;
  }
  if (this.href) {
    fetchStylesheet.call(this, this.href, this.sheet);
  }
};

core.HTMLLinkElement.prototype._detach = function () {
  const idx = this.ownerDocument.styleSheets.indexOf(this.sheet);
  if (idx !== -1) {
    this.ownerDocument.styleSheets.splice(idx, 1);
  }
  core.HTMLElement.prototype._detach.apply(this, arguments);
};

function refreshStyleSheet() {
  if (this.type && this.type !== "text/css") {
    return;
  }

  if (!this.ownerDocument.contains(this)) {
    return;
  }

  let content = "";
  for (const child of domSymbolTree.childrenIterator(this)) {
    if (child.nodeType === NODE_TYPE.TEXT_NODE) {
      content += child.nodeValue;
    }
  }

  evaluateStylesheet.call(this, content, this.sheet, this._ownerDocument.URL);
}

assert.equal(undefined, core.HTMLStyleElement._init);
core.HTMLStyleElement._init = function () {
  // need bubbling which is why we still rely on
  this.addEventListener("DOMSubtreeModified", refreshStyleSheet);
  this.addEventListener("DOMCharacterDataModified", refreshStyleSheet);
};

core.HTMLStyleElement.prototype._attach = function () {
  core.HTMLElement.prototype._attach.apply(this, arguments);
  this.ownerDocument.styleSheets.push(this.sheet);
  refreshStyleSheet.call(this);
};

core.HTMLStyleElement.prototype._detach = function () {
  core.HTMLElement.prototype._detach.apply(this, arguments);
  const idx = this.ownerDocument.styleSheets.indexOf(this.sheet);
  if (idx !== -1) {
    this.ownerDocument.styleSheets.splice(idx, 1);
  }
};

// https://html.spec.whatwg.org/multipage/semantics.html#htmllinkelement:
// HTMLLinkElement implements LinkStyle

// https://html.spec.whatwg.org/multipage/semantics.html#htmlstyleelement:
// HTMLStyleElement implements LinkStyle

// from http://dev.w3.org/csswg/cssom/#the-linkstyle-interface

// A future refactoring would be to place _cssStyleSheet on all HTMLLinkElement and HTMLStyleElement instances, in
// their constructor, initially set to null. Then, successful loading of the stylesheet object would set it to
// non-null. The getter would just always return the current value. This would make it more correctly be null before
// loading, and on load failure, and would allow access to _cssStyleSheet instead of the public .sheet API.

function getOrCreateSheet() {
  if (!this._cssStyleSheet) {
    this._cssStyleSheet = new cssom.CSSStyleSheet();
  }
  return this._cssStyleSheet;
}

defineGetter(core.HTMLLinkElement.prototype, "sheet", getOrCreateSheet);
defineGetter(core.HTMLStyleElement.prototype, "sheet", getOrCreateSheet);
