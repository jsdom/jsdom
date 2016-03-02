"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const idlUtils = require("../generated/utils");

const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const closest = require("../helpers/traversal").closest;

class HTMLOptionElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    // whenever selectedness is set to true, make sure all
    // other options set selectedness to false
    this._selectedness = false;
    this._dirtyness = false;
  }
  _removeOtherSelectedness() {
    // Remove the selectedness flag from all other options in this select
    const select = this._selectNode;

    if (select && !select.multiple) {
      const o = select.options;
      for (let i = 0; i < o.length; i++) {
        const option = idlUtils.implForWrapper(o[i]);
        if (option !== this) {
          option._selectedness = false;
        }
      }
    }
  }
  _askForAReset() {
    const select = this._selectNode;
    if (select) {
      select._askedForAReset();
    }
  }
  _attrModified(name) {
    if (!this._dirtyness && name === "selected") {
      const wrapper = idlUtils.wrapperForImpl(this);
      this._selectedness = wrapper.defaultSelected;
      if (this._selectedness) {
        this._removeOtherSelectedness();
      }
      this._askForAReset();
    }
    super._attrModified.apply(this, arguments);
  }
  get _selectNode() {
    let select = domSymbolTree.parent(this);
    if (!select) {
      return null;
    }

    if (select.nodeName.toUpperCase() !== "SELECT") {
      select = domSymbolTree.parent(select);
      if (!select || select.nodeName.toUpperCase() !== "SELECT") {
        return null;
      }
    }
    return select;
  }
  get form() {
    return closest(this, "form");
  }
  get text() {
    // TODO this is wrong
    return this.innerHTML;
  }
  set text(V) {
    this.textContent = V;
  }

  get value() {
    return (this.hasAttribute("value")) ? this.getAttribute("value") : this.innerHTML;
  }
  set value(val) {
    this.setAttribute("value", val);
  }
  get index() {
    const select = closest(this, "select");
    if (select === null) {
      return 0;
    }

    return Array.prototype.indexOf.call(select.options, idlUtils.wrapperForImpl(this));
  }
  get selected() {
    return this._selectedness;
  }
  set selected(s) {
    this._dirtyness = true;
    this._selectedness = Boolean(s);
    if (this._selectedness) {
      this._removeOtherSelectedness();
    }
    this._askForAReset();
  }

  // TODO this is quite wrong
  get label() {
    if (this.hasAttribute("label")) {
      return this.getAttribute("label");
    }
    const select = this._selectNode;
    if (select) {
      return select.getAttribute("label");
    }
  }

  set label(V) {
    const select = this._selectNode;
    if (select) {
      select.setAttribute("label", V);
    }
  }
}

module.exports = {
  implementation: HTMLOptionElementImpl
};
