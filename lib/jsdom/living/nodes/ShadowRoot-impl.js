"use strict";

const { mixin } = require("../../utils");

const DocumentFragment = require("./DocumentFragment-impl").implementation;
const DocumentOrShadowRootImpl = require("./DocumentOrShadowRoot-impl").implementation;
const InnerHTMLImpl = require("../domparsing/InnerHTML-impl").implementation;
const { fragmentSerialization } = require("../domparsing/serialization");

class ShadowRootImpl extends DocumentFragment {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    const { mode, delegatesFocus, serializable, clonable } = privateData;
    this._mode = mode;
    this._delegatesFocus = delegatesFocus;
    this._serializable = serializable;
    this._clonable = clonable;
    this._availableToElementInternals = false;
    this._isConnected = privateData.host._isConnected;
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

  get delegatesFocus() {
    return this._delegatesFocus;
  }

  get serializable() {
    return this._serializable;
  }

  get clonable() {
    return this._clonable;
  }

  get host() {
    return this._host;
  }

  // https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-shadowroot-gethtml
  getHTML(options) {
    return fragmentSerialization(this, {
      outer: false,
      requireWellFormed: true,
      globalObject: this._globalObject,
      serializableShadowRoots: options.serializableShadowRoots,
      shadowRoots: options.shadowRoots,
    });
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
