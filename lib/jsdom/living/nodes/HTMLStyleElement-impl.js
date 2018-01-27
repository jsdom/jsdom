"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { removeStylesheet, createStylesheet } = require("../helpers/stylesheets");
const { documentBaseURL } = require("../helpers/document-base-url");
const { childTextContent } = require("../helpers/text");
const { asciiCaseInsensitiveMatch } = require("../helpers/strings");

class HTMLStyleElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.sheet = null;
    this._closeTagHasBeenSeen = false;
    this._parserInserted = false; // updated by the parser
  }

  _attach() {
    super._attach();
    this._updateAStyleBlock();
  }

  _detach() {
    super._detach();
    this._updateAStyleBlock();
  }

  _childTextContentChangeSteps() {
    this._updateAStyleBlock();
    super._childTextContentChangeSteps();
  }

  _poppedOffStackOfOpenElements() {
    this._closeTagHasBeenSeen = true;
    this._updateAStyleBlock();
  }

  _updateAStyleBlock() {
    if (this._parserInserted && !this._closeTagHasBeenSeen) {
      return;
    }

    if (this.sheet) {
      removeStylesheet(this.sheet, this);
    }

    if (!this._attached) {
      return;
    }

    const type = this.getAttribute("type");
    if (type !== null && type !== "" && !asciiCaseInsensitiveMatch(type, "text/css")) {
      return;
    }

    // Not implemented: CSP

    const content = childTextContent(this);
    // Not implemented: a bunch of other state, e.g. title/media attributes
    createStylesheet(content, this, documentBaseURL(this._ownerDocument));
  }
}

module.exports = {
  implementation: HTMLStyleElementImpl
};
