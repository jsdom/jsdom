"use strict";
const StyleSheetList = require("../../../generated/idl/StyleSheetList.js");
const DOMException = require("../../../generated/idl/DOMException.js");
const { observableArraySet, observableArrayDelete } = require("../../../generated/idl/utils.js");
const NODE_TYPE = require("../node-type");
const { retarget } = require("../helpers/shadow-dom");

class DocumentOrShadowRootImpl {
  get adoptedStyleSheets() {
    this._adoptedStyleSheets ??= [];
    return this._adoptedStyleSheets;
  }

  [observableArraySet("adoptedStyleSheets")](sheet) {
    if (!sheet._constructed || sheet._document !== this._ownerDocument) {
      throw DOMException.create(this._globalObject, [
        "Only constructed stylesheets from the same document can be adopted.",
        "NotAllowedError"
      ]);
    }
    this._ownerDocument._styleSheetScopes.add(this);
    this._ownerDocument._clearStyleSheetCache();
  }

  [observableArrayDelete("adoptedStyleSheets")]() {
    this._ownerDocument._clearStyleSheetCache();
  }

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
