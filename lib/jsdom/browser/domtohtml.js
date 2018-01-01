"use strict";
const parse5 = require("parse5");
const treeAdapter = require("./parse5-adapter-serialization");
const NODE_TYPE = require("../living/node-type");

exports.domToHtml = iterable => {
  let ret = "";
  for (const node of iterable) {
    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      ret += parse5.serialize(node, { treeAdapter });
    } else {
      ret += parse5.serialize({ childNodes: [node] }, { treeAdapter });
    }
  }
  return ret;
};
