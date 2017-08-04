"use strict";
const attributes = require("./attributes");
const cloningSteps = require("./helpers/internal-constants").cloningSteps;
const domSymbolTree = require("./helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("./node-type");
const orderedSetParser = require("./helpers/ordered-set-parser");
const HTMLCollection = require("./generated/HTMLCollection");
const domTokenListContains = require("./dom-token-list").contains;

module.exports.clone = function (core, node, document, cloneChildren) {
  if (document === undefined) {
    document = node._ownerDocument;
  }

  let copy;
  switch (node.nodeType) {
    case NODE_TYPE.DOCUMENT_NODE:
      // TODO: just use Document when we eliminate the difference between Document and HTMLDocument.
      if (node.contentType === "text/html") { // need to differentiate due to parsing mode
        copy = document.implementation.createHTMLDocument();
        copy.removeChild(copy.documentElement); // ;_;
      } else {
        copy = document.implementation.createDocument("", "", null);
      }
      document = copy;
      break;

    case NODE_TYPE.DOCUMENT_TYPE_NODE:
      copy = document.implementation.createDocumentType(node.name, node.publicId, node.systemId);
      break;

    case NODE_TYPE.ELEMENT_NODE:
      copy = document._createElementWithCorrectElementInterface(node._localName, node._namespaceURI);
      copy._namespaceURI = node._namespaceURI;
      copy._prefix = node._prefix;
      copy._localName = node._localName;
      attributes.copyAttributeList(node, copy);
      break;

    case NODE_TYPE.TEXT_NODE:
      copy = document.createTextNode(node._data);
      break;

    case NODE_TYPE.CDATA_SECTION_NODE:
      copy = document.createCDATASection(node._data);
      break;

    case NODE_TYPE.COMMENT_NODE:
      copy = document.createComment(node._data);
      break;

    case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      copy = document.createProcessingInstruction(node.target, node._data);
      break;

    case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      copy = document.createDocumentFragment();
      break;
  }

  if (node[cloningSteps]) {
    node[cloningSteps](copy, node, document, cloneChildren);
  }

  if (cloneChildren) {
    for (const child of domSymbolTree.childrenIterator(node)) {
      const childCopy = module.exports.clone(core, child, document, true);
      copy.appendChild(childCopy);
    }
  }

  return copy;
};

// For the following, memoization is not applied here since the memoized results are stored on `this`.

module.exports.listOfElementsWithClassNames = (classNames, root) => {
  // https://dom.spec.whatwg.org/#concept-getElementsByClassName

  const classes = orderedSetParser(classNames);

  if (classes.size === 0) {
    return HTMLCollection.createImpl([], { element: root, query: () => [] });
  }

  return HTMLCollection.createImpl([], {
    element: root,
    query: () => {
      const isQuirksMode = root._ownerDocument.compatMode === "BackCompat";

      return domSymbolTree.treeToArray(root, { filter(node) {
        if (node.nodeType !== NODE_TYPE.ELEMENT_NODE || node === root) {
          return false;
        }

        for (const className of classes) {
          if (!domTokenListContains(node.classList, className, { caseInsensitive: isQuirksMode })) {
            return false;
          }
        }

        return true;
      } });
    }
  });
};

module.exports.listOfElementsWithQualifiedName = (qualifiedName, root) => {
  // https://dom.spec.whatwg.org/#concept-getelementsbytagname

  if (qualifiedName === "*") {
    return HTMLCollection.createImpl([], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter: node => node.nodeType === NODE_TYPE.ELEMENT_NODE && node !== root
      })
    });
  }

  if (root._ownerDocument._parsingMode === "html") {
    const lowerQualifiedName = qualifiedName.toLowerCase();

    return HTMLCollection.createImpl([], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter(node) {
          if (node.nodeType !== NODE_TYPE.ELEMENT_NODE || node === root) {
            return false;
          }

          if (node._namespaceURI === "http://www.w3.org/1999/xhtml") {
            return node._qualifiedName === lowerQualifiedName;
          }

          return node._qualifiedName === qualifiedName;
        }
      })
    });
  }

  return HTMLCollection.createImpl([], {
    element: root,
    query: () => domSymbolTree.treeToArray(root, {
      filter(node) {
        if (node.nodeType !== NODE_TYPE.ELEMENT_NODE || node === root) {
          return false;
        }

        return node._qualifiedName === qualifiedName;
      }
    })
  });
};

module.exports.listOfElementsWithNamespaceAndLocalName = (namespace, localName, root) => {
  // https://dom.spec.whatwg.org/#concept-getelementsbytagnamens

  if (namespace === "") {
    namespace = null;
  }

  if (namespace === "*" && localName === "*") {
    return HTMLCollection.createImpl([], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter: node => node.nodeType === NODE_TYPE.ELEMENT_NODE && node !== root
      })
    });
  }

  if (namespace === "*") {
    return HTMLCollection.createImpl([], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter(node) {
          if (node.nodeType !== NODE_TYPE.ELEMENT_NODE || node === root) {
            return false;
          }

          return node._localName === localName;
        }
      })
    });
  }

  if (localName === "*") {
    return HTMLCollection.createImpl([], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter(node) {
          if (node.nodeType !== NODE_TYPE.ELEMENT_NODE || node === root) {
            return false;
          }

          return node._namespaceURI === namespace;
        }
      })
    });
  }

  return HTMLCollection.createImpl([], {
    element: root,
    query: () => domSymbolTree.treeToArray(root, {
      filter(node) {
        if (node.nodeType !== NODE_TYPE.ELEMENT_NODE || node === root) {
          return false;
        }

        return node._localName === localName && node._namespaceURI === namespace;
      }
    })
  });
};
