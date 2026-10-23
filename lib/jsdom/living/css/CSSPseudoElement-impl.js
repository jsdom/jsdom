"use strict";

const CSSPseudoElement = require("../../../generated/idl/CSSPseudoElement.js");
const pseudos = require("./values/pseudos.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const serialize = require("./serialize.js");
// https://drafts.csswg.org/css-pseudo-4/#csspseudoelement
class CSSPseudoElementImpl {
  constructor(globalObject, args, {
    element,
    parent,
    selectorText,
    type
  }) {
    this._globalObject = globalObject;
    this.element = element;
    this.parent = parent;
    this.selectorText = selectorText;
    this.type = type;
  }

  get ownerDocument() {
    return this.element.ownerDocument;
  }

  getRootNode(options) {
    return this.element.getRootNode(options);
  }

  // https://drafts.csswg.org/css-pseudo-4/#dom-csspseudoelement-pseudo
  pseudo(type) {
    const selectors = parser.parsePseudoElementSelectors(type, this._globalObject);
    if (values.isFailure(selectors) || selectors.length !== 1) {
      return null;
    }
    const [selectorText] = selectors;
    const { value, name } = selectorText;
    type = name ?? value;
    if (!pseudos.elements[this.type.slice(2)].elements?.includes(type)) {
      return null;
    }
    return CSSPseudoElement.createImpl(this._globalObject, undefined, {
      element: this.element,
      parent: this,
      selectorText: serialize.serializeComponentValue(selectorText),
      type: `::${type}`
    });
  }
}
exports.implementation = CSSPseudoElementImpl;
