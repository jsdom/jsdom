"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const documentBaseURL = require("../helpers/document-base-url").documentBaseURL;
const whatwgUrl = require("whatwg-url-compat");
const mixinURLUtils = whatwgUrl.mixinURLUtils;

class HTMLAnchorElement extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);
    mixinURLUtils(this, function getTheBase() {
      return documentBaseURL(this._ownerDocument);
    }, function updateSteps(value) {
      this.setAttribute("href", value);
    });
  }

  _attrModified(name, value, oldVal) {
    if (name === "href") {
      whatwgUrl.setTheInput(this, value);
    }

    super._attrModified(name, value, oldVal);
  }
}

module.exports = {
  implementation: HTMLAnchorElement
};
