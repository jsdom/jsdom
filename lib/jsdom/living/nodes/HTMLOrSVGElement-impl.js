"use strict";

const DOMStringMap = require("../../../generated/idl/DOMStringMap");
const { isSummaryForParentDetails } = require("../helpers/details");
const { focusingSteps, unfocusingSteps } = require("../helpers/focusing");
const { HTML_NS, SVG_NS } = require("../helpers/namespaces");
const { parseInteger } = require("../helpers/strings");

const tabIndexReflectAllowedHTMLElements = new Set([
  "a",
  "area",
  "button",
  "frame",
  "iframe",
  "input",
  "object",
  "select",
  "textarea",
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

  // https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
  get tabIndex() {
    const attributeValue = this.getAttributeNS(null, "tabindex");
    if (attributeValue !== null) {
      const parsedValue = parseInteger(attributeValue);
      if (parsedValue !== null && parsedValue >= -2147483648 && parsedValue <= 2147483647) {
        return parsedValue;
      }
    }

    if (
      (this.namespaceURI === HTML_NS &&
        (tabIndexReflectAllowedHTMLElements.has(this._localName) ||
          (this._localName === "summary" && isSummaryForParentDetails(this)))) ||
      (this.namespaceURI === SVG_NS && this._localName === "a")
    ) {
      return 0;
    }
    // The spec also defaults MathML `a` to 0; jsdom does not implement MathMLElement.tabIndex yet.

    return -1;
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
