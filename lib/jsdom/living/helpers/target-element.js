"use strict";

const { percentDecodeString } = require("whatwg-url");
const { utf8DecodeWithoutBOM } = require("./encoding.js");
const { HTML_NS } = require("./namespaces.js");

// https://html.spec.whatwg.org/multipage/browsing-the-web.html#find-a-potential-indicated-element
function findPotentialIndicatedElement(document, fragment) {
  const element = document.getElementById(fragment);
  if (element !== null) {
    return element;
  }
  if (document._parsingMode === "html") {
    for (const descendant of document._descendants()) {
      if (
        descendant._namespaceURI === HTML_NS &&
        descendant._localName === "a" &&
        descendant.getAttributeNS(null, "name") === fragment
      ) {
        return descendant;
      }
    }
  }
  return null;
}

// https://html.spec.whatwg.org/multipage/browsing-the-web.html#select-the-indicated-part
exports.selectTargetElement = (document) => {
  const { fragment } = document._URL;
  if (fragment === null || fragment === "") {
    return null;
  }
  return (
    findPotentialIndicatedElement(document, fragment) ??
    findPotentialIndicatedElement(document, utf8DecodeWithoutBOM(percentDecodeString(fragment)))
  );
};
