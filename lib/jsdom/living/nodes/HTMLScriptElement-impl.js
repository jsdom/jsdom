"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const resourceLoader = require("../../browser/resource-loader");
const internalConstants = require("../helpers/internal-constants");
const domSymbolTree = internalConstants.domSymbolTree;

class HTMLScriptElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);
    this.addEventListener("DOMNodeInsertedIntoDocument", () => {
      if (this.src) {
        resourceLoader.load(this, this.src, this._eval);
      } else {
        resourceLoader.enqueue(this, this._ownerDocument.URL, this._eval)(null, this.text);
      }
    });
  }

  _eval(text, filename) {
    if (this._ownerDocument.implementation._hasFeature("ProcessExternalResources", "script") &&
        this.language && this._core.languageProcessors[this.language]) {
      this._ownerDocument._writeAfterElement = this;
      this._core.languageProcessors[this.language](this, text, filename);
      delete this._ownerDocument._writeAfterElement;
    }
  }

  get language() {
    const type = this.type || "text/javascript";
    return type.split("/").pop().toLowerCase();
  }

  get text() {
    let text = "";
    for (const child of domSymbolTree.childrenIterator(this)) {
      text += child.nodeValue;
    }
    return text;
  }

  set text(text) {
    let child = domSymbolTree.firstChild(this);
    while (child) {
      this.removeChild(child);
      child = domSymbolTree.firstChild(this);
    }
    this.appendChild(this._ownerDocument.createTextNode(text));
  }

  get src() {
    return resourceLoader.resolveResourceUrl(this._ownerDocument, this.getAttribute("src"));
  }

  set src(V) {
    this.setAttribute("src", V);
  }
}

module.exports = {
  implementation: HTMLScriptElementImpl
};
