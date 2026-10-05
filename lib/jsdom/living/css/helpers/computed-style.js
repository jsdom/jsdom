"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Specificity = require("@bramus/specificity").default;
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const CSSStyleProperties = require("../../../../generated/idl/CSSStyleProperties.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const { asciiLowercase } = require("../../helpers/strings.js");
const { evaluateMediaList } = require("../MediaList-impl.js");
const { parseStyleSheet } = require("./css-parser.js");
const { isGlobalKeyword } = require("./css-values.js");
const { absoluteFontSize } = require("./font-sizes.js");
const { systemColors } = require("./system-colors.js");

const defaultStyleSheet = fs.readFileSync(
  path.resolve(__dirname, "../../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
);
let parsedDefaultStyleSheet;

function getComputedStyleDeclaration(elementImpl) {
  const styleCache = elementImpl._ownerDocument._styleCache;
  const cachedDeclaration = styleCache.get(elementImpl);
  if (cachedDeclaration) {
    const clonedDeclaration = CSSStyleProperties.createImpl(elementImpl._globalObject, [], {
      computed: true,
      ownerNode: elementImpl
    });

    clonedDeclaration._copyDeclarationsFrom(cachedDeclaration);
    clonedDeclaration._readonly = true;

    return clonedDeclaration;
  }

  const declaration = prepareComputedStyleDeclaration(elementImpl, styleCache);
  declaration._readonly = true;

  return declaration;
}

function prepareComputedStyleDeclaration(elementImpl, styleCache) {
  const { style } = elementImpl;
  const declaration = CSSStyleProperties.createImpl(elementImpl._globalObject, [], {
    computed: true,
    ownerNode: elementImpl
  });

  // Cache the declaration before processing.
  styleCache.set(elementImpl, declaration);

  applyStyleSheetRules(elementImpl, declaration);

  // Not every element implements `ElementCSSInlineStyle`.
  if (style) {
    for (let i = 0; i < style.length; i++) {
      handlePropertyForInlineStyle(style.item(i), declaration, style);
    }
  }

  return declaration;
}

function applyStyleSheetRules(elementImpl, declaration) {
  const specificities = new Map();
  forEachStyleRule(elementImpl, ruleImpl => {
    handleRule(ruleImpl, elementImpl, declaration, specificities);
  });
}

// Calls `callback` with each style rule that applies to the element's document, in cascade order. If `property` is
// given, top-level rules whose declaration of it does not satisfy `predicate` are skipped, but callers must still
// check the rules nested in media rules.
function forEachStyleRule(elementImpl, callback, property, predicate = isDeclared) {
  if (!parsedDefaultStyleSheet) {
    // The parsed default stylesheet will be composed of CSSOM objects from the first global object accessed. This is a
    // bit strange, but since we only ever access the internals of `parsedDefaultStyleSheet`, and don't expose it to
    // callers, it shouldn't cause any issues.
    parsedDefaultStyleSheet = parseStyleSheet(defaultStyleSheet, elementImpl._globalObject);
  }

  handleSheet(parsedDefaultStyleSheet, callback, property, predicate);
  for (const sheetImpl of elementImpl._ownerDocument.styleSheets._list) {
    handleSheet(sheetImpl, callback, property, predicate);
  }
}

function handleSheet(sheetImpl, callback, property, predicate) {
  const rules = property === undefined ? sheetImpl.cssRules._list : getRulesDeclaring(sheetImpl, property, predicate);
  for (const ruleImpl of rules) {
    if (CSSImportRule.isImpl(ruleImpl)) {
      if (ruleImpl.styleSheet !== null && evaluateMediaList(ruleImpl.media._list)) {
        handleSheet(ruleImpl.styleSheet, callback, property, predicate);
      }
    } else if (CSSMediaRule.isImpl(ruleImpl)) {
      if (evaluateMediaList(ruleImpl.media._list)) {
        for (const innerRule of ruleImpl.cssRules._list) {
          callback(innerRule);
        }
      }
    } else if (CSSStyleRule.isImpl(ruleImpl)) {
      callback(ruleImpl);
    }
  }
}

/**
 * Returns whether any declaration of a property that applies to the element has a value satisfying `predicate`.
 * Since the cascaded value is the value of one of these declarations, this can rule out values without running the
 * cascade, and only needs to match the selectors of rules whose value satisfies `predicate`.
 *
 * @param {Element} elementImpl - The element.
 * @param {string} property - The property name. Shorthands are not supported.
 * @param {function(string): boolean} predicate - Tests a declared value. It is used as a cache key, so it must not be
 *   created for each call.
 * @returns {boolean} Whether a matching declaration was found.
 */
function hasMatchingDeclaration(elementImpl, property, predicate) {
  const { style } = elementImpl;
  if (style) {
    const inlineValue = style.getPropertyValue(property);
    if (inlineValue && predicate(inlineValue)) {
      return true;
    }
  }

  let found = false;
  forEachStyleRule(elementImpl, ruleImpl => {
    if (found) {
      return;
    }
    const ruleValue = ruleImpl.style?.getPropertyValue(property);
    if (ruleValue && predicate(ruleValue) && ruleMightMatchElement(ruleImpl, elementImpl) &&
        matches(ruleImpl.selectorText, elementImpl).match) {
      found = true;
    }
  }, property, predicate);
  return found;
}

/**
 * Returns the cascaded value (https://drafts.csswg.org/css-cascade/#cascaded) of a single property: the value of
 * the declaration that wins the cascade, before CSS-wide keywords and var() are resolved. Returns the empty string if
 * no declaration applies.
 *
 * This follows the same cascade as computing a whole style declaration, but only matches the selectors of rules
 * that declare the property, so it is much cheaper when a single property is needed.
 *
 * @param {Element} elementImpl - The element.
 * @param {string} property - The property name. Shorthands are not supported.
 * @returns {string} The cascaded value.
 */
function getCascadedPropertyValue(elementImpl, property) {
  let value = "";
  let important = false;
  let specificity;
  forEachStyleRule(elementImpl, ruleImpl => {
    // Grouping rules nested in media rules are passed through without a `style`.
    const ruleValue = ruleImpl.style?.getPropertyValue(property);
    if (!ruleValue) {
      return;
    }
    const ruleImportant = ruleImpl.style.getPropertyPriority(property) === "important";
    if (important && !ruleImportant) {
      return;
    }
    if (!ruleMightMatchElement(ruleImpl, elementImpl)) {
      return;
    }
    const { ast, match } = matches(ruleImpl.selectorText, elementImpl);
    if (!match) {
      return;
    }
    // Mirror `handleProperty()`: important declarations win in order, others by specificity and then order.
    if (ruleImportant) {
      value = ruleValue;
      important = true;
    } else {
      const { value: ruleSpecificity } = Specificity.max(...Specificity.calculate(ast));
      if (specificity === undefined || Specificity.compare(ruleSpecificity, specificity) >= 0) {
        value = ruleValue;
        specificity = ruleSpecificity;
      }
    }
  }, property);

  // Not every element implements `ElementCSSInlineStyle`.
  const { style } = elementImpl;
  if (style) {
    const inlineValue = style.getPropertyValue(property);
    if (inlineValue && (!important || style.getPropertyPriority(property) === "important")) {
      value = inlineValue;
    }
  }

  return value;
}

function isDeclared(value) {
  return value !== "";
}

// Returns the subset of the sheet's top-level rules whose declaration of `property` satisfies `predicate`, keeping
// import and media rules since whether they apply is evaluated on each use. The result is cached until the sheet's
// rules or declarations change.
function getRulesDeclaring(sheetImpl, property, predicate) {
  sheetImpl._rulesDeclaringCache ??= new Map();
  let rulesByPredicate = sheetImpl._rulesDeclaringCache.get(property);
  if (!rulesByPredicate) {
    rulesByPredicate = new Map();
    sheetImpl._rulesDeclaringCache.set(property, rulesByPredicate);
  }

  let rules = rulesByPredicate.get(predicate);
  if (!rules) {
    rules = sheetImpl.cssRules._list.filter(ruleImpl => {
      if (CSSStyleRule.isImpl(ruleImpl)) {
        const value = ruleImpl.style.getPropertyValue(property);
        return value !== "" && predicate(value);
      }
      return CSSImportRule.isImpl(ruleImpl) || CSSMediaRule.isImpl(ruleImpl);
    });
    rulesByPredicate.set(predicate, rules);
  }
  return rules;
}

function handleRule(ruleImpl, elementImpl, declaration, specificities) {
  if (ruleMightMatchElement(ruleImpl, elementImpl)) {
    const { ast, match } = matches(ruleImpl.selectorText, elementImpl);
    if (match) {
      // The specificity only depends on the selector AST, not on any individual property, so it is computed once per
      // rule rather than once per property. This is a significant win for rules with many declarations.
      const { value: specificity } = Specificity.max(...Specificity.calculate(ast));
      handleStyle(ruleImpl.style, declaration, specificities, specificity);
    }
  }
}

function handleStyle(style, declaration, specificities, specificity) {
  for (let i = 0; i < style.length; i++) {
    const property = style.item(i);
    handleProperty(property, declaration, style, specificities, specificity);
  }
}

function handleProperty(property, declaration, style, specificities, specificity) {
  const value = style.getPropertyValue(property);
  const priority = style.getPropertyPriority(property);
  if (priority) {
    declaration.setProperty(property, value, priority);
  } else if (!declaration.getPropertyPriority(property)) {
    if (specificities.has(property)) {
      if (Specificity.compare(specificity, specificities.get(property)) >= 0) {
        specificities.set(property, specificity);
        declaration.setProperty(property, value);
      }
    } else {
      specificities.set(property, specificity);
      declaration.setProperty(property, value);
    }
  }
}

function handlePropertyForInlineStyle(property, declaration, style) {
  const value = style.getPropertyValue(property);
  const priority = style.getPropertyPriority(property);
  if (!declaration.getPropertyPriority(property) || priority) {
    declaration.setProperty(property, value, priority);
  }
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
  // `pseudoElement` is a pseudo-element selector (e.g. `::before`).
  // However, we do not support getComputedStyle(element, pseudoElement), so `match` is set to `false`.
  if (pseudoElement) {
    return {
      match: false
    };
  }
  return { ast, match, pseudoElement };
}

function replaceEmptyValueAndKeywords(
  property,
  value,
  elementImpl,
  { inherit, initial, isColor, longhands }
) {
  if (value === "") {
    if (longhands) {
      return "";
    } else if (!inherit || !elementImpl.parentElement) {
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
  const styleCache = elementImpl._ownerDocument._styleCache;

  let parent = elementImpl.parentElement;
  while (parent) {
    let declaration, value;
    if (styleCache.has(parent)) {
      declaration = styleCache.get(parent);
    } else {
      declaration = prepareComputedStyleDeclaration(parent, styleCache);
    }
    if (isColor) {
      // For color-related properties, unset the _computed flag to retrieve the specified value.
      // @asamuzakjp/css-color handles the resolution of the specified value.
      declaration._computed = false;
      value = declaration.getPropertyValue(property);
      // Restore the _computed flag.
      declaration._computed = true;
      // If the value is a system color value, retrieve it again as a computed value.
      if (value && systemColors.has(asciiLowercase(value))) {
        value = declaration.getPropertyValue(property);
      }
    } else {
      // Inheritance transfers the computed value, not the resolved value getPropertyValue() returns.
      // The parent's computed value already accounts for inheritance, even when it is empty.
      return declaration._getComputedPropertyValue(property);
    }
    if (value) {
      if (isColor && isGlobalKeyword(value)) {
        return replaceGlobalKeywords(property, value, parent, { inherit, initial, isColor });
      }
      return value;
    } else if (!parent.parentElement || !inherit) {
      break;
    }
    parent = parent.parentElement;
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
  const styleCache = elementImpl._ownerDocument._styleCache;
  const parent = elementImpl.parentElement;
  let declaration;
  if (styleCache.has(parent)) {
    declaration = styleCache.get(parent);
  } else {
    declaration = prepareComputedStyleDeclaration(parent, styleCache);
  }

  const fontSize = declaration.getPropertyValue("font-size");
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
exports.getCascadedPropertyValue = getCascadedPropertyValue;
exports.getComputedStyleDeclaration = getComputedStyleDeclaration;
exports.getInheritedPropertyValue = getInheritedPropertyValue;
exports.getParentFontSizeInPixels = getParentFontSizeInPixels;
exports.hasMatchingDeclaration = hasMatchingDeclaration;
exports.replaceEmptyValueAndKeywords = replaceEmptyValueAndKeywords;
