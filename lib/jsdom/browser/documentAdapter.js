"use strict";

module.exports = {

// Tree traversing
getFirstChild(node) {
  return node.childNodes[0];
},

getChildNodes(node) {
  return node.childNodes;
},

getParentNode(node) {
  return node.parentNode;
},

getAttrList(node) {
  return node.attributes;
},

// Node data
getTagName(element) {
  return element.tagName.toLowerCase();
},

getNamespaceURI(element) {
  return element.namespaceURI || "http://www.w3.org/1999/xhtml";
},

getTemplateContent(node) {
  return node.content;
},

getTextNodeContent(textNode) {
  return textNode.nodeValue;
},

getCommentNodeContent(commentNode) {
  return commentNode.nodeValue;
},

getDocumentTypeNodeName(doctypeNode) {
  return doctypeNode.name;
},

getDocumentTypeNodePublicId(doctypeNode) {
  return doctypeNode.publicId || null;
},

getDocumentTypeNodeSystemId(doctypeNode) {
  return doctypeNode.systemId || null;
},

// Node types
isTextNode(node) {
  return node.nodeName === "#text";
},

isCommentNode(node) {
  return node.nodeName === "#comment";
},

isDocumentTypeNode(node) {
  return node.nodeType === 10;
},

isElementNode(node) {
  return Boolean(node.tagName);
},

}
