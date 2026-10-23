"use strict";
const StyleSheetList = require("../../../generated/idl/StyleSheetList.js");
const NODE_TYPE = require("../node-type");
const { retarget } = require("../helpers/shadow-dom");

class DocumentOrShadowRootImpl {
  get styleSheets() {
    this._styleSheets ??= StyleSheetList.createImpl(this._globalObject);
    return this._styleSheets;
  }

  get activeElement() {
    let candidate = this._ownerDocument._lastFocusedElement || this._ownerDocument.body;
    if (!candidate) {
      return null;
    }
    candidate = retarget(candidate, this);
    if (candidate.getRootNode() !== this) {
      return null;
    }
    if (candidate.nodeType !== NODE_TYPE.DOCUMENT_NODE) {
      return candidate;
    }
    if (candidate.body !== null) {
      return candidate.body;
    }
    return candidate.documentElement;
  }
}

module.exports = {
  implementation: DocumentOrShadowRootImpl
};
