"use strict";

// CSSOM writes share the document's invalidation path with DOM mutations. Detached stylesheets
// can still be observed through live computed declarations after they are attached again.
exports.invalidateStyle = (globalObject, sheet) => {
  if (sheet) {
    sheet._stylePlan = null;
    while (sheet.parentStyleSheet) {
      sheet = sheet.parentStyleSheet;
    }
  }
  const document = sheet?.ownerNode?._ownerDocument ?? globalObject._document;
  if (document) {
    document._clearStyleSheetCache();
  }
};

exports.getDocumentStyleState = getDocumentStyleState;

// An embedded document depends on its ancestors' styles, including their color schemes.
// Remember generation tokens so an idle child does not retain an obsolete parent cache.
function getDocumentStyleState(document) {
  let parentGeneration = null;
  if (document._parentDocument !== null) {
    parentGeneration = getDocumentStyleState(document._parentDocument).generation;
  }
  let state = document._styleCache;
  if (state === null || state.parentGeneration !== parentGeneration) {
    state = document._styleCache = {
      generation: Symbol("style generation"),
      parentGeneration,
      elements: null,
      styleSheets: null,
      pageColorSchemes: undefined
    };
  }
  return state;
}
