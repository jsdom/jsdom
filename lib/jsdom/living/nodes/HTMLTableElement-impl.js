"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const firstChildWithHTMLLocalName = require("../helpers/traversal").firstChildWithHTMLLocalName;
const childrenByHTMLLocalName = require("../helpers/traversal").childrenByHTMLLocalName;
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const createHTMLCollection = require("../../living/html-collection").create;
const DOMException = require("../../web-idl/DOMException");
const idlUtils = require("../generated/utils");

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
      this._rows = createHTMLCollection(this, () => {
        const sections = [];
        if (this.tHead) {
          sections.push(this.tHead);
        }
        sections.push.apply(sections, childrenByHTMLLocalName(this, "tbody"));
        if (this.tFoot) {
          sections.push(this.tFoot);
        }

        if (sections.length === 0) {
          return childrenByHTMLLocalName(this, "tr");
        }

        const rows = [];
        for (const s of sections) {
          rows.push.apply(rows, childrenByHTMLLocalName(s, "tr"));
        }
        return rows;
      });
    }
    return this._rows;
  }

  get tBodies() {
    if (!this._tBodies) {
      this._tBodies = createHTMLCollection(this, () => childrenByHTMLLocalName(this, "tbody"));
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
      domSymbolTree.parent(el).removeChild(el);
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
      domSymbolTree.parent(el).removeChild(el);
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
      domSymbolTree.parent(c).removeChild(c);
    }
  }

  insertRow(index) {
    const tr = this._ownerDocument.createElement("TR");

    if (!domSymbolTree.hasChildren(this)) {
      this.appendChild(this._ownerDocument.createElement("TBODY"));
    }
    const rows = this.rows;
    if (index < -1 || index > rows.length) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    if (index === -1 || (index === 0 && rows.length === 0)) {
      this.tBodies.item(0).appendChild(tr);
    } else if (index === rows.length) {
      const ref = idlUtils.implForWrapper(rows[index - 1]);
      domSymbolTree.parent(ref).appendChild(tr);
    } else {
      const ref = idlUtils.implForWrapper(rows[index]);
      domSymbolTree.parent(ref).insertBefore(tr, ref);
    }
    return tr;
  }

  deleteRow(index) {
    const rows = this.rows;
    const l = rows.length;
    if (index === -1) {
      index = l - 1;
    }
    if (index < 0 || index >= l) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    const tr = idlUtils.implForWrapper(rows[index]);
    domSymbolTree.parent(tr).removeChild(tr);
  }
}

module.exports = {
  implementation: HTMLTableElementImpl
};
