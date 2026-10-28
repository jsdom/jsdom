"use strict";

const { mixin } = require("../../utils");

const DocumentFragment = require("./DocumentFragment-impl").implementation;
const DocumentOrShadowRootImpl = require("./DocumentOrShadowRoot-impl").implementation;
const InnerHTMLImpl = require("../domparsing/InnerHTML-impl").implementation;

class ShadowRootImpl extends DocumentFragment {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    const { mode } = privateData;
    this._mode = mode;
    this._availableToElementInternals = false;
  }

  _getTheParent(event) {
    if (!event.composed && this === event._path[0].item.getRootNode()) {
      return null;
    }

    return this._host;
  }

  get mode() {
    return this._mode;
  }

  get host() {
    return this._host;
  }

  _adoptingSteps(oldDocument) {
    const document = this._ownerDocument;
    // Preserve sheets when moving between a document and its template contents owner document.
    if (
      oldDocument._associatedInertTemplateDocument !== document &&
      document._associatedInertTemplateDocument !== oldDocument
    ) {
      this.adoptedStyleSheets.length = 0;
    }
    oldDocument._styleSheetScopes.delete(this);
    if (this.adoptedStyleSheets.length > 0) {
      document._styleSheetScopes.add(this);
    }
    oldDocument._clearStyleSheetCache();
    document._clearStyleSheetCache();
  }
}

mixin(ShadowRootImpl.prototype, DocumentOrShadowRootImpl.prototype);
mixin(ShadowRootImpl.prototype, InnerHTMLImpl.prototype);

module.exports = {
  implementation: ShadowRootImpl,
};
