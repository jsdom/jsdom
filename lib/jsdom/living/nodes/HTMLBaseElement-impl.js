"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const idlUtils = require("../generated/utils");

const URL = require("../../utils").URL;
const whatwgUrl = require("whatwg-url-compat");
const documentBaseURL = require("../helpers/document-base-url").documentBaseURL;
const fallbackBaseURL = require("../helpers/document-base-url").fallbackBaseURL;

function reparseAnchors(doc) {
  const anchors = doc.getElementsByTagName("a");
  for (let i = 0; i < anchors.length; ++i) {
    whatwgUrl.reparse(idlUtils.implForWrapper(anchors[i]));
  }
}

class HTMLBaseElement extends HTMLElementImpl {
  get href() {
    if (!this.hasAttribute("href")) {
      return documentBaseURL(this._ownerDocument);
    }

    const fbbu = fallbackBaseURL(this._ownerDocument);
    const url = this.getAttribute("href");

    try {
      return new URL(url, fbbu).href;
    } catch (e) {
      return "";
    }
  }

  set href(value) {
    this.setAttribute("href", String(value));
  }

  _attrModified(name, value, oldVal) {
    super._attrModified.call(this, name, value, oldVal);
    if (name === "href") {
      reparseAnchors(this._ownerDocument);
    }
  }

  _detach() {
    super._detach.call(this);

    reparseAnchors(this._ownerDocument);
  }

  _attach() {
    super._attach.call(this);

    reparseAnchors(this._ownerDocument);
  }
}

module.exports = {
  implementation: HTMLBaseElement
};
