"use strict";
const fs = require("fs");
const path = require("path");
const { CSSStyleSheet, StyleSheetList } = require("@cdoublev/css");
const NODE_TYPE = require("../node-type");
const { nodeRoot } = require("../helpers/node");
const { retarget } = require("../helpers/shadow-dom");

class DocumentOrShadowRootImpl {
  get activeElement() {
    let candidate = this._ownerDocument._lastFocusedElement || this._ownerDocument.body;
    if (!candidate) {
      return null;
    }
    candidate = retarget(candidate, this);
    if (nodeRoot(candidate) !== this) {
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

  get styleSheets() {
    if (!this._styleSheets) {
      this._styleSheets = StyleSheetList.create(this._globalObject);
    }

    // TODO: each style and link element should register its sheet on creation
    // and remove it on removal.
    return this._styleSheets;
  }

  // Lazy initialization of user and user agent style sheets
  get _userAgentStyleSheet() {
    if (!this.userAgentStyleSheet) {
      const rules = fs.readFileSync(
        path.resolve(__dirname, "../../browser/default-stylesheet.css"),
        { encoding: "utf-8" }
      );
      this.userAgentStyleSheet = CSSStyleSheet.create(this._globalObject, undefined, { rules });
    }
    return this.userAgentStyleSheet;
  }
  get _userStyleSheet() {
    if (!this.userStyleSheet) {
      this.userStyleSheet = CSSStyleSheet.create(this._globalObject, undefined, { rules: "" });
    }
    return this.userStyleSheet;
  }
}

module.exports = {
  implementation: DocumentOrShadowRootImpl
};
