"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { HTML_NS } = require("../helpers/namespaces");

class HTMLOptGroupElementImpl extends HTMLElementImpl {
  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && localName === "disabled" && (oldValue === null || value === null)) {
      const select = this.parentNode;
      if (select !== null && select._localName === "select" && select._namespaceURI === HTML_NS) {
        select._askedForAReset();
      }
    }
  }
}

module.exports = {
  implementation: HTMLOptGroupElementImpl,
};
