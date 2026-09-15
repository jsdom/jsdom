"use strict";

const HTMLCollection = require("../../../generated/idl/HTMLCollection");
const NODE_TYPE = require("../node-type");
const orderedSetParse = require("./ordered-set").parse;
const { HTML_NS } = require("./namespaces");
const { asciiCaseInsensitiveMatch, asciiLowercase } = require("./strings");

exports.createHTMLCollectionByClassNames = (classNames, root) => {
  // https://dom.spec.whatwg.org/#concept-getElementsByClassName

  const classes = orderedSetParse(classNames);

  if (classes.size === 0) {
    return HTMLCollection.createImpl(root._globalObject, [], { element: root, query: () => [] });
  }

  return HTMLCollection.createImpl(root._globalObject, [], {
    element: root,
    query: () => {
      const isQuirksMode = root._ownerDocument.compatMode === "BackCompat";

      return root._descendantsToArray(node => {
        if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
          return false;
        }

        const { classList } = node;
        if (isQuirksMode) {
          for (const className of classes) {
            if (!classList.tokenSet.some(cur => asciiCaseInsensitiveMatch(cur, className))) {
              return false;
            }
          }
        } else {
          for (const className of classes) {
            if (!classList.tokenSet.contains(className)) {
              return false;
            }
          }
        }

        return true;
      });
    }
  });
};

exports.createHTMLCollectionByQualifiedName = (qualifiedName, root) => {
  // https://dom.spec.whatwg.org/#concept-getelementsbytagname

  if (qualifiedName === "*") {
    return HTMLCollection.createImpl(root._globalObject, [], {
      element: root,
      query: () => root._descendantsToArray(node => node.nodeType === NODE_TYPE.ELEMENT_NODE)
    });
  }

  if (root._ownerDocument._parsingMode === "html") {
    const lowerQualifiedName = asciiLowercase(qualifiedName);

    return HTMLCollection.createImpl(root._globalObject, [], {
      element: root,
      query: () => root._descendantsToArray(node => {
        if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
          return false;
        }

        if (node._namespaceURI === HTML_NS) {
          return node._qualifiedName === lowerQualifiedName;
        }

        return node._qualifiedName === qualifiedName;
      })
    });
  }

  return HTMLCollection.createImpl(root._globalObject, [], {
    element: root,
    query: () => root._descendantsToArray(node => {
      if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
        return false;
      }

      return node._qualifiedName === qualifiedName;
    })
  });
};

exports.createHTMLCollectionByNamespaceAndLocalName = (namespace, localName, root) => {
  // https://dom.spec.whatwg.org/#concept-getelementsbytagnamens

  if (namespace === "*" && localName === "*") {
    return HTMLCollection.createImpl(root._globalObject, [], {
      element: root,
      query: () => root._descendantsToArray(node => node.nodeType === NODE_TYPE.ELEMENT_NODE)
    });
  }

  if (namespace === "*") {
    return HTMLCollection.createImpl(root._globalObject, [], {
      element: root,
      query: () => root._descendantsToArray(node => {
        if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
          return false;
        }

        return node._localName === localName;
      })
    });
  }

  if (localName === "*") {
    return HTMLCollection.createImpl(root._globalObject, [], {
      element: root,
      query: () => root._descendantsToArray(node => {
        if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
          return false;
        }

        return node._namespaceURI === namespace;
      })
    });
  }

  return HTMLCollection.createImpl(root._globalObject, [], {
    element: root,
    query: () => root._descendantsToArray(node => {
      if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
        return false;
      }

      return node._localName === localName && node._namespaceURI === namespace;
    })
  });
};
