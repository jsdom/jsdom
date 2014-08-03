"use strict";

var parse5 = require('parse5');
var serializer = new parse5.TreeSerializer(require('./documentAdapter'));

exports.domToHtml = function(dom) {
  if (dom._toArray) {
    // node list
    dom = dom._toArray();
  }
  if (typeof dom.length !== "undefined") {
    var ret = "";
    for (var i = 0, len = dom.length; i < len; i++) {
      ret += dom[i]._tagName === "#document" ?
        serializer.serialize(dom[i]) :
        serializer.serialize({ childNodes: [dom[i]] });
    }
    return ret;
  } else {
    return dom._tagName === "#document" ?
      serializer.serialize(dom) :
      serializer.serialize({ childNodes: [dom] });
  }
};
