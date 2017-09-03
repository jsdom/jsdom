"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const firstChildWithHTMLLocalName = require("../helpers/traversal").firstChildWithHTMLLocalName;
const childrenByHTMLLocalName = require("../helpers/traversal").childrenByHTMLLocalName;
const HTMLCollection = require("../generated/HTMLCollection");
const DOMException = require("../../web-idl/DOMException");
const NODE_TYPE = require("../node-type");

function tHeadInsertionPoint(table) {
  const iterator = domSymbolTree.childrenIterator(table);
  for (const child of iterator) {
    if (child.nodeType !== NODE_TYPE.ELEMENT_NODE) {
      continue;
    }

    if (child._namespaceURI !== "http://www.w3.org/1999/xhtml" || (child._localName !== "caption" && child._localName !== "colgroup")) {
      return child;
    }
  }

  return null;
}

class HTMLTableElementImpl extends HTMLElementImpl {
  get caption() {
    return firstChildWithHTMLLocalName(this, "caption");
  }

  get tHead() {
    return firstChildWithHTMLLocalName(this, "thead");
  }

  set tHead(value) {
    if (value !== null && value._localName !== "thead") {
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR,
        "Cannot set a non-thead element as a table header");
    }

    const currentHead = this.tHead;
    if (currentHead !== null) {
      this.removeChild(currentHead);
    }

    if (value !== null) {
      const insertionPoint = tHeadInsertionPoint(this);
      this.insertBefore(value, insertionPoint);
    }
  }

  get tFoot() {
    return firstChildWithHTMLLocalName(this, "tfoot");
  }

  set tFoot(value) {
    if (value !== null && value._localName !== "tfoot") {
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR,
        "Cannot set a non-tfoot element as a table footer");
    }

    const currentFoot = this.tFoot;
    if (currentFoot !== null) {
      this.removeChild(currentFoot);
    }

    if (value !== null) {
      this.appendChild(value);
    }
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

  createTBody() {
    const el = this._ownerDocument.createElement("TBODY");

    const tbodies = childrenByHTMLLocalName(this, "tbody");
    const insertionPoint = tbodies[tbodies.length - 1];

    if (insertionPoint) {
      this.insertBefore(el, insertionPoint.nextSibling);
    } else {
      this.appendChild(el);
    }
    return el;
  }

  createTHead() {
    let el = this.tHead;
    if (!el) {
      el = this.tHead = this._ownerDocument.createElement("THEAD");
    }
    return el;
  }

  deleteTHead() {
    this.tHead = null;
  }

  createTFoot() {
    let el = this.tFoot;
    if (!el) {
      el = this.tFoot = this._ownerDocument.createElement("TFOOT");
    }
    return el;
  }

  deleteTFoot() {
    this.tFoot = null;
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
