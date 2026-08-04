"use strict";
const { CSSStyleSheet, StyleSheetList } = require("@cdoublev/css");
const { legacyHookDecode } = require("@exodus/bytes/encoding.js");
const whatwgURL = require("whatwg-url");
const { wrapperForImpl } = require("../../../generated/idl/utils");

// TODO: this should really implement https://html.spec.whatwg.org/multipage/links.html#link-type-stylesheet
// It (and the things it calls) is nowhere close right now.
exports.fetchStyleSheet = (elementImpl, urlString) => {
  const document = elementImpl._ownerDocument;
  let defaultEncodingLabel = document._encoding;
  const resourceLoader = document._resourceLoader;

  if (elementImpl.localName === "link" && elementImpl.hasAttributeNS(null, "charset")) {
    defaultEncodingLabel = elementImpl.getAttributeNS(null, "charset");
  }

  function onStyleSheetLoad(data, response) {
    if (!response.ok) {
      throw new Error("Status code: " + response.status);
    }

    // if the element was detached before the load could finish, don't process the data
    if (!elementImpl._attached) {
      return null;
    }

    // TODO: MIME type checking?
    if (elementImpl.sheet) {
      exports.removeStyleSheet(elementImpl.sheet, elementImpl);
    }

    const url = whatwgURL.parseURL(response.url);
    const sheet = exports.createStyleSheet({
      alternate: Boolean(elementImpl.getAttributeNS(null, "rel")?.includes("alternate")),
      location: urlString,
      originClean: whatwgURL.serializeURLOrigin(url) === document._origin,
      media: elementImpl.getAttributeNS(null, "media"),
      ownerNode: elementImpl,
      rules: legacyHookDecode(data, defaultEncodingLabel),
      title: elementImpl.getAttributeNS(null, "title")
    });

    return exports.scanForImportRules(sheet, elementImpl);
  }

  resourceLoader.fetch(urlString, {
    element: elementImpl,
    onLoad: onStyleSheetLoad
  });
};

// https://drafts.csswg.org/cssom/#remove-a-css-style-sheet
exports.removeStyleSheet = (sheet, elementImpl) => {
  const { _globalObject, _ownerDocument } = elementImpl;
  const styleSheets = StyleSheetList.convert(_globalObject, _ownerDocument.styleSheets)._list;
  const styleSheet = CSSStyleSheet.convert(_globalObject, sheet);
  const index = styleSheets.indexOf(styleSheet);

  if (index >= 0) {
    styleSheets.splice(index, 1);
  }

  // Remove the association explicitly; in the spec it's implicit so this step doesn't exist.
  elementImpl.sheet = null;

  styleSheet.parentStyleSheet = null;
  styleSheet.ownerNode = null;
  styleSheet.ownerRule = null;
};

// https://drafts.csswg.org/cssom/#create-a-css-style-sheet
exports.createStyleSheet = properties => {
  const { ownerNode } = properties;
  const { _globalObject } = ownerNode;

  properties = { ...properties, ownerNode: wrapperForImpl(ownerNode) };

  const sheet = CSSStyleSheet.create(_globalObject, undefined, properties);

  exports.addStyleSheet(sheet, ownerNode);

  return sheet;
};

// https://drafts.csswg.org/cssom/#add-a-css-style-sheet
exports.addStyleSheet = (sheet, elementImpl) => {
  const { _globalObject, _ownerDocument } = elementImpl;
  const styleSheets = StyleSheetList.convert(_globalObject, _ownerDocument.styleSheets)._list;
  const styleSheet = CSSStyleSheet.convert(_globalObject, sheet);

  if (!styleSheets.includes(styleSheet)) {
    styleSheets.push(styleSheet);
  }

  // Set the association explicitly; in the spec it's implicit.
  elementImpl.sheet = sheet;

  // TODO: title and disabled stuff
};

// Tracking in https://github.com/jsdom/jsdom/issues/2124
exports.scanForImportRules = (sheet, elementImpl) => {
  const { _globalObject, _ownerDocument } = elementImpl;
  const sheetImpl = CSSStyleSheet.convert(_globalObject, sheet);
  const promises = [];
  for (const rule of sheetImpl._rules) {
    if (rule.href) {
      _ownerDocument._queue.push(rule._promise);
      promises.push(rule._promise);
    }
  }
  return Promise.all(promises);
};
