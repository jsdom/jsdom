"use strict";
var parse5 = require("parse5");
var serializer = new parse5.TreeSerializer(require("./documentAdapter"));

exports.domToHtml = function (dom) {
  if (dom._toArray) {
    // node list
    dom = dom._toArray();
  }

  if (typeof dom.nodeType === "number") {
    return dom.nodeType === dom.DOCUMENT_NODE ?
           serializer.serialize(dom) :
           serializer.serialize({ childNodes: [dom] });
  } else if (typeof dom.length === "number") {
    // array or array like
    var ret = "";
    for (var i = 0; i < dom.length; i++) {
      ret += dom[i].nodeType === dom.DOCUMENT_NODE ?
             serializer.serialize(dom[i]) :
             serializer.serialize({ childNodes: [dom[i]] });
    }
    return ret;
  }

  throw new TypeError("First argument should be a Node or an array like object");
};
