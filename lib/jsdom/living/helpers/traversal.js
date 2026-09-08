"use strict";
const { domSymbolTree } = require("./internal-constants");
const { HTML_NS } = require("./namespaces");
const NODE_TYPE = require("../node-type");

// All these operate on and return impls, not wrappers!

exports.closest = (e, localName, namespace = HTML_NS) => {
  while (e) {
    if (e.localName === localName && e.namespaceURI === namespace) {
      return e;
    }
    e = domSymbolTree.parent(e);
  }

  return null;
};

exports.childrenByLocalName = (parent, localName, namespace = HTML_NS) => {
  return domSymbolTree.childrenToArray(parent, { filter(node) {
    return node._localName === localName && node._namespaceURI === namespace;
  } });
};

exports.descendantsByLocalName = (parent, localName, namespace = HTML_NS) => {
  return domSymbolTree.treeToArray(parent, { filter(node) {
    return node._localName === localName && node._namespaceURI === namespace && node !== parent;
  } });
};

exports.childrenByLocalNames = (parent, localNamesSet, namespace = HTML_NS) => {
  return domSymbolTree.childrenToArray(parent, { filter(node) {
    return localNamesSet.has(node._localName) && node._namespaceURI === namespace;
  } });
};

exports.descendantsByLocalNames = (parent, localNamesSet, namespace = HTML_NS) => {
  return domSymbolTree.treeToArray(parent, { filter(node) {
    return localNamesSet.has(node._localName) &&
           node._namespaceURI === namespace &&
           node !== parent;
  } });
};

exports.firstChildWithLocalName = (parent, localName, namespace = HTML_NS) => {
  const iterator = domSymbolTree.childrenIterator(parent);
  for (const child of iterator) {
    if (child._localName === localName && child._namespaceURI === namespace) {
      return child;
    }
  }
  return null;
};

exports.firstChildWithLocalNames = (parent, localNamesSet, namespace = HTML_NS) => {
  const iterator = domSymbolTree.childrenIterator(parent);
  for (const child of iterator) {
    if (localNamesSet.has(child._localName) && child._namespaceURI === namespace) {
      return child;
    }
  }
  return null;
};

exports.firstDescendantWithLocalName = (parent, localName, namespace = HTML_NS) => {
  const iterator = domSymbolTree.treeIterator(parent);
  for (const descendant of iterator) {
    if (descendant._localName === localName && descendant._namespaceURI === namespace) {
      return descendant;
    }
  }
  return null;
};

exports.firstElementWithId = (root, id) => {
  if (id === "") {
    return null;
  }

  if (root.nodeType === NODE_TYPE.DOCUMENT_NODE || root.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
    return root.getElementById(id);
  }

  for (const node of domSymbolTree.treeIterator(root)) {
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE && node.getAttributeNS(null, "id") === id) {
      return node;
    }
  }

  return null;
};
