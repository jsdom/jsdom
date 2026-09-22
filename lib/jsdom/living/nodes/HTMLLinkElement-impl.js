"use strict";
const DOMTokenList = require("../../../generated/idl/DOMTokenList");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const idlUtils = require("../../../generated/idl/utils");
const { fetchStyleSheet, fetchStyleSheetImports, addStyleSheet, removeStyleSheet } =
  require("../css/helpers/stylesheets");
const whatwgURL = require("whatwg-url");
const { fireAnEvent } = require("../helpers/events");
const { reportResourceError } = require("../helpers/resource-errors");
const { linkAbortController } = require("../helpers/abort-controller");

// Important reading: "appropriate times to obtain the resource" in
// https://html.spec.whatwg.org/multipage/links.html#link-type-stylesheet

class HTMLLinkElementImpl extends HTMLElementImpl {
  #fetchController = null;
  #parserDocument = null;
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this.sheet = null;
  }

  // Call after setting the token's attributes: eligibility depends on being a stylesheet when created.
  // https://html.spec.whatwg.org/multipage/semantics.html#contributes-a-script-blocking-style-sheet
  _markAsParserInserted(document) {
    if (isExternalResourceLink(this)) {
      this.#parserDocument = document;
    }
  }

  get relList() {
    if (this._relList === undefined) {
      this._relList = DOMTokenList.createImpl(this._globalObject, [], {
        element: this,
        attributeLocalName: "rel",
        supportedTokens: new Set(["stylesheet"])
      });
    }
    return this._relList;
  }

  _insertionSteps() {
    this.#updateStyleSheet();
  }

  _removingSteps(isSubtreeRoot, oldAncestor) {
    super._removingSteps(isSubtreeRoot, oldAncestor);

    if (this.#fetchController !== null) {
      this.#fetchController.abort();
    }

    if (this.sheet) {
      removeStyleSheet(this.sheet, this);
    }
  }

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && (localName === "href" || localName === "rel")) { // TODO crossorigin="" or type=""
      this.#updateStyleSheet();
    }

    if (namespace === null && localName === "rel" && this._relList !== undefined) {
      this._relList.attrModified();
    }
  }

  // https://html.spec.whatwg.org/multipage/links.html#link-type-stylesheet
  #updateStyleSheet() {
    if (this.#fetchController !== null) {
      this.#fetchController.abort();
    }

    if (!isExternalResourceLink(this)) {
      if (this.sheet) {
        removeStyleSheet(this.sheet, this);
      }
      return;
    }
    if (!this.isConnected || !this._ownerDocument._defaultView) {
      return;
    }
    const href = this.getAttributeNS(null, "href");
    if (href === "") {
      return;
    }
    const url = this._ownerDocument.encodingParseAURL(href);
    if (url !== null) {
      this.#fetchAndProcessStyleSheet(whatwgURL.serializeURL(url));
    }
  }

  async #fetchAndProcessStyleSheet(url) {
    const document = this._ownerDocument;
    if (!document._defaultView._settings.loadSubresources) {
      return;
    }
    const controller = this.#fetchController = new AbortController();
    const unlink = linkAbortController(controller, document._fetchSignal);
    const { signal } = controller;
    const stopDelayingLoadEvent = document._delayLoadEvent();
    // https://html.spec.whatwg.org/multipage/semantics.html#contributes-a-script-blocking-style-sheet
    // TODO: account for media matching and alternate/disabled style sheets.
    const stopBlockingScripts = this.#parserDocument === document && this.getRootNode() === document ?
      document._addScriptBlockingStyleSheet(this) :
      () => {};
    try {
      const sheet = await fetchStyleSheet(this, url, signal);
      signal.throwIfAborted();
      if (this.sheet) {
        removeStyleSheet(this.sheet, this);
      }
      addStyleSheet(sheet, this);
      await fetchStyleSheetImports(sheet, this, signal, new Set([sheet.href]));
      if (!signal.aborted) {
        fireAnEvent("load", this);
      }
    } catch (error) {
      if (!signal.aborted) {
        fireAnEvent("error", this);
        reportResourceError(this, url, error);
      }
    } finally {
      unlink();
      if (this.#fetchController === controller) {
        this.#fetchController = null;
      }
      stopBlockingScripts();
      stopDelayingLoadEvent();
    }
  }
}

module.exports = {
  implementation: HTMLLinkElementImpl
};

function isExternalResourceLink(el) {
  // for our purposes, only stylesheets can be external resource links
  const wrapper = idlUtils.wrapperForImpl(el);
  if (!/(?:[ \t\n\r\f]|^)stylesheet(?:[ \t\n\r\f]|$)/i.test(wrapper.rel)) {
    // rel is a space-separated list of tokens, and the original rel types
    // are case-insensitive.
    return false;
  }

  return el.hasAttributeNS(null, "href");
}
