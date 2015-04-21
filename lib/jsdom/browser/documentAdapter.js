"use strict";

//Tree traversing
exports.getFirstChild = function (node) {
  return node.childNodes[0];
};

exports.getChildNodes = function (node) {
  return node.childNodes;
};

exports.getParentNode = function (node) {
  return node.parentNode;
};

exports.getAttrList = function (node) {
  return node.attributes;
};

//Node data
exports.getTagName = function (element) {
  return element.tagName.toLowerCase();
};

exports.getNamespaceURI = function (element) {
  return element.namespaceURI || "http://www.w3.org/1999/xhtml";
};

exports.getTextNodeContent = function (textNode) {
  return textNode.nodeValue;
};

exports.getCommentNodeContent = function (commentNode) {
  return commentNode.nodeValue;
};

exports.getDocumentTypeNodeName = function (doctypeNode) {
  return doctypeNode.name;
};

exports.getDocumentTypeNodePublicId = function (doctypeNode) {
  return doctypeNode.publicId || null;
};

exports.getDocumentTypeNodeSystemId = function (doctypeNode) {
  return doctypeNode.systemId || null;
};

//Node types
exports.isTextNode = function (node) {
  return node.nodeName === "#text";
};

exports.isCommentNode = function (node) {
  return node.nodeName === "#comment";
};

exports.isDocumentTypeNode = function (node) {
  return node.nodeType === 10;
};

exports.isElementNode = function (node) {
  return !!node.tagName;
};
