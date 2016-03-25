"use strict";

const cssom = require("cssom");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const LinkStyleImpl = require("./LinkStyle-impl").implementation;
const idlUtils = require("../generated/utils");

const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../node-type");
const resourceLoader = require("../../browser/resource-loader");
const resolveHref = require("../../utils").resolveHref;

/**
 * @this {core.HTMLLinkElement|core.HTMLStyleElement}
 * @param {string} url
 * @param {cssom.CSSStyleSheet} sheet
 * @see http://dev.w3.org/csswg/cssom/#requirements-on-user-agents-implementing0
 */
function fetchStylesheet(url, sheet) {
  resourceLoader.load(this, url, data => {
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

function refreshStyleSheet(el) {
  if (el.type && el.type !== "text/css") {
    return;
  }

  if (!el.ownerDocument.contains(el)) {
    return;
  }

  let content = "";
  for (const child of domSymbolTree.childrenIterator(el)) {
    if (child.nodeType === NODE_TYPE.TEXT_NODE) {
      content += child.nodeValue;
    }
  }

  evaluateStylesheet.call(el, content, el.sheet, el._ownerDocument.URL);
}

class HTMLStyleElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.addEventListener("DOMSubtreeModified", function () {
      refreshStyleSheet(idlUtils.implForWrapper(this));
    });
    this.addEventListener("DOMCharacterDataModified", function () {
      refreshStyleSheet(idlUtils.implForWrapper(this));
    });
  }

  _attach() {
    super._attach();
    this.ownerDocument.styleSheets.push(this.sheet);

    refreshStyleSheet(this);
  }

  _detach() {
    const idx = this.ownerDocument.styleSheets.indexOf(this.sheet);
    if (idx !== -1) {
      this.ownerDocument.styleSheets.splice(idx, 1);
    }

    super._detach();
  }
}

idlUtils.mixin(HTMLStyleElementImpl.prototype, LinkStyleImpl.prototype);

module.exports = {
  implementation: HTMLStyleElementImpl
};
