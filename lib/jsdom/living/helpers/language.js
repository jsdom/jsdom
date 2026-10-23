"use strict";

const { HTML_NS, SVG_NS, XML_NS } = require("./namespaces.js");
const { asciiLowercase } = require("./strings.js");

exports.getElementLanguageTag = getElementLanguageTag;

// https://html.spec.whatwg.org/multipage/semantics.html#pragma-set-default-language
function getPageLanguageTag(element) {
  let language = null;
  for (const node of element._ownerDocument._descendants()) {
    if (node._namespaceURI === HTML_NS && node._localName === "meta" &&
      asciiLowercase(node.getAttributeNS(null, "http-equiv") ?? "") === "content-language") {
      const content = node.getAttributeNS(null, "content");
      if (content && !content.includes(",")) {
        language = content;
      }
    }
  }
  return language;
}

// https://html.spec.whatwg.org/multipage/dom.html#language
function getElementLanguageTag(element) {
  if (element.hasAttributeNS(XML_NS, "lang")) {
    return element.getAttributeNS(XML_NS, "lang");
  }
  if ((element._namespaceURI === HTML_NS || element._namespaceURI === SVG_NS) &&
      element.hasAttributeNS(null, "lang")) {
    return element.getAttributeNS(null, "lang");
  }
  const parent = element.parentElement ?? element.parentNode?._host;
  return parent ? getElementLanguageTag(parent) : getPageLanguageTag(element);
}

