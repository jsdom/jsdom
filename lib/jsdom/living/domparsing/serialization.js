"use strict";

const produceXMLSerialization = require("w3c-xmlserializer");
const parse5 = require("parse5");
const DOMException = require("../../../generated/idl/DOMException");
const utils = require("../../../generated/idl/utils");
const treeAdapter = require("./parse5-adapter-serialization");
const NODE_TYPE = require("../node-type");
const { HTML_NS } = require("../helpers/namespaces");

// Wraps the serialization tree adapter so that the shadow roots of elements inside the serialized
// subtree are serialized as declarative shadow DOM <template> elements. The shadow roots to
// serialize are selected by getHTML()'s options.
// https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#html-serialization-methods
function createShadowRootTreeAdapter({ serializableShadowRoots, shadowRoots }) {
  function shouldSerializeShadowRoot(shadowRoot) {
    return (
      shadowRoots.includes(shadowRoot) || (serializableShadowRoots && shadowRoot._serializable)
    );
  }

  function createShadowRootTemplate(shadowRoot) {
    const attributes = [
      { name: "shadowrootmode", value: shadowRoot._mode, namespace: null, prefix: null },
    ];

    if (shadowRoot._delegatesFocus) {
      attributes.push({
        name: "shadowrootdelegatesfocus",
        value: "",
        namespace: null,
        prefix: null,
      });
    }
    if (shadowRoot._serializable) {
      attributes.push({ name: "shadowrootserializable", value: "", namespace: null, prefix: null });
    }
    if (shadowRoot._clonable) {
      attributes.push({ name: "shadowrootclonable", value: "", namespace: null, prefix: null });
    }

    return {
      nodeType: NODE_TYPE.ELEMENT_NODE,
      namespaceURI: HTML_NS,
      _qualifiedName: "template",
      _attributeList: attributes,
      // parse5 serializes the contents of <template> elements instead of their (always empty) children.
      _templateContents: {
        _childrenToArray: () => shadowRoot._childrenToArray(),
      },
    };
  }

  return {
    ...treeAdapter,
    getChildNodes(node) {
      const childNodes = treeAdapter.getChildNodes(node);
      const shadowRoot = node._shadowRoot;

      if (!shadowRoot || !shouldSerializeShadowRoot(shadowRoot)) {
        return childNodes;
      }

      // The shadow root's <template> is serialized before the host's light DOM children.
      return [createShadowRootTemplate(shadowRoot), ...childNodes];
    },
  };
}

module.exports.fragmentSerialization = (
  node,
  { outer, requireWellFormed, globalObject, serializableShadowRoots = false, shadowRoots = [] },
) => {
  const contextDocument = node.nodeType === NODE_TYPE.DOCUMENT_NODE ? node : node._ownerDocument;
  if (contextDocument._parsingMode === "html") {
    const config = {
      ...contextDocument._parseOptions,
      treeAdapter:
        serializableShadowRoots || shadowRoots.length > 0
          ? createShadowRootTreeAdapter({ serializableShadowRoots, shadowRoots })
          : treeAdapter,
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
