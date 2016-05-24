"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const whatwgURL = require("whatwg-url");
const fallbackBaseURL = require("../helpers/document-base-url").fallbackBaseURL;

class HTMLBaseElement extends HTMLElementImpl {
  get href() {
    const document = this._ownerDocument;

    const url = this.hasAttribute("href") ? this.getAttribute("href") : "";

    try {
      return whatwgURL.serializeURL(whatwgURL.parseURL(url, {
        baseURL: fallbackBaseURL(document)
      }));
    } catch (e) {
      return url;
    }
  }

  set href(value) {
    this.setAttribute("href", value);
  }
}

module.exports = {
  implementation: HTMLBaseElement
};
