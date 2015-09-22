"use strict";

const attributes = require("../living/attributes");
const createDocumentTypeInternal = require("../living/document-type").create;

module.exports = function (document) {
  const exports = {};

  // Node construction
  exports.createDocument = function () {
    return document;
  };

  exports.createDocumentFragment = function () {
    return document.createDocumentFragment();
  };

  exports.createElement = function (tagName, namespaceURI, attrs) {
    const elem = document._createElementWithCorrectElementInterface(tagName, namespaceURI);
    elem._localName = tagName;
    elem._namespaceURI = namespaceURI || null;
    for (let i = 0; i < attrs.length; ++i) {
      attributes.setAttributeValue(elem, attrs[i].name, attrs[i].value,
                                   attrs[i].prefix || null, attrs[i].namespace || null);
    }
    return elem;
  };

  exports.createCommentNode = function (data) {
    return document.createComment(data);
  };

  // Tree mutation
  exports.appendChild = function (parentNode, newNode) {
    parentNode.appendChild(newNode);
  };

  exports.insertBefore = function (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  };

  exports.setTemplateContent = function (templateElement, contentElement) {
    templateElement.content = contentElement;
  };

  exports.setDocumentType = function (doc, name, publicId, systemId) {
    const doctypeNode = doc.doctype;
    if (doctypeNode) {
      doctypeNode.parentNode.removeChild(doctypeNode);
    }

    const newType = createDocumentTypeInternal(document.defaultView, document, name, publicId, systemId);
    exports.appendChild(doc, newType);
  };

  exports.setQuirksMode = function (doc) {
    doc._mode = "quirks";
  };

  exports.isQuirksMode = function (doc) {
    return doc._mode === "quirks";
  };

  exports.detachNode = function (node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  };

  exports.insertText = function (parentNode, text) {
    const lastChild = parentNode.lastChild;
    if (lastChild && lastChild.nodeName === "#text") {
      lastChild.nodeValue += text;
    } else {
      exports.appendChild(parentNode, document.createTextNode(text));
    }
  };

  exports.insertTextBefore = function (parentNode, text, referenceNode) {
    const prevNode = referenceNode.previousSibling;
    if (prevNode && prevNode.nodeName === "#text") {
      prevNode.nodeValue += text;
    } else {
      exports.insertBefore(parentNode, document.createTextNode(text), referenceNode);
    }
  };

  exports.adoptAttributes = function (recipientNode, attrs) {
    for (let i = 0; i < attrs.length; ++i) {
      if (recipientNode.hasAttribute(attrs[i].name)) {
        recipientNode.attributes.setNamedItemNS(attrs[i]);
      }
    }
  };

  // Tree traversing
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

  // Node data
  exports.getTagName = function (element) {
    if (!element.tagName) {
      return null;
    }

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

  exports.getTemplateContent = function (node) {
    return node.content;
  };

  // Node types
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
    return Boolean(node.tagName);
  };

  return exports;
};
