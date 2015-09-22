"use strict";
const parse5 = require("parse5");
const adapter = require("./documentAdapter.js")(null); // don't need a doc for serialization
const NODE_TYPE = require("../living/node-type");

exports.domToHtml = function (iterable) {
  let ret = "";
  for (const node of iterable) {
    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      ret += parse5.serialize(node, { treeAdapter: adapter });
    } else {
      ret += parse5.serialize({ childNodes: [node] }, { treeAdapter: adapter });
    }
  }
  return ret;
};
