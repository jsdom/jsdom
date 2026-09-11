"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const NODE_TYPE = require("../node-type");
const { stripAndCollapseASCIIWhitespace } = require("../helpers/strings");
const { domSymbolTree } = require("../helpers/internal-constants");
const { HTML_NS, SVG_NS } = require("../helpers/namespaces");
const { closest } = require("../helpers/traversal");
const { formOwner } = require("../helpers/form-controls");

class HTMLOptionElementImpl extends HTMLElementImpl {
  #cachedNearestAncestorSelect = null;

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    // whenever selectedness is set to true, make sure all
    // other options set selectedness to false
    this._selectedness = false;
    this._dirtyness = false;
  }

  _insertionSteps() {
    this.#updateNearestAncestorSelect();
  }

  _removingSteps(isSubtreeRoot, oldAncestor) {
    super._removingSteps(isSubtreeRoot, oldAncestor);
    this.#updateNearestAncestorSelect();
  }

  // https://html.spec.whatwg.org/multipage/form-elements.html#update-an-option%27s-nearest-ancestor-select
  #updateNearestAncestorSelect() {
    const oldSelect = this.#cachedNearestAncestorSelect;
    const newSelect = this.#selectNode;
    if (oldSelect !== newSelect) {
      if (oldSelect !== null) {
        oldSelect._askedForAReset();
      }
      if (newSelect !== null) {
        let canSkipReset = false;
        if (domSymbolTree.parent(this) === newSelect && !this._selectedness) {
          const { firstElementChild } = newSelect;
          // Adding an unselected direct child cannot change an already-selected first option.
          canSkipReset = firstElementChild._localName === "option" && firstElementChild._selectedness;
        }
        if (!canSkipReset) {
          newSelect._askedForAReset();
        }
      }
    }
    this.#cachedNearestAncestorSelect = newSelect;
  }

  #removeOtherSelectedness() {
    // Remove the selectedness flag from all other options in this select
    const select = this.#selectNode;

    if (select && !select.hasAttributeNS(null, "multiple")) {
      for (const option of select.options) {
        if (option !== this) {
          option._selectedness = false;
        }
      }
    }
  }

  #askForAReset() {
    const select = this.#selectNode;
    if (select) {
      select._askedForAReset();
    }
  }

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && !this._dirtyness && localName === "selected") {
      this._selectedness = this.hasAttributeNS(null, "selected");
      if (this._selectedness) {
        this.#removeOtherSelectedness();
      }
      this.#askForAReset();
    }
  }

  get #selectNode() {
    let select = domSymbolTree.parent(this);
    if (!select) {
      return null;
    }

    if (select._localName !== "select") {
      select = domSymbolTree.parent(select);
      if (!select || select._localName !== "select") {
        return null;
      }
    }
    return select;
  }

  get form() {
    return formOwner(this);
  }

  get text() {
    return stripAndCollapseASCIIWhitespace(childTextContentExcludingDescendantsOfScript(this));
  }
  set text(value) {
    this.textContent = value;
  }

  // https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-value
  _getValue() {
    if (this.hasAttributeNS(null, "value")) {
      return this.getAttributeNS(null, "value");
    }

    return this.text;
  }

  get value() {
    return this._getValue();
  }
  set value(value) {
    this.setAttributeNS(null, "value", value);
  }

  get index() {
    const select = closest(this, "select");
    if (select === null) {
      return 0;
    }

    return select.options.indexOf(this);
  }

  get selected() {
    return this._selectedness;
  }
  set selected(s) {
    this._dirtyness = true;
    this._selectedness = Boolean(s);

    // Invalidate before both operations so the select's reset cache is stale and they can share the refreshed
    // `options` collection.
    this._invalidateCaches();

    if (this._selectedness) {
      this.#removeOtherSelectedness();
    }
    this.#askForAReset();
  }

  get label() {
    if (this.hasAttributeNS(null, "label")) {
      return this.getAttributeNS(null, "label");
    }

    return this.text;
  }
  set label(value) {
    this.setAttributeNS(null, "label", value);
  }
}

function childTextContentExcludingDescendantsOfScript(root) {
  let text = "";
  for (const child of domSymbolTree.childrenIterator(root)) {
    if (child._localName === "script" && (child._namespaceURI === HTML_NS || child._namespaceURI === SVG_NS)) {
      continue;
    }

    if (child.nodeType === NODE_TYPE.TEXT_NODE || child.nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
      text += child.nodeValue;
    } else {
      text += childTextContentExcludingDescendantsOfScript(child);
    }
  }
  return text;
}

module.exports = {
  implementation: HTMLOptionElementImpl
};
