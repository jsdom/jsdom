"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const LinkStyleImpl = require("./LinkStyle-impl").implementation;
const idlUtils = require("../generated/utils");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../node-type");
const evaluateStylesheet = require("../helpers/stylesheets").evaluateStylesheet;

class HTMLStyleElementImpl extends HTMLElementImpl {
  _attach() {
    if (this.type && this.type !== "text/css") {
      return;
    }

    let content = "";
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === NODE_TYPE.TEXT_NODE) {
        content += child.nodeValue;
      }
    }

    evaluateStylesheet(this, content, this.sheet, this._ownerDocument.URL);

    super._attach();
  }
}

idlUtils.mixin(HTMLStyleElementImpl.prototype, LinkStyleImpl.prototype);

module.exports = {
  implementation: HTMLStyleElementImpl
};
