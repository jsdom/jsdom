"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Specificity = require("@bramus/specificity").default;
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const CSSStyleProperties = require("../../../../generated/idl/CSSStyleProperties.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const attributes = require("../../attributes.js");
const { asciiLowercase } = require("../../helpers/strings.js");
const { evaluateMediaList } = require("../MediaList-impl.js");
const csstree = require("./patched-csstree.js");
const { parseStyleSheet } = require("./css-parser.js");
const { isGlobalKeyword } = require("./css-values.js");
const { absoluteFontSize } = require("./font-sizes.js");
const { systemColors } = require("./system-colors.js");

const defaultStyleSheet = fs.readFileSync(
  path.resolve(__dirname, "../../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
);
let parsedDefaultStyleSheet;

// The document's style cache maps each element to a computed declaration. Declarations created here
// cascade properties on demand: they collect the style rules that might match the element once, then
// match and apply only the rules declaring the properties that are read. getComputedStyleDeclaration()
// replaces such a declaration with a complete one, built from the same rules.
function getCachedDeclaration(elementImpl) {
  const styleCache = elementImpl._ownerDocument._styleCache;
  let declaration = styleCache.get(elementImpl);
  if (!declaration) {
    declaration = createComputedDeclaration(elementImpl);
    declaration._cascadedProperties = new Set();
    styleCache.set(elementImpl, declaration);
  }
  return declaration;
}

function createComputedDeclaration(elementImpl) {
  return CSSStyleProperties.createImpl(elementImpl._globalObject, [], {
    computed: true,
    ownerNode: elementImpl
  });
}

// Like reading a property from getComputedStyle(), including CSSOM resolved-value adjustments, but
// only cascading the requested longhands.
function getComputedStylePropertyValue(elementImpl, property) {
  return getCachedDeclaration(elementImpl)._getPropertyValue(property);
}

function cascadeProperty(elementImpl, declaration, property) {
  // Record absent declarations too, so they are not cascaded again.
  declaration._cascadedProperties.add(property);
  declaration._candidateStyles ??= collectCandidateStyles(elementImpl);
  applyStyles(elementImpl, declaration, declaration._candidateStyles, property);
}

function getComputedStyleDeclaration(elementImpl) {
  const styleCache = elementImpl._ownerDocument._styleCache;
  const cachedDeclaration = styleCache.get(elementImpl);
  const declaration = createComputedDeclaration(elementImpl);

  if (cachedDeclaration?._cascadedProperties === null) {
    declaration._copyDeclarationsFrom(cachedDeclaration);
  } else {
    // Build the complete declaration afresh rather than filling in the on-demand one, so that its
    // enumeration order follows the cascade regardless of which properties were read earlier.
    const candidateStyles = cachedDeclaration?._candidateStyles ?? collectCandidateStyles(elementImpl);
    applyStyles(elementImpl, declaration, candidateStyles);
    styleCache.set(elementImpl, declaration);
  }
  declaration._readonly = true;
  return declaration;
}

// Applies the winning declarations from the matching candidate styles. With `property`, only that
// longhand is applied, and only candidates declaring it are matched.
function applyStyles(elementImpl, declaration, candidateStyles, property) {
  const winners = new Map();
  for (const candidate of candidateStyles) {
    const { style } = candidate;
    if (property !== undefined && !style._getSpecifiedPropertyValue(property)) {
      continue;
    }
    if (!matchCandidateStyle(candidate, elementImpl)) {
      continue;
    }
    for (const name of property === undefined ? style._propertyNames() : [property]) {
      if (declarationWins(candidate, winners.get(name), name)) {
        winners.set(name, candidate);
      }
    }
  }

  // Source declarations have already parsed and expanded their shorthands. Copy the winning longhands
  // directly; invoking CSSOM setters here would parse again and overwrite sibling cascade winners.
  for (const [name, { style }] of winners) {
    declaration._setProperty(name, style._getSpecifiedPropertyValue(name), style._getPropertyPriority(name));
  }
}

// https://drafts.csswg.org/css-cascade-5/#cascade-sort
function declarationWins(candidate, previous, property) {
  if (!previous) {
    return true;
  }

  const priority = candidate.style._getPropertyPriority(property);
  const previousPriority = previous.style._getPropertyPriority(property);
  if (priority !== previousPriority) {
    return priority === "important";
  }

  // Only user-agent and author origins are currently supported. Important declarations reverse
  // the origin order, but not specificity or source order within an origin.
  if (candidate.origin !== previous.origin) {
    return priority === "important" ? candidate.origin === "user-agent" : candidate.origin === "author";
  }
  if (candidate.inline !== previous.inline) {
    return candidate.inline;
  }

  // Candidates are visited in source order, so the later declaration wins a specificity tie.
  return candidate.inline || Specificity.compare(candidate.specificity, previous.specificity) >= 0;
}

// Collects rules in source order within each origin, followed by the element's inline style. Selector
// subjects filter out rules that cannot match; matchCandidateStyle() checks the remaining selectors
// only when their declarations are needed, since matching is the expensive part of the cascade.
function collectCandidateStyles(elementImpl) {
  if (!parsedDefaultStyleSheet) {
    // The parsed default stylesheet will be composed of CSSOM objects from the first global object accessed. This is a
    // bit strange, but since we only ever access the internals of `parsedDefaultStyleSheet`, and don't expose it to
    // callers, it shouldn't cause any issues.
    parsedDefaultStyleSheet = parseStyleSheet(defaultStyleSheet, elementImpl._globalObject);
  }

  const candidateStyles = [];
  collectCandidateStylesFrom(parsedDefaultStyleSheet, elementImpl, candidateStyles, "user-agent");
  for (const sheetImpl of elementImpl._ownerDocument.styleSheets._list) {
    collectCandidateStylesFrom(sheetImpl, elementImpl, candidateStyles, "author");
  }

  // Not every element implements `ElementCSSInlineStyle`.
  const { style } = elementImpl;
  if (style && style.length > 0) {
    candidateStyles.push({
      rule: null,
      style,
      origin: "author",
      inline: true,
      matched: true,
      specificity: null
    });
  }
  return candidateStyles;
}

// `parentImpl` is a style sheet or a grouping rule; both expose `cssRules`.
function collectCandidateStylesFrom(parentImpl, elementImpl, candidateStyles, origin) {
  for (const ruleImpl of parentImpl.cssRules._list) {
    if (CSSImportRule.isImpl(ruleImpl)) {
      if (ruleImpl.styleSheet !== null && evaluateMediaList(ruleImpl.media._list)) {
        collectCandidateStylesFrom(ruleImpl.styleSheet, elementImpl, candidateStyles, origin);
      }
    } else if (CSSMediaRule.isImpl(ruleImpl)) {
      if (evaluateMediaList(ruleImpl.media._list)) {
        collectCandidateStylesFrom(ruleImpl, elementImpl, candidateStyles, origin);
      }
    } else if (CSSStyleRule.isImpl(ruleImpl) && ruleMightMatchElement(ruleImpl, elementImpl)) {
      candidateStyles.push({
        rule: ruleImpl,
        style: ruleImpl.style,
        origin,
        inline: false,
        matched: null,
        specificity: null
      });
    }
  }
}

function matchCandidateStyle(candidate, elementImpl) {
  if (candidate.matched === null) {
    const { ast, match } = matches(candidate.rule.selectorText, elementImpl);
    candidate.matched = match;
    if (match) {
      // The specificity only depends on the selector AST, not on any individual property, so it is computed once per
      // rule rather than once per property. This is a significant win for rules with many declarations.
      candidate.specificity = Specificity.max(...Specificity.calculate(ast)).value;
    }
  }
  return candidate.matched;
}

function ruleMightMatchElement(ruleImpl, elementImpl) {
  if (!ruleImpl._selectorSubjects) {
    const domSelector = elementImpl._ownerDocument._getDOMSelector();
    ruleImpl._selectorSubjects =
      domSelector.extractSubjects(
        ruleImpl.selectorText,
        elementImpl._ownerDocument.contentType !== "text/html"
      );
  }

  const subjects = ruleImpl._selectorSubjects;
  if (subjects.length === 0) {
    return true;
  }

  const id = elementImpl.getAttributeNS(null, "id");
  const { classList } = elementImpl;
  // TODO: Remove toLowerCase() after updating the dom-selector.
  const tag = elementImpl._localName.toLowerCase();
  for (const keys of subjects) {
    let mightMatch = true;
    if (keys.id && keys.id !== id) {
      mightMatch = false;
    } else if (keys.className && !classList.contains(keys.className)) {
      mightMatch = false;
      // TODO: Remove toLowerCase() after updating the dom-selector.
    } else if (keys.tag && keys.tag.toLowerCase() !== tag) {
      mightMatch = false;
    } else if (keys.attr && attributes.getAttributeByName(elementImpl, keys.attr) === null) {
      mightMatch = false;
    }

    if (mightMatch) {
      return true;
    }
  }

  return false;
}

function matches(selectorText, elementImpl) {
  const domSelector = elementImpl._ownerDocument._getDOMSelector();
  const { ast, match, pseudoElement } = domSelector.check(selectorText, elementImpl);
  // `pseudoElement` is a pseudo-element selector (e.g. `::before`). We do not support getComputedStyle(element,
  // pseudoElement), so such a branch never applies to the element itself; however, as long as another branch of
  // the selector list matches the element, the rule applies, and its members are evaluated individually.
  if (pseudoElement) {
    return { ast, match: matchesWithoutPseudoElement(ast, elementImpl, domSelector) };
  }
  return { ast, match, pseudoElement };
}

function matchesWithoutPseudoElement(selectorListAST, elementImpl, domSelector) {
  for (const selector of selectorListAST.children) {
    const { match, pseudoElement } = domSelector.check(csstree.generate(selector), elementImpl);
    if (match && !pseudoElement) {
      return true;
    }
  }
  return false;
}

function replaceEmptyValueAndKeywords(
  property,
  value,
  elementImpl,
  { inherit, initial, isColor }
) {
  if (value === "") {
    if (!inherit || !elementImpl.parentElement) {
      return initial;
    }
    value = getInheritedPropertyValue(property, elementImpl, { inherit, initial, isColor });
  }

  if (isGlobalKeyword(value)) {
    value = replaceGlobalKeywords(property, value, elementImpl, { inherit, initial, isColor });
  }

  return value;
}

function getInheritedPropertyValue(property, elementImpl, { inherit, initial, isColor }) {
  const parent = elementImpl.parentElement;
  if (!parent) {
    return initial;
  }

  if (!isColor) {
    // Inheritance transfers the computed value, not the resolved value getPropertyValue() returns.
    // The parent's computed value already accounts for inheritance, even when it is empty.
    return getCachedDeclaration(parent)._getComputedPropertyValue(property);
  }

  // `@asamuzakjp/css-color` resolves inherited specified colors, so find the nearest ancestor that
  // specifies one.
  for (let ancestor = parent; ancestor; ancestor = ancestor.parentElement) {
    const declaration = getCachedDeclaration(ancestor);
    let value = declaration._getSpecifiedPropertyValue(property);
    // If the value is a system color value, retrieve it again as a computed value.
    if (value && systemColors.has(asciiLowercase(value))) {
      value = declaration._getPropertyValue(property);
    }
    if (value) {
      if (isGlobalKeyword(value)) {
        return replaceGlobalKeywords(property, value, ancestor, { inherit, initial, isColor });
      }
      return value;
    }
    if (!inherit) {
      break;
    }
  }

  return initial;
}

function replaceGlobalKeywords(property, value, elementImpl, { inherit, initial, isColor }) {
  let element = elementImpl;
  while (element) {
    switch (value) {
      case "initial": {
        return initial;
      }
      case "inherit": {
        if (!element.parentElement) {
          return initial;
        }
        value = getInheritedPropertyValue(property, element, { inherit, initial, isColor });
        break;
      }
      case "unset": {
        if (!inherit || !element.parentElement) {
          return initial;
        }
        value = getInheritedPropertyValue(property, element, { inherit, initial, isColor });
        break;
      }
      case "revert-layer": {
        // TODO: https://drafts.csswg.org/css-cascade-5/#revert-layer
        return value;
      }
      case "revert": {
        // TODO: https://drafts.csswg.org/css-cascade-5/#default
        return value;
      }
      default: {
        // fall through; value is not a CSS-wide keyword.
      }
    }
    if (element.parentElement) {
      if (!value) {
        element = element.parentElement;
      } else if (isGlobalKeyword(value)) {
        return replaceGlobalKeywords(property, value, element, { inherit, initial, isColor });
      } else {
        return value;
      }
    } else {
      return initial;
    }
  }

  return value;
}

function getParentFontSizeInPixels(elementImpl) {
  const fontSize = getComputedStylePropertyValue(elementImpl.parentElement, "font-size");
  if (absoluteFontSize.has(fontSize)) {
    return absoluteFontSize.get(fontSize).px;
  }

  const parsed = parseFloat(fontSize);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  // Fallback to initial font-size (medium)
  return absoluteFontSize.get("medium").px;
}

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
exports.cascadeProperty = cascadeProperty;
exports.getComputedStylePropertyValue = getComputedStylePropertyValue;
exports.getComputedStyleDeclaration = getComputedStyleDeclaration;
exports.getInheritedPropertyValue = getInheritedPropertyValue;
exports.getParentFontSizeInPixels = getParentFontSizeInPixels;
exports.replaceEmptyValueAndKeywords = replaceEmptyValueAndKeywords;
