"use strict";

const { domSymbolTree } = require("../helpers/internal-constants");

function clearChildNodes(node) {
  for (let child = domSymbolTree.firstChild(node); child; child = domSymbolTree.firstChild(node)) {
    node.removeChild(child);
  }
}

function setInnerHTML(document, node, html) {
  // Clear the children first:
  if (node._templateContents) {
    clearChildNodes(node._templateContents);
  } else {
    clearChildNodes(node);
  }

  if (node.nodeName === "#document") {
    document._htmlToDom.appendToDocument(html, node);
  } else {
    document._htmlToDom.appendToNode(html, node);
  }
}

module.exports = {
  setInnerHTML
};
