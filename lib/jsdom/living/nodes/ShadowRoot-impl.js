"use strict";

const { fragmentSerialization } = require("../domparsing/serialization.js");

const { setInnerHTML } = require("../helpers/html");
const { HTML_NS } = require("../helpers/namespaces");
const { getRoot } = require("../helpers/shadow-dom");

const DocumentFragment = require("./DocumentFragment-impl").implementation;

class ShadowRootImpl extends DocumentFragment {
  constructor(args, privateData) {
    super(args, privateData);

    const { mode } = privateData;
    this._mode = mode;
  }

  _getTheParent(event) {
    if (!event.composed && this === getRoot(event._path[0].item)) {
      return null;
    }

    return this._host;
  }

  get mode() {
    return this._mode;
  }

  get host() {
    return this._host;
  }

  get innerHTML() {
    return fragmentSerialization(this, { requireWellFormed: true });
  }

  set innerHTML(html) {
    if (html === null) {
      html = "";
    }

    setInnerHTML(this._ownerDocument, this, html);
  }

  // ShadowRoot doesn't have a namespace URI per say. However the namespaceURI is used by
  // parse5 to decide how to parse the HTML content when calling innerHTML. In order to get
  // the expected behavior, the namespace URI has been added here.
  get namespaceURI() {
    return HTML_NS;
  }
}

module.exports = {
  implementation: ShadowRootImpl
};
