"use strict";
const domSymbolTree = require("./internal-constants").domSymbolTree;
const { TEXT_NODE } = require("../node-type");

exports.childTextContent = node => {
  let result = "";
  const iterator = domSymbolTree.childrenIterator(node);
  for (const child of iterator) {
    if (child.nodeType === TEXT_NODE) {
      result += child.data;
    }
  }
  return result;
};
