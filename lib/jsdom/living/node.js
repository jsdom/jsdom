"use strict";
const attributes = require("./attributes");
const cloneDoctype = require("./document-type").clone;
const cloningSteps = require("./helpers/internal-constants").cloningSteps;
const domSymbolTree = require("./helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("./node-type");
const orderedSetParser = require("./helpers/ordered-set-parser");
const createHTMLCollection = require("./html-collection").create;
const domTokenListContains = require("./dom-token-list").contains;
const Text = require("./generated/Text");
const Comment = require("./generated/Comment");
const ProcessingInstruction = require("./generated/ProcessingInstruction");
const DocumentFragment = require("./generated/DocumentFragment");

module.exports.clone = function (core, node, document, cloneChildren) {
  if (document === undefined) {
    document = node._ownerDocument;
  }

  let copy;
  switch (node.nodeType) {
    case NODE_TYPE.DOCUMENT_NODE:
      // TODO: just use Document when we eliminate the difference between Document and HTMLDocument.
      copy = new node.constructor([], {
        core,
        contentType: node._contentType,
        url: node._URL,
        options: {
          parsingMode: node._parsingMode
        }
      });
      document = copy;
      break;

    case NODE_TYPE.DOCUMENT_TYPE_NODE:
      copy = cloneDoctype(core, node);
      break;

    case NODE_TYPE.ELEMENT_NODE:
      copy = document._createElementWithCorrectElementInterface(node._localName, node._namespaceURI);
      copy._namespaceURI = node._namespaceURI;
      copy._prefix = node._prefix;
      copy._localName = node._localName;
      attributes.copyAttributeList(node, copy);
      break;

    case NODE_TYPE.TEXT_NODE:
      copy = Text.createImpl([], { core, ownerDocument: document, data: node._data });
      break;

    case NODE_TYPE.COMMENT_NODE:
      copy = Comment.createImpl([], { core, ownerDocument: document, data: node._data });
      break;

    case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      copy = ProcessingInstruction.createImpl([], {
        core, ownerDocument: document, target: node._target, data: node._data
      });
      break;

    case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      copy = DocumentFragment.createImpl([], { core, ownerDocument: document, data: node._data });
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

module.exports.listOfElementsWithClassNames = function (classNames, root) {
  // https://dom.spec.whatwg.org/#concept-getElementsByClassName

  const classes = orderedSetParser(classNames);

  if (classes.size === 0) {
    return createHTMLCollection(root, () => false);
  }

  return createHTMLCollection(root, () => {
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
  });
};
