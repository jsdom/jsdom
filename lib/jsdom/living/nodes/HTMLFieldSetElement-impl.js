"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

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

class HTMLFieldSetElementImpl extends HTMLElementImpl {
  get form() {
    return closest(this, "FORM");
  }
}

module.exports = {
  implementation: HTMLFieldSetElementImpl
};
