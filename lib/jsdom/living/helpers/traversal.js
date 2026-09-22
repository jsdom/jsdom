"use strict";
const { HTML_NS } = require("./namespaces");
const NODE_TYPE = require("../node-type");

// All these operate on and return impls, not wrappers!

exports.closest = (e, localName, namespace = HTML_NS) => {
  while (e) {
    if (e.localName === localName && e.namespaceURI === namespace) {
      return e;
    }
    e = e.parentNode;
  }

  return null;
};

exports.childrenByLocalName = (parent, localName, namespace = HTML_NS) => {
  return parent._childrenToArray(node => node._localName === localName && node._namespaceURI === namespace);
};

exports.descendantsByLocalName = (parent, localName, namespace = HTML_NS) => {
  return parent._descendantsToArray(node => node._localName === localName && node._namespaceURI === namespace);
};

exports.childrenByLocalNames = (parent, localNamesSet, namespace = HTML_NS) => {
  return parent._childrenToArray(node => localNamesSet.has(node._localName) && node._namespaceURI === namespace);
};

exports.descendantsByLocalNames = (parent, localNamesSet, namespace = HTML_NS) => {
  return parent._descendantsToArray(node => localNamesSet.has(node._localName) && node._namespaceURI === namespace);
};

exports.firstChildWithLocalName = (parent, localName, namespace = HTML_NS) => {
  return parent._children().find(child => child._localName === localName && child._namespaceURI === namespace) ?? null;
};

exports.firstChildWithLocalNames = (parent, localNamesSet, namespace = HTML_NS) => {
  return parent._children()
    .find(child => localNamesSet.has(child._localName) && child._namespaceURI === namespace) ?? null;
};

exports.firstDescendantWithLocalName = (parent, localName, namespace = HTML_NS) => {
  return parent._descendants()
    .find(descendant => descendant._localName === localName && descendant._namespaceURI === namespace) ?? null;
};

exports.firstElementWithId = (root, id) => {
  if (id === "") {
    return null;
  }

  if (root.nodeType === NODE_TYPE.DOCUMENT_NODE || root.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
    return root.getElementById(id);
  }

  return root._inclusiveDescendants()
    .find(node => node.nodeType === NODE_TYPE.ELEMENT_NODE && node.getAttributeNS(null, "id") === id) ?? null;
};
