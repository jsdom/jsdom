"use strict";

const HTMLMediaElementImpl = require("./HTMLMediaElement-impl").implementation;

const resourceLoader = require("../../browser/resource-loader");

class HTMLVideoElementImpl extends HTMLMediaElementImpl {
  get poster() {
    return resourceLoader.resolveResourceUrl(this._ownerDocument, this.getAttribute("poster"));
  }

  set poster(value) {
    this.setAttribute("src", value);
  }
}

module.exports = {
  implementation: HTMLVideoElementImpl
};
