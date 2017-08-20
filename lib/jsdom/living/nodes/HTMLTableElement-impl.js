"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const firstChildWithHTMLLocalName = require("../helpers/traversal").firstChildWithHTMLLocalName;
const childrenByHTMLLocalName = require("../helpers/traversal").childrenByHTMLLocalName;
const HTMLCollection = require("../generated/HTMLCollection");
const DOMException = require("../../web-idl/DOMException");

class HTMLTableElementImpl extends HTMLElementImpl {
  get caption() {
    return firstChildWithHTMLLocalName(this, "caption");
  }

  get tHead() {
    return firstChildWithHTMLLocalName(this, "thead");
  }

  get tFoot() {
    return firstChildWithHTMLLocalName(this, "tfoot");
  }

  get rows() {
    if (!this._rows) {
      this._rows = HTMLCollection.createImpl([], {
        element: this,
        query: () => {
          const sections = [];
          if (this.tHead) {
            sections.push(this.tHead);
          }
          sections.push(...childrenByHTMLLocalName(this, "tbody"));
          if (this.tFoot) {
            sections.push(this.tFoot);
          }

          if (sections.length === 0) {
            return childrenByHTMLLocalName(this, "tr");
          }

          const rows = [];
          for (const s of sections) {
            rows.push(...childrenByHTMLLocalName(s, "tr"));
          }
          return rows;
        }
      });
    }
    return this._rows;
  }

  get tBodies() {
    if (!this._tBodies) {
      this._tBodies = HTMLCollection.createImpl([], {
        element: this,
        query: () => childrenByHTMLLocalName(this, "tbody")
      });
    }
    return this._tBodies;
  }

  createTHead() {
    let el = this.tHead;
    if (!el) {
      el = this._ownerDocument.createElement("THEAD");
      this.appendChild(el);
    }
    return el;
  }

  deleteTHead() {
    const el = this.tHead;
    if (el) {
      el.parentNode.removeChild(el);
    }
  }

  createTFoot() {
    let el = this.tFoot;
    if (!el) {
      el = this._ownerDocument.createElement("TFOOT");
      this.appendChild(el);
    }
    return el;
  }

  deleteTFoot() {
    const el = this.tFoot;
    if (el) {
      el.parentNode.removeChild(el);
    }
  }

  createCaption() {
    let el = this.caption;
    if (!el) {
      el = this._ownerDocument.createElement("CAPTION");
      this.appendChild(el);
    }
    return el;
  }

  deleteCaption() {
    const c = this.caption;
    if (c) {
      c.parentNode.removeChild(c);
    }
  }

  insertRow(index) {
    if (index < -1 || index > this.rows.length) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR,
        "Cannot insert a row at an index that is less than -1 or greater than the number of existing rows");
    }

    const tr = this._ownerDocument.createElement("tr");

    if (this.rows.length === 0 && this.tBodies.length === 0) {
      const tBody = this._ownerDocument.createElement("tbody");
      tBody.appendChild(tr);
      this.appendChild(tBody);
    } else if (this.rows.length === 0) {
      const tBody = this.tBodies.item(this.tBodies.length - 1);
      tBody.appendChild(tr);
    } else if (index === -1 || index === this.rows.length) {
      const tSection = this.rows.item(this.rows.length - 1).parentNode;
      tSection.appendChild(tr);
    } else {
      const beforeTR = this.rows.item(index);
      const tSection = beforeTR.parentNode;
      tSection.insertBefore(tr, beforeTR);
    }

    return tr;
  }

  deleteRow(index) {
    if (index === -1) {
      index = this.rows.length - 1;
    }

    if (index < 0 || index >= this.rows.length) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR, `Cannot delete a row at index ${index}, where no row exists`);
    }

    const tr = this.rows.item(index);
    tr.parentNode.removeChild(tr);
  }
}

module.exports = {
  implementation: HTMLTableElementImpl
};
