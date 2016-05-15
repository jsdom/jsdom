"use strict";
const cssom = require("cssom");
const normalizeEncoding = require("../helpers/encoding").normalizeEncoding;
const resourceLoader = require("../../browser/resource-loader");
const resolveHref = require("../../utils").resolveHref;

exports.fetchStylesheet = (elementImpl, url, sheet) => {
  let defaultEncoding = elementImpl._ownerDocument._encoding;
  if (elementImpl.localName === "link" && elementImpl.hasAttribute("charset")) {
    defaultEncoding = normalizeEncoding(elementImpl.getAttribute("charset"));
  }

  resourceLoader.load(elementImpl, url, { defaultEncoding }, data => {
    // TODO: MIME type checking?
    exports.evaluateStylesheet(elementImpl, data, sheet, url);
  });
};

exports.evaluateStylesheet = (elementImpl, data, sheet, baseURL) => {
  let newStyleSheet;
  try {
    newStyleSheet = cssom.parse(data);
  } catch (e) {
    if (elementImpl._ownerDocument._defaultView) {
      const error = new Error("Could not parse CSS stylesheet");
      error.detail = data;
      elementImpl._ownerDocument._defaultView._virtualConsole.emit("jsdomError", error);
    }

    elementImpl._ownerDocument.styleSheets.push(sheet);
    return;
  }

  const spliceArgs = newStyleSheet.cssRules;
  spliceArgs.unshift(0, sheet.cssRules.length);
  Array.prototype.splice.apply(sheet.cssRules, spliceArgs);

  scanForImportRules(elementImpl, sheet.cssRules, baseURL);

  elementImpl._ownerDocument.styleSheets.push(sheet);
};

function scanForImportRules(elementImpl, cssRules, baseURL) {
  if (!cssRules) {
    return;
  }

  for (let i = 0; i < cssRules.length; ++i) {
    if (cssRules[i].cssRules) {
      // @media rule: keep searching inside it.
      scanForImportRules(elementImpl, cssRules[i].cssRules, baseURL);
    } else if (cssRules[i].href) {
      // @import rule: fetch the resource and evaluate it.
      // See http://dev.w3.org/csswg/cssom/#css-import-rule
      //     If loading of the style sheet fails its cssRules list is simply
      //     empty. I.e. an @import rule always has an associated style sheet.
      exports.fetchStylesheet(elementImpl, resolveHref(baseURL, cssRules[i].href), elementImpl.sheet);
    }
  }
}
