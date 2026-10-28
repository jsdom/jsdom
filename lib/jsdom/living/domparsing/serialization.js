"use strict";

const produceXMLSerialization = require("w3c-xmlserializer");
const parse5 = require("parse5");
const DOMException = require("../../../generated/idl/DOMException");
const utils = require("../../../generated/idl/utils");
const treeAdapter = require("./parse5-adapter-serialization");
const NODE_TYPE = require("../node-type");
const { HTML_NS } = require("../helpers/namespaces");

module.exports.fragmentSerialization = (node, { outer, requireWellFormed, globalObject }) => {
  const contextDocument = node.nodeType === NODE_TYPE.DOCUMENT_NODE ? node : node._ownerDocument;
  if (contextDocument._parsingMode === "html") {
    const config = {
      ...contextDocument._parseOptions,
      treeAdapter,
    };
    return outer ? parse5.serializeOuter(node, config) : parse5.serialize(node, config);
  }

  let childNodes;
  if (outer) {
    childNodes = [node];
  } else if (
    node.nodeType === NODE_TYPE.ELEMENT_NODE &&
    node.localName === "template" &&
    node.namespaceURI === HTML_NS
  ) {
    childNodes = node._templateContents._childrenToArray();
  } else {
    childNodes = node._childrenToArray();
  }

  try {
    let serialized = "";
    for (let i = 0; i < childNodes.length; ++i) {
      serialized += produceXMLSerialization(utils.wrapperForImpl(childNodes[i]), {
        requireWellFormed,
      });
    }
    return serialized;
  } catch (e) {
    throw DOMException.create(globalObject, [e.message, "InvalidStateError"]);
  }
};
