"use strict";
const { mixin } = require("../../utils");
const SVGElementImpl = require("./SVGElement-impl").implementation;
const LinkStyleImpl = require("./LinkStyle-impl").implementation;
const { domSymbolTree } = require("../helpers/internal-constants");
const NODE_TYPE = require("../node-type");
const { evaluateStylesheet } = require("../helpers/stylesheets");
const { documentBaseURL } = require("../helpers/document-base-url");

class SVGStyleElementImpl extends SVGElementImpl {
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

    evaluateStylesheet(this, content, this.sheet, documentBaseURL(this._ownerDocument));

    super._attach();
  }
}

mixin(SVGStyleElementImpl.prototype, LinkStyleImpl.prototype);

module.exports = {
  implementation: SVGStyleElementImpl
};
