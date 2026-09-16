"use strict";
const { appendAttribute } = require("./attributes");
const NODE_TYPE = require("./node-type");

const { createElement } = require("./helpers/create-element");
const { XML_NS, XMLNS_NS } = require("./helpers/namespaces");

// https://dom.spec.whatwg.org/#concept-node-clone
exports.clone = (node, document = node._ownerDocument, subtree = false, parent = null) => {
  const copy = cloneSingleNode(node, document);

  if (node._cloningSteps) {
    node._cloningSteps(copy, subtree);
  }

  if (parent !== null) {
    parent._append(copy);
  }

  if (subtree) {
    for (const child of node._children()) {
      exports.clone(child, document, true, copy);
    }
  }

  return copy;
};

// https://dom.spec.whatwg.org/#clone-a-single-node
function cloneSingleNode(node, document) {
  let copy;
  switch (node.nodeType) {
    case NODE_TYPE.DOCUMENT_NODE:
      // Can't use a simple `Document.createImpl` because of circular dependency issues :-/
      copy = node._cloneDocument();
      break;

    case NODE_TYPE.DOCUMENT_TYPE_NODE:
      copy = document.implementation.createDocumentType(node.name, node.publicId, node.systemId);
      break;

    case NODE_TYPE.ELEMENT_NODE:
      copy = createElement(
        document,
        node._localName,
        node._namespaceURI,
        node._prefix,
        node._isValue,
        false
      );

      for (const attribute of node._attributeList) {
        appendAttribute(copy, cloneSingleNode(attribute, document));
      }
      break;

    case NODE_TYPE.ATTRIBUTE_NODE:
      copy = document._createAttribute({
        namespace: node._namespace,
        namespacePrefix: node._namespacePrefix,
        localName: node._localName,
        value: node._value
      });
      break;

    case NODE_TYPE.TEXT_NODE:
      copy = document.createTextNode(node._data);
      break;

    case NODE_TYPE.CDATA_SECTION_NODE:
      copy = document._createCDATASection(node._data);
      break;

    case NODE_TYPE.COMMENT_NODE:
      copy = document.createComment(node._data);
      break;

    case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      copy = document._createProcessingInstruction(node.target, node._data);
      break;

    case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      copy = document.createDocumentFragment();
      break;
  }

  return copy;
}

// https://dom.spec.whatwg.org/#converting-nodes-into-a-node
// create a fragment (or just return a node for one item)
exports.convertNodesIntoNode = (document, nodes) => {
  if (nodes.length === 1) { // note: I'd prefer to check instanceof Node rather than string
    return typeof nodes[0] === "string" ? document.createTextNode(nodes[0]) : nodes[0];
  }
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < nodes.length; i++) {
    fragment._append(typeof nodes[i] === "string" ? document.createTextNode(nodes[i]) : nodes[i]);
  }
  return fragment;
};

// https://dom.spec.whatwg.org/#locate-a-namespace-prefix
exports.locateNamespacePrefix = (element, namespace) => {
  if (element._namespaceURI === namespace && element._prefix !== null) {
    return element._prefix;
  }

  for (const attribute of element._attributeList) {
    if (attribute._namespacePrefix === "xmlns" && attribute._value === namespace) {
      return attribute._localName;
    }
  }

  if (element.parentElement !== null) {
    return exports.locateNamespacePrefix(element.parentElement, namespace);
  }

  return null;
};

// https://dom.spec.whatwg.org/#locate-a-namespace
exports.locateNamespace = (node, prefix) => {
  switch (node.nodeType) {
    case NODE_TYPE.ELEMENT_NODE: {
      if (prefix === "xml") {
        return XML_NS;
      }

      if (prefix === "xmlns") {
        return XMLNS_NS;
      }

      if (node._namespaceURI !== null && node._prefix === prefix) {
        return node._namespaceURI;
      }

      if (prefix === null) {
        for (const attribute of node._attributeList) {
          if (attribute._namespace === XMLNS_NS &&
              attribute._namespacePrefix === null &&
              attribute._localName === "xmlns") {
            return attribute._value !== "" ? attribute._value : null;
          }
        }
      } else {
        for (const attribute of node._attributeList) {
          if (attribute._namespace === XMLNS_NS &&
              attribute._namespacePrefix === "xmlns" &&
              attribute._localName === prefix) {
            return attribute._value !== "" ? attribute._value : null;
          }
        }
      }

      if (node.parentElement === null) {
        return null;
      }

      return exports.locateNamespace(node.parentElement, prefix);
    }

    case NODE_TYPE.DOCUMENT_NODE: {
      if (node.documentElement === null) {
        return null;
      }

      return exports.locateNamespace(node.documentElement, prefix);
    }

    case NODE_TYPE.DOCUMENT_TYPE_NODE:
    case NODE_TYPE.DOCUMENT_FRAGMENT_NODE: {
      return null;
    }

    case NODE_TYPE.ATTRIBUTE_NODE: {
      if (node._element === null) {
        return null;
      }

      return exports.locateNamespace(node._element, prefix);
    }

    default: {
      if (node.parentElement === null) {
        return null;
      }

      return exports.locateNamespace(node.parentElement, prefix);
    }
  }
};
