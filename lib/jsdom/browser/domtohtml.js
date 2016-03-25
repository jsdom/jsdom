"use strict";
const parse5 = require("parse5");
const adapter = require("./documentAdapter.js")(null); // don't need a doc for serialization
const NODE_TYPE = require("../living/node-type");
const idlUtils = require("../living/generated/utils");

exports.domToHtml = function (iterable) {
  let ret = "";
  for (const node of iterable) {
    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      ret += parse5.serialize(node, { treeAdapter: adapter });
    } else {
      ret += parse5.serialize({ childNodes: [idlUtils.wrapperForImpl(node)] }, { treeAdapter: adapter });
    }
  }
  return ret;
};
