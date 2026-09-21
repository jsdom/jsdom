"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { addStyleSheet, removeStyleSheet, createStyleSheetForElement, fetchStyleSheetImports } =
  require("../css/helpers/stylesheets");
const { childTextContent } = require("../helpers/text");
const { asciiCaseInsensitiveMatch } = require("../helpers/strings");
const { fireAnEvent } = require("../helpers/events");
const { linkAbortController } = require("../helpers/abort-controller");

class HTMLStyleElementImpl extends HTMLElementImpl {
  #fetchController = null;
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this.sheet = null;
    this._parserDocument = null;
    this._isOnStackOfOpenElements = false;
  }

  get disabled() {
    return this.sheet?.disabled ?? false;
  }

  set disabled(value) {
    if (this.sheet) {
      this.sheet.disabled = value;
    }
  }

  _insertionSteps() {
    if (!this._isOnStackOfOpenElements) {
      this.#updateAStyleBlock();
    }
  }

  _removingSteps(isSubtreeRoot, oldAncestor) {
    super._removingSteps(isSubtreeRoot, oldAncestor);

    if (!this._isOnStackOfOpenElements) {
      this.#updateAStyleBlock();
    }
  }

  _childrenChangedSteps() {
    super._childrenChangedSteps();

    // This guard is not required by the spec, but should be unobservable (since you can't run script during the middle
    // of parsing a <style> element) and saves a bunch of unnecessary work.
    if (!this._isOnStackOfOpenElements) {
      this.#updateAStyleBlock();
    }
  }

  _poppedOffStackOfOpenElements() {
    this._isOnStackOfOpenElements = false;
    this.#updateAStyleBlock();
  }

  _pushedOnStackOfOpenElements() {
    this._isOnStackOfOpenElements = true;
  }

  #updateAStyleBlock() {
    if (this.#fetchController !== null) {
      this.#fetchController.abort();
    }
    if (this.sheet) {
      removeStyleSheet(this.sheet, this);
    }

    // Browsing-context connected, per https://github.com/whatwg/html/issues/4547
    if (!this.isConnected || !this._ownerDocument._defaultView) {
      return;
    }

    const type = this.getAttributeNS(null, "type");
    if (type !== null && type !== "" && !asciiCaseInsensitiveMatch(type, "text/css")) {
      return;
    }

    // Not implemented: CSP

    const content = childTextContent(this);
    const createdSheet = createStyleSheetForElement(content, this);
    addStyleSheet(createdSheet, this);
    this.#fetchImports(createdSheet);
  }

  async #fetchImports(sheet) {
    const document = this._ownerDocument;
    const documentSignal = document._fetchSignal;
    const controller = this.#fetchController = new AbortController();
    const unlink = linkAbortController(controller, documentSignal);
    const { signal } = controller;
    const stopDelayingLoadEvent = document._delayLoadEvent();
    const complete = Promise.withResolvers();
    const imports = fetchStyleSheetImports(sheet, this, signal);
    // https://html.spec.whatwg.org/multipage/semantics.html#contributes-a-script-blocking-style-sheet
    // TODO: account for media matching and disabled style sheets.
    if (imports !== null && this._parserDocument === document && this.getRootNode() === document) {
      document._scriptBlockingStyleSheets.set(this, complete.promise);
    }
    try {
      try {
        if (imports !== null) {
          await imports;
        }
        if (signal.aborted) {
          return;
        }
      } finally {
        unlink();
        if (this.#fetchController === controller) {
          this.#fetchController = null;
        }
      }
      // Once processing completes, subsequent style-block mutations do not cancel its queued event.
      // A block without imports has no fetch for `window.stop()` to cancel.
      await this._globalObject._document._queueATask(() => {
        fireAnEvent("load", this);
      }, { signal: imports === null ? undefined : documentSignal });
    } finally {
      if (document._scriptBlockingStyleSheets.get(this) === complete.promise) {
        document._scriptBlockingStyleSheets.delete(this);
      }
      complete.resolve();
      stopDelayingLoadEvent();
    }
  }
}

module.exports = {
  implementation: HTMLStyleElementImpl
};
