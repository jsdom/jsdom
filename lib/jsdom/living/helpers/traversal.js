"use strict";
const domSymbolTree = require("./internal-constants").domSymbolTree;

exports.closest = (e, localName) => {
  while (e) {
    if (e.localName === localName) {
      return e;
    }
    e = domSymbolTree.parent(e);
  }

  return null;
};

exports.closestMultiple = (e, localNames) => {
  while (e) {
    if (localNames.indexOf(e.localName) > -1) {
      return e;
    }
    e = domSymbolTree.parent(e);
  }

  return null;
};
