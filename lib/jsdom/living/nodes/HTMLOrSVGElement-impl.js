"use strict";

const conversions = require("webidl-conversions");
const DOMStringMap = require("../../../generated/idl/DOMStringMap");
const { isSummaryForParentDetails } = require("../helpers/details");
const { focusingSteps, unfocusingSteps } = require("../helpers/focusing");
const { HTML_NS, SVG_NS } = require("../helpers/namespaces");

const tabIndexReflectAllowedHTMLElements = new Set([
  "a", "area", "button", "frame", "iframe",
  "input", "object", "select", "textarea"
]);

class HTMLOrSVGElementImpl {
  _initHTMLOrSVGElement() {
    this._tabIndex = 0;
    this._dataset = null;
  }

  get dataset() {
    if (!this._dataset) {
      this._dataset = DOMStringMap.createImpl(this._globalObject, [], { element: this });
    }
    return this._dataset;
  }

  // TODO this should be [Reflect]able if we added default value support to webidl2js's [Reflect]
  get tabIndex() {
    if (!this.hasAttributeNS(null, "tabindex")) {
      if ((this.namespaceURI === HTML_NS && (tabIndexReflectAllowedHTMLElements.has(this._localName) ||
                                             (this._localName === "summary" && isSummaryForParentDetails(this)))) ||
          (this.namespaceURI === SVG_NS && this._localName === "a")) {
        return 0;
      }
      return -1;
    }
    return conversions.long(this.getAttributeNS(null, "tabindex"));
  }

  set tabIndex(value) {
    this.setAttributeNS(null, "tabindex", String(value));
  }

  focus() {
    // TODO: Run the allow focus steps when we implement fully active documents and focus permissions.
    focusingSteps(this);
  }

  blur() {
    unfocusingSteps(this);
  }
}

exports.implementation = HTMLOrSVGElementImpl;
