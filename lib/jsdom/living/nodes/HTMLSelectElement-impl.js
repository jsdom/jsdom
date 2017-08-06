"use strict";

const conversions = require("webidl-conversions");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const NODE_TYPE = require("../node-type");
const HTMLCollection = require("../generated/HTMLCollection");
const HTMLOptionsCollection = require("../generated/HTMLOptionsCollection");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const descendantsByHTMLLocalName = require("../helpers/traversal").descendantsByHTMLLocalName;
const closest = require("../helpers/traversal").closest;

class HTMLSelectElementImpl extends HTMLElementImpl {
  _formReset() {
    for (const option of this.options) {
      option._selectedness = option.hasAttribute("selected");
      option._dirtyness = false;
    }
    this._askedForAReset();
  }

  _askedForAReset() {
    if (this.hasAttribute("multiple")) {
      return;
    }

    const selected = this.options.filter(opt => opt._selectedness);

    // size = 1 is default if not multiple
    if ((!this.size || this.size === 1) && !selected.length) {
      // select the first option that is not disabled
      for (const option of this.options) {
        let disabled = option.hasAttribute("disabled");
        const parentNode = domSymbolTree.parent(option);
        if (parentNode &&
            parentNode.nodeName.toUpperCase() === "OPTGROUP" &&
            parentNode.hasAttribute("disabled")) {
          disabled = true;
        }

        if (!disabled) {
          // (do not set dirty)
          option._selectedness = true;
          break;
        }
      }
    } else if (selected.length >= 2) {
      // select the last selected option
      selected.forEach((option, index) => {
        option._selectedness = index === selected.length - 1;
      });
    }
  }

  _descendantAdded(parent, child) {
    if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
      this._askedForAReset();
    }

    super._descendantAdded.apply(this, arguments);
  }

  _descendantRemoved(parent, child) {
    if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
      this._askedForAReset();
    }

    super._descendantRemoved.apply(this, arguments);
  }

  _attrModified(name) {
    if (name === "multiple" || name === "size") {
      this._askedForAReset();
    }
    super._attrModified.apply(this, arguments);
  }

  get options() {
    return HTMLOptionsCollection.createImpl([], {
      element: this,
      query: () => descendantsByHTMLLocalName(this, "option")
    });
  }

  get length() {
    return this.options.length;
  }

  get selectedOptions() {
    return HTMLCollection.createImpl([], {
      element: this,
      query: () => domSymbolTree.treeToArray(this, {
        filter: node => node._localName === "option" && node._selectedness === true
      })
    });
  }

  get selectedIndex() {
    for (let i = 0; i < this.options.length; i++) {
      if (this.options.item(i)._selectedness) {
        return i;
      }
    }
    return -1;
  }

  set selectedIndex(index) {
    for (let i = 0; i < this.options.length; i++) {
      this.options.item(i).selected = i === index;
    }
  }

  get value() {
    let i = this.selectedIndex;
    if (this.options.length && (i === -1)) {
      i = 0;
    }
    if (i === -1) {
      return "";
    }
    return this.options.item(i).value;
  }

  set value(val) {
    for (const option of this.options) {
      if (option.value === val) {
        option._selectedness = true;
        option._dirtyness = true;
      } else {
        option._selectedness = false;
      }
    }
  }

  get form() {
    return closest(this, "form");
  }

  get type() {
    return this.hasAttribute("multiple") ? "select-multiple" : "select-one";
  }

  add(opt, before) {
    if (before) {
      this.insertBefore(opt, before);
    } else {
      this.appendChild(opt);
    }
  }

  remove(index) {
    if (index >= 0 && index < this.options.length) {
      const el = this.options.item(index);
      domSymbolTree.parent(el).removeChild(el);
    }
  }

  get size() {
    if (!this.hasAttribute("size")) {
      return 0;
    }
    const size = conversions["unsigned long"](this.getAttribute("size"));
    if (isNaN(size)) {
      return 0;
    }
    return size;
  }

  set size(V) {
    this.setAttribute("size", V);
  }
}

module.exports = {
  implementation: HTMLSelectElementImpl
};
