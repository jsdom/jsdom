"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const HTMLCollection = require("../generated/HTMLCollection");
const childrenByHTMLLocalNames = require("../helpers/traversal").childrenByHTMLLocalNames;
const DOMException = require("../../web-idl/DOMException");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;

const cellLocalNames = new Set(["td", "th"]);

class HTMLTableRowElementImpl extends HTMLElementImpl {
  get cells() {
    if (!this._cells) {
      this._cells = HTMLCollection.createImpl([], {
        element: this,
        query: () => childrenByHTMLLocalNames(this, cellLocalNames)
      });
    }
    return this._cells;
  }

  get rowIndex() {
    const parent = this.parentElement;
    if (parent === null || parent.namespaceURI !== "http://www.w3.org/1999/xhtml") {
      return -1;
    }

    let tableElement = parent;
    if (parent.localName === "thead" || parent.localName === "tbody" || parent.localName === "tfoot") {
      tableElement = parent.parentElement;
    }
    if (tableElement === null || tableElement.namespaceURI !== "http://www.w3.org/1999/xhtml" || tableElement.localName !== "table") {
      return -1;
    }

    return tableElement.rows.indexOf(this);
  }

  get sectionRowIndex() {
    const parent = domSymbolTree.parent(this);
    if (parent === null) {
      return -1;
    }

    const rows = parent.rows;
    if (!rows) {
      return -1;
    }

    return rows.indexOf(this);
  }

  insertCell(index) {
    const td = this._ownerDocument.createElement("TD");
    const cells = this.cells;
    if (index < -1 || index > cells.length) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    if (index === -1 || index === cells.length) {
      this.appendChild(td);
    } else {
      const ref = cells.item(index);
      this.insertBefore(td, ref);
    }
    return td;
  }

  deleteCell(index) {
    const cells = this.cells;
    if (index < -1 || index >= cells.length) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    if (index === -1) {
      if (cells.length === 0) {
        return;
      }

      index = cells.length - 1;
    }
    const td = cells.item(index);
    this.removeChild(td);
  }
}

module.exports = {
  implementation: HTMLTableRowElementImpl
};
