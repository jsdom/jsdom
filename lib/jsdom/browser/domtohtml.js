"use strict";
const parse5 = require("parse5");
const documentAdapter = require("./documentAdapter");
const NODE_TYPE = require("../living/node-type");
const idlUtils = require("../living/generated/utils");

exports.domToHtml = function (iterable) {
  let ret = "";
  for (const node of iterable) {
    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      // TODO: make all callers only pass wrappers (or only pass impls)
      ret += parse5.serialize(idlUtils.tryWrapperForImpl(node), {
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
