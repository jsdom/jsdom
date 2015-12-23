"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const resourceLoader = require("../../browser/resource-loader");

class HTMLAreaElementImpl extends HTMLElementImpl {
  get href() {
    return resourceLoader.resolveResourceUrl(this._ownerDocument, this.getAttribute("href"));
  }

  set href(value) {
    this.setAttribute("href", value);
  }
}

module.exports = {
  implementation: HTMLAreaElementImpl
};
