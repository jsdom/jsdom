"use strict";
const { legacyHookDecode } = require("@exodus/bytes/encoding.js");
const whatwgURL = require("whatwg-url");
const { parseStyleSheet, parseIntoStyleSheet } = require("./css-parser");
const { fetchCollected } = require("../../../browser/resources/jsdom-dispatcher");
const { reportResourceError } = require("../../helpers/resource-errors");

// https://drafts.csswg.org/cssom/#fetch-a-css-style-sheet
exports.fetchStyleSheet = async (elementImpl, urlString, signal, importRule) => {
  const document = elementImpl._ownerDocument;
  let defaultEncodingLabel = document._encoding;

  if (elementImpl.localName === "link" && elementImpl.hasAttributeNS(null, "charset")) {
    defaultEncodingLabel = elementImpl.getAttributeNS(null, "charset");
  }

  const response = await fetchCollected(document._defaultView._dispatcher, {
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
    document._clearStyleCache();
    return importRule.styleSheet;
  }
  return exports.createStyleSheetForElement(css, elementImpl, urlString);
};

// https://drafts.csswg.org/cssom/#remove-a-css-style-sheet
exports.removeStyleSheet = (sheet, elementImpl) => {
  const { styleSheets } = elementImpl._ownerDocument;
  styleSheets._remove(sheet);

  // Remove the association explicitly; in the spec it's implicit so this step doesn't exist.
  elementImpl.sheet = null;

  elementImpl._ownerDocument._clearStyleCache();

  sheet.parentStyleSheet = null;
  sheet.ownerNode = null;
  sheet.ownerRule = null;
};

// https://drafts.csswg.org/cssom/#create-a-css-style-sheet kinda:
// - Parsing failures are now handled gracefully
// - Like the browser's behaviour, when css-tree encounters invalid CSS
//   it will try its best to ignore the invalid parts without blocking the parsing operations
//   returning a stylesheet with the valid parts only.
exports.createStyleSheetForElement = (cssText, elementImpl, href) => {
  const globalObject = elementImpl._globalObject;

  const sheetImpl = parseStyleSheet(cssText, globalObject, {
    href,
    ownerNode: elementImpl,
    mediaText: elementImpl.getAttributeNS(null, "media") || "",
    title: elementImpl.getAttributeNS(null, "title"),
    onError(err) {
      const error = new Error("Could not parse CSS stylesheet", { cause: err });
      error.sheetText = cssText;
      error.type = "css-parsing";

      globalObject._virtualConsole.emit("jsdomError", error);
    }
  });

  return sheetImpl;
};

function parseImportedStyleSheet(cssText, importRule) {
  const globalObject = importRule._globalObject;

  parseIntoStyleSheet(cssText, globalObject, importRule.styleSheet, err => {
    const error = new Error("Could not parse CSS stylesheet", { cause: err });
    error.sheetText = cssText;
    error.type = "css-parsing";

    globalObject._virtualConsole.emit("jsdomError", error);
  });
}

// https://drafts.csswg.org/cssom/#add-a-css-style-sheet
exports.addStyleSheet = (sheet, elementImpl) => {
  elementImpl._ownerDocument.styleSheets._add(sheet);

  // Set the association explicitly; in the spec it's implicit.
  elementImpl.sheet = sheet;

  elementImpl._ownerDocument._clearStyleCache();

  // TODO: title and disabled stuff
};

// https://html.spec.whatwg.org/multipage/semantics.html#contributes-a-script-blocking-style-sheet
// Wait for all imports, including nested imports, before the owning element completes its load.
// HTML's integration of CSS imports with critical subresources is underspecified: https://github.com/whatwg/html/issues/968
// For failed imports, follow Chromium and WebKit: report the failure but let both `link` and `style` fire `load`
// after the remaining imports finish. Firefox fires `error` instead.
exports.fetchStyleSheetImports = (sheet, element, signal, ancestors = new Set()) => {
  const baseURLString = sheet.href ?? element._ownerDocument.baseURLSerialized();
  const globalObject = element._globalObject;
  const imports = [];
  for (const ruleImpl of sheet.cssRules._list) {
    if (ruleImpl.cssRules) {
      // CSS imports are only valid at the top level.
      continue;
    } else if (ruleImpl.href) {
      // @import rule: fetch the resource and evaluate it.

      // Use `whatwgURL.URL` instead of `whatwgURL.parseURL()` so that we get an error we can use as the `cause` if the
      // URL doesn't parse. (All resource loading errors in jsdom must have `cause`s.)
      let parsed;
      try {
        parsed = new whatwgURL.URL(ruleImpl.href, baseURLString);
      } catch (cause) {
        const error = new Error(
          `Could not parse CSS @import URL "${ruleImpl.href}" relative to base URL "${baseURLString}"`,
          { cause }
        );
        error.type = "resource-loading";
        error.url = ruleImpl.href;
        globalObject._virtualConsole.emit("jsdomError", error);
        continue;
      }

      ruleImpl.styleSheet.href = parsed.href;
      if (!element._ownerDocument._defaultView._loadSubresources) {
        continue;
      }
      // Ignore imports that would create a cycle in the import graph.
      if (ancestors.has(parsed.href)) {
        continue;
      }
      const nextAncestors = new Set(ancestors);
      nextAncestors.add(parsed.href);
      const loaded = exports.fetchStyleSheet(element, parsed.href, signal, ruleImpl)
        .then(imported => exports.fetchStyleSheetImports(imported, element, signal, nextAncestors))
        .catch(error => {
          if (!signal.aborted) {
            reportResourceError(element, parsed.href, error);
          }
        });
      imports.push(loaded);
    }
  }
  return imports.length === 0 ? null : Promise.all(imports);
};
