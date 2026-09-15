"use strict";

const idlUtils = require("../../../generated/idl/utils.js");
const { domSymbolTree } = require("../helpers/internal-constants");
const { DOCUMENT_POSITION_FOLLOWING } = require("../node-document-position");

exports.implementation = class StyleSheetList {
  constructor() {
    this._list = [];
  }

  get length() {
    return this._list.length;
  }

  item(index) {
    const result = this._list[index];
    return result !== undefined ? result : null;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._list.keys();
  }

  _add(sheet) {
    const { _list } = this;
    if (!_list.includes(sheet)) {
      // https://drafts.csswg.org/cssom/#add-a-css-style-sheet
      const index = _list.findLastIndex(other => {
        return domSymbolTree.compareTreePosition(other.ownerNode, sheet.ownerNode) & DOCUMENT_POSITION_FOLLOWING;
      });
      _list.splice(index + 1, 0, sheet);
    }
  }

  _remove(sheet) {
    const { _list } = this;

    const index = _list.indexOf(sheet);
    if (index >= 0) {
      _list.splice(index, 1);
    }
  }
};
