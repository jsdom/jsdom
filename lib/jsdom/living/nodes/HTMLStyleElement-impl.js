"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { evaluateStylesheet } = require("../helpers/stylesheets");
const { documentBaseURL } = require("../helpers/document-base-url");
const { childTextContent } = require("../helpers/text");

class HTMLStyleElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.sheet = null;
  }

  _childTextContentChangeSteps() {
    if (this.type && this.type !== "text/css") {
      return;
    }

    const content = childTextContent(this);
    evaluateStylesheet(this, content, documentBaseURL(this._ownerDocument));
  }
}

module.exports = {
  implementation: HTMLStyleElementImpl
};
