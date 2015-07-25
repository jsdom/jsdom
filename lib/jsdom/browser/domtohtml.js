"use strict";
const parse5 = require("parse5");
const serializer = new parse5.TreeSerializer(require("./documentAdapter"));
const NODE_TYPE = require("../living/node-type");

exports.domToHtml = function (iterable) {
  let ret = "";
  for (const node of iterable) {
    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      ret += serializer.serialize(node);
    } else {
      ret += serializer.serialize({ childNodes: [node] });
    }
  }
  return ret;
};
