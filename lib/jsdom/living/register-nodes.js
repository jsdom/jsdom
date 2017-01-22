"use strict";
/* eslint global-require: 0 */

const DocumentImpl = require("./nodes/Document-impl.js");

const NODE_TYPE = require("./node-type.js");

const mappings = {
  [NODE_TYPE.ELEMENT_NODE]: {
    impl: require("./generated/Element.js")
  },
  [NODE_TYPE.ATTRIBUTE_NODE]: {
    impl: require("./generated/Attr.js")
  },
  [NODE_TYPE.TEXT_NODE]: {
    impl: require("./generated/Text.js")
  },
  [NODE_TYPE.CDATA_SECTION_NODE]: {
    impl: require("./generated/CDATASection.js")
  },
  [NODE_TYPE.ENTITY_REFERENCE_NODE]: {
    impl: null,
  },
  [NODE_TYPE.ENTITY_NODE]: {
    impl: null
  },
  [NODE_TYPE.PROCESSING_INSTRUCTION_NODE]: {
    impl: require("./generated/ProcessingInstruction.js")
  },
  [NODE_TYPE.COMMENT_NODE]: {
    impl: require("./generated/Comment.js")
  },
  [NODE_TYPE.DOCUMENT_NODE]: {
    impl: require("./generated/Document.js")
  },
  [NODE_TYPE.DOCUMENT_TYPE_NODE]: {
    impl: require("./generated/DocumentType.js")
  },
  [NODE_TYPE.DOCUMENT_FRAGMENT_NODE]: {
    impl: require("./generated/DocumentFragment.js")
  },
  [NODE_TYPE.NOTATION_NODE]: {
    impl: null
  }
};

module.exports = core => {
  for (const nodeType of Object.keys(mappings)) {
    const impl = mappings[nodeType].impl;

    if (impl) {
      DocumentImpl.implementation.prototype._nodeBuilders[nodeType] = impl;
    }
  }
};
