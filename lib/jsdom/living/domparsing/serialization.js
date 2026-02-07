"use strict";

const produceXMLSerialization = require("w3c-xmlserializer");
const parse5 = require("parse5");
const DOMException = require("../generated/DOMException");
const { domSymbolTree } = require("../helpers/internal-constants");
const utils = require("../generated/utils");
const treeAdapter = require("./parse5-adapter-serialization");
const NODE_TYPE = require("../node-type");

function escapeAttributeValue(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serializeElementOpenTag(element) {
  const tagName = element._qualifiedName.toLowerCase();
  const attrs = treeAdapter.getAttrList(element);
  const attrStr = attrs
    .map(attr => ` ${attr.name}="${escapeAttributeValue(attr.value)}"`)
    .join("");
  return `<${tagName}${attrStr}>`;
}

function serializeElementCloseTag(element) {
  return `</${element._qualifiedName.toLowerCase()}>`;
}

/**
 * HTML fragment serialisation algorithm with optional shadow root inclusion.
 * https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#html-fragment-serialisation-algorithm
 * @param {Node} node - Element, ShadowRoot, or Document whose contents to serialize
 * @param {{ serializableShadowRoots: boolean, shadowRootsSet: Set<ShadowRoot>, globalObject: object }} options
 * @param {object} config - parse5 config (treeAdapter, etc.)
 * @returns {string}
 */
function fragmentSerializationWithShadowRoots(node, options, config) {
  const { serializableShadowRoots, shadowRootsSet } = options;
  const children = domSymbolTree.childrenToArray(node);
  let out = "";

  for (const child of children) {
    if (child.nodeType !== NODE_TYPE.ELEMENT_NODE) {
      out += parse5.serializeOuter(child, config);
      continue;
    }

    const root = child._shadowRoot;
    const includeShadow =
      root &&
      (shadowRootsSet.has(root) || (serializableShadowRoots && root._serializable));

    if (!includeShadow) {
      out += parse5.serializeOuter(child, config);
      continue;
    }

    out += serializeElementOpenTag(child);
    out += `<template shadowrootmode="${root._mode}">`;
    out += fragmentSerializationWithShadowRoots(root, options, config);
    out += "</template>";
    out += fragmentSerializationWithShadowRoots(child, options, config);
    out += serializeElementCloseTag(child);
  }

  return out;
}

module.exports.fragmentSerialization = (node, { outer, requireWellFormed, globalObject }) => {
  const contextDocument =
    node.nodeType === NODE_TYPE.DOCUMENT_NODE ? node : node._ownerDocument;
  if (contextDocument._parsingMode === "html") {
    const config = {
      ...contextDocument._parseOptions,
      treeAdapter
    };
    return outer ? parse5.serializeOuter(node, config) : parse5.serialize(node, config);
  }

  const childNodes = outer ? [node] : domSymbolTree.childrenToArray(node);

  try {
    let serialized = "";
    for (let i = 0; i < childNodes.length; ++i) {
      serialized += produceXMLSerialization(
        utils.wrapperForImpl(childNodes[i]),
        { requireWellFormed }
      );
    }
    return serialized;
  } catch (e) {
    throw DOMException.create(globalObject, [e.message, "InvalidStateError"]);
  }
};

/**
 * Serialize node contents (innerHTML-style) with optional shadow roots.
 * Used by getHTML(optional GetHTMLOptions).
 */
module.exports.fragmentSerializationWithShadowRoots = (node, options) => {
  const { globalObject } = options;
  const contextDocument =
    node.nodeType === NODE_TYPE.DOCUMENT_NODE ? node : node._ownerDocument;

  if (contextDocument._parsingMode !== "html") {
    return module.exports.fragmentSerialization(node, {
      outer: false,
      requireWellFormed: true,
      globalObject
    });
  }

  const config = {
    ...contextDocument._parseOptions,
    treeAdapter
  };

  const shadowRootsSet = new Set();
  if (options.shadowRoots && options.shadowRoots.length > 0) {
    for (const r of options.shadowRoots) {
      const impl = r && typeof r === "object" && r._host !== undefined ? r : utils.implForWrapper(r);
      if (impl) shadowRootsSet.add(impl);
    }
  }

  return fragmentSerializationWithShadowRoots(node, {
    serializableShadowRoots: options.serializableShadowRoots === true,
    shadowRootsSet,
    globalObject
  }, config);
};
