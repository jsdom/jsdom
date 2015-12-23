"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const resourceLoader = require("../../browser/resource-loader");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;

function closest(e, tagName) {
  tagName = tagName.toUpperCase();
  while (e) {
    if (e.nodeName.toUpperCase() === tagName || (e.tagName && e.tagName.toUpperCase() === tagName)) {
      return e;
    }
    e = domSymbolTree.parent(e);
  }
  return null;
}

class HTMLObjectElementImpl extends HTMLElementImpl {
  get form() {
    return closest(this, "FORM");
  }

  get contentDocument() {
    return null;
  }

  get data() {
    return resourceLoader.resolveResourceUrl(this._ownerDocument, this.getAttribute("data"));
  }

  set data(V) {
    this.setAttribute("data", V);
  }

  get codeBase() {
    return resourceLoader.resolveResourceUrl(this._ownerDocument, this.getAttribute("codebase"));
  }

  set codeBase(V) {
    this.setAttribute("codebase", V);
  }
}

module.exports = {
  implementation: HTMLObjectElementImpl
};
