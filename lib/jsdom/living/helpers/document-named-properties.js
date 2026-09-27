"use strict";
const NODE_TYPE = require("../node-type");
const { HTML_NS } = require("./namespaces");

// The elements that can contribute a document's named properties.
// https://html.spec.whatwg.org/multipage/dom.html#dom-document-nameditem-filter
// For object and embed elements, we intentionally follow Firefox by not filtering on exposedness.
// https://github.com/whatwg/html/issues/12787
const NAMED_PROPERTY_LOCAL_NAMES = new Set(["embed", "form", "iframe", "img", "object"]);
exports.NAMED_PROPERTY_LOCAL_NAMES = NAMED_PROPERTY_LOCAL_NAMES;

/** Can this node contribute to its document's named properties at all? */
exports.isNamedPropertyElement = node => {
  return node.nodeType === NODE_TYPE.ELEMENT_NODE &&
    node._namespaceURI === HTML_NS &&
    NAMED_PROPERTY_LOCAL_NAMES.has(node._localName);
};
