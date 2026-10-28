"use strict";

exports.getElementColorScheme = getElementColorScheme;
exports.getPageColorScheme = getPageColorScheme;
const values = require("../values/value.js");
const resolver = require("../resolve.js");
const { HTML_NS } = require("../../helpers/namespaces.js");
const { getDocumentStyleState } = require("./style.js");
const parser = require("../parse/parser.js");
const supportedSchemes = ["light", "dark"];
// https://drafts.csswg.org/css-color-adjust-1/#element-color-scheme
function getElementColorScheme(element) {
  const {
    ownerDocument: { defaultView },
  } = element;
  const support = resolver.getSpecifiedValue("color-scheme", element);
  if (support.value === "normal") {
    return getPageColorScheme(defaultView)[0];
  }
  return getUsedColorScheme(support, getPreferredColorScheme(defaultView))[0];
}

// https://drafts.csswg.org/css-color-adjust-1/#page-color-scheme
function getPageColorScheme(globalObject) {
  return getUsedColorScheme(
    getPageSupportedColorSchemes(globalObject),
    getPreferredColorScheme(globalObject),
  );
}

// https://drafts.csswg.org/css-color-adjust-1/#pages-supported-color-scheme
// https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme
function getPageSupportedColorSchemes(globalObject) {
  const document = globalObject._document;
  const styleState = getDocumentStyleState(document);
  if (styleState.pageColorSchemes !== undefined) {
    return styleState.pageColorSchemes;
  }
  let value = null;
  for (const meta of document._descendants()) {
    if (
      meta._namespaceURI !== HTML_NS ||
      meta._localName !== "meta" ||
      meta.getAttributeNS(null, "name")?.toLowerCase() !== "color-scheme"
    ) {
      continue;
    }
    const content = meta.getAttributeNS(null, "content");
    if (content === null) {
      continue;
    }
    const colorScheme = parser.parseGrammar(content, "<'color-scheme'>", globalObject);
    if (!values.isFailure(colorScheme)) {
      value = colorScheme.value === "normal" ? null : colorScheme;
      break;
    }
  }
  styleState.pageColorSchemes = value;
  return value;
}

// https://drafts.csswg.org/css-color-adjust-1/#preferred-color-scheme
function getPreferredColorScheme(globalObject) {
  if (globalObject._document._parentDocument !== null) {
    return getElementColorScheme(globalObject._frameElement);
  }
  return "light";
}

// https://drafts.csswg.org/css-color-adjust-1/#determine-the-used-color-scheme
function getUsedColorScheme(support, preference) {
  const schemes = support?.[0].filter((scheme) => supportedSchemes.includes(scheme.value));
  if (!schemes?.length) {
    return ["light", true];
  }
  if (schemes.some((scheme) => scheme.value === preference)) {
    return [preference];
  }
  return [schemes[0].value];
}
