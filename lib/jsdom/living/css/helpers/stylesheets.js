"use strict";
const { legacyHookDecode } = require("@exodus/bytes/encoding.js");
const whatwgURL = require("whatwg-url");
const CSSStyleSheet = require("../../../../generated/idl/CSSStyleSheet.js");
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const { parseStyleSheet } = require("../parse/parser.js");
const { replaceRules } = require("../utils/cssom.js");
const { linkAbortController } = require("../../helpers/abort-controller.js");
const { fetchCollected } = require("../../../browser/resources/jsdom-dispatcher");
const { reportResourceError } = require("../../helpers/resource-errors");

// https://drafts.csswg.org/cssom/#fetch-a-css-style-sheet
exports.fetchStyleSheet = async (elementImpl, urlString, signal, importRule) => {
  const document = elementImpl._ownerDocument;
  let defaultEncodingLabel = document._encoding;

  if (elementImpl.localName === "link" && elementImpl.hasAttributeNS(null, "charset")) {
    defaultEncodingLabel = elementImpl.getAttributeNS(null, "charset");
  }

  const response = await fetchCollected(document._defaultView._settings.dispatcher, {
    url: urlString, headers: { Referer: document.URL }, signal, element: elementImpl
  });
  signal.throwIfAborted();
  if (!response.ok) {
    throw new Error("Status code: " + response.status);
  }

  const css = legacyHookDecode(response.body, defaultEncodingLabel);
  // TODO: MIME type checking.
  if (importRule) {
    parseImportedStyleSheet(css, importRule);
    return importRule.styleSheet;
  }
  return exports.createStyleSheetForElement(css, elementImpl, urlString);
};

// https://drafts.csswg.org/cssom/#remove-a-css-style-sheet
exports.removeStyleSheet = (sheet, elementImpl) => {
  const root = sheet._ownerRoot;
  root.styleSheets._remove(sheet);
  if (root !== elementImpl._ownerDocument && root.styleSheets.length === 0) {
    elementImpl._ownerDocument._styleSheetScopes.delete(root);
  }
  sheet._ownerRoot = null;

  // Remove the association explicitly; in the spec it's implicit so this step doesn't exist.
  elementImpl.sheet = null;

  elementImpl._ownerDocument._clearStyleSheetCache();

  sheet.parentStyleSheet = null;
  sheet.ownerNode = null;
  sheet.ownerRule = null;
};

// https://drafts.csswg.org/cssom/#create-a-css-style-sheet
exports.createStyleSheetForElement = (cssText, elementImpl, href) => {
  return CSSStyleSheet.createImpl(elementImpl._globalObject, [], {
    location: href,
    ownerNode: elementImpl,
    media: elementImpl.getAttributeNS(null, "media") || "",
    title: elementImpl.getAttributeNS(null, "title"),
    rules: cssText,
    onError: reportParsingError(elementImpl._globalObject, cssText)
  });
};

function parseImportedStyleSheet(cssText, importRule) {
  const sheet = importRule.styleSheet;
  const rules = parseStyleSheet(cssText, sheet, reportParsingError(importRule._globalObject, cssText));
  replaceRules(sheet, rules);
}

function reportParsingError(globalObject, sheetText) {
  return cause => {
    const error = new Error("Could not parse CSS stylesheet", { cause });
    error.sheetText = sheetText;
    error.type = "css-parsing";
    globalObject._settings.virtualConsole.emit("jsdomError", error);
  };
}

// https://drafts.csswg.org/cssom/#add-a-css-style-sheet
exports.addStyleSheet = (sheet, elementImpl) => {
  sheet._ownerRoot = elementImpl.getRootNode();
  sheet._ownerRoot.styleSheets._add(sheet);
  elementImpl._ownerDocument._styleSheetScopes.add(sheet._ownerRoot);

  // Set the association explicitly; in the spec it's implicit.
  elementImpl.sheet = sheet;

  elementImpl._ownerDocument._clearStyleSheetCache();

  // TODO: title and disabled stuff
};

// https://html.spec.whatwg.org/multipage/semantics.html#contributes-a-script-blocking-style-sheet
// Wait for all imports, including nested imports, before the owning element completes its load.
// HTML's integration of CSS imports with critical subresources is underspecified: https://github.com/whatwg/html/issues/968
// For failed imports, follow Chromium and WebKit: report the failure but let both `link` and `style` fire `load`
// after the remaining imports finish. Firefox fires `error` instead.
exports.fetchStyleSheetImports = (sheet, element, signal, ancestors = new Set()) => {
  const baseURLString = sheet._baseURL;
  const globalObject = element._globalObject;
  const imports = [];
  if (sheet.href !== null) {
    ancestors = new Set(ancestors).add(sheet.href);
  }
  for (const rule of sheet._rules) {
    if (!CSSImportRule.isImpl(rule) || !rule._supports) {
      continue;
    }
    if (rule._promise) {
      imports.push(rule._promise);
      continue;
    }
    let parsed;
    try {
      parsed = new whatwgURL.URL(rule.href, baseURLString);
    } catch (cause) {
      const error = new Error(
        `Could not parse CSS @import URL "${rule.href}" relative to base URL "${baseURLString}"`,
        { cause }
      );
      error.type = "resource-loading";
      error.url = rule.href;
      globalObject._settings.virtualConsole.emit("jsdomError", error);
      continue;
    }
    rule.styleSheet._location = parsed.href;
    rule.styleSheet._baseURL = parsed.href;
    // Fetch media-dependent imports eagerly so later media changes can apply the loaded sheet.
    // Imports with false supports conditions are excluded above and must never be fetched.
    if (!element._ownerDocument._defaultView._settings.loadSubresources || ancestors.has(parsed.href)) {
      continue;
    }
    const controller = rule._controller = new AbortController();
    const unlink = linkAbortController(controller, signal);
    const nextAncestors = new Set(ancestors).add(parsed.href);
    const loaded = exports.fetchStyleSheet(element, parsed.href, controller.signal, rule)
      .then(imported => exports.fetchStyleSheetImports(imported, element, controller.signal, nextAncestors))
      .catch(error => {
        if (!controller.signal.aborted) {
          reportResourceError(element, parsed.href, error);
        }
      })
      .finally(unlink);
    rule._promise = loaded;
    imports.push(loaded);
  }
  return imports.length === 0 ? null : Promise.all(imports);
};
