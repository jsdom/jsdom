"use strict";
const whatwgURL = require("whatwg-url");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLBaseElementImpl extends HTMLElementImpl {
  get href() {
    const document = this._ownerDocument;

    const url = this.hasAttributeNS(null, "href") ? this.getAttributeNS(null, "href") : "";
    const parsed = whatwgURL.parseURL(url, { baseURL: document._fallbackBaseURL() });

    if (parsed === null) {
      return url;
    }

    return whatwgURL.serializeURL(parsed);
  }

  set href(value) {
    this.setAttributeNS(null, "href", value);
  }

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && localName === "href") {
      this._ownerDocument._clearBaseURLCache();
    }
  }

  _insertionSteps() {
    this._ownerDocument._clearBaseURLCache();
  }

  _removingSteps(isSubtreeRoot, oldAncestor) {
    super._removingSteps(isSubtreeRoot, oldAncestor);
    this._ownerDocument._clearBaseURLCache();
  }
}

module.exports = {
  implementation: HTMLBaseElementImpl
};
