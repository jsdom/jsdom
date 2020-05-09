"use strict";
const { SVG_NS } = require("../namespaces");

// https://svgwg.org/svg2-draft/render.html#TermNeverRenderedElement
const neverRenderedElements = new Set([
  "clipPath",
  "defs",
  "desc",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "pattern",
  "radialGradient",
  "script",
  "style",
  "title",
  "symbol"
]);

// https://svgwg.org/svg2-draft/render.html#Rendered-vs-NonRendered
exports.isRenderedElement = function isRenderedElement(elImpl) {
  if (neverRenderedElements.has(elImpl._localName)) {
    return false;
  }

  if (elImpl.getAttributeNS(null, "display") === "none") {
    return false;
  }

  if (!elImpl._attached) {
    return false;
  }

  if (!elImpl.parentNode || elImpl.parentNode._namespaceURI !== SVG_NS) {
    return true;
  }

  return isRenderedElement(elImpl.parentNode);

  // This does not check for elements excluded because of conditional processing attributes or ‘switch’ structures,
  // because conditional processing is not implemented.
  // https://svgwg.org/svg2-draft/struct.html#ConditionalProcessing
};
