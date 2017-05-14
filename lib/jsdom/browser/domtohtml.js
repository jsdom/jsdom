"use strict";
const parse5 = require("parse5");
const documentAdapter = require("./documentAdapter");
const NODE_TYPE = require("../living/node-type");
const idlUtils = require("../living/generated/utils");

exports.domToHtml = function (iterable) {
  let ret = "";
  for (const node of iterable) {
    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      ret += parse5.serialize(node, {
        treeAdapter: documentAdapter
      });
    } else {
      ret += parse5.serialize({ childNodes: [idlUtils.wrapperForImpl(node)] }, {
        treeAdapter: documentAdapter
      });
    }
  }
  return ret;
};
