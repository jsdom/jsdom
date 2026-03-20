"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { parseStyleSheet } = require("./css-parser");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const Specificity = require("@bramus/specificity").default;
const CSSStyleProperties = require("../../../../generated/idl/CSSStyleProperties.js");
const { evaluateMediaList } = require("../MediaList-impl.js");
const { isGlobalKeyword } = require("./css-values");

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

    for (let i = 0; i < cachedDeclaration.length; i++) {
      const property = cachedDeclaration.item(i);
      const value = cachedDeclaration.getPropertyValue(property);
      const priority = cachedDeclaration.getPropertyPriority(property);
      clonedDeclaration.setProperty(property, value, priority);
    }

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

  applyStyleSheetRules(elementImpl, declaration);

  for (let i = 0; i < style.length; i++) {
    handlePropertyForInlineStyle(style.item(i), declaration, style);
  }

  styleCache.set(elementImpl, declaration);

  return declaration;
}

function applyStyleSheetRules(elementImpl, declaration) {
  if (!parsedDefaultStyleSheet) {
    // The parsed default stylesheet will be composed of CSSOM objects from the first global object accessed. This is a
    // bit strange, but since we only ever access the internals of `parsedDefaultStyleSheet`, and don't expose it to
    // callers, it shouldn't cause any issues.
    parsedDefaultStyleSheet = parseStyleSheet(defaultStyleSheet, elementImpl._globalObject);
  }

  const specificities = new Map();
  handleSheet(parsedDefaultStyleSheet, elementImpl, declaration, specificities);
  for (const sheetImpl of elementImpl._ownerDocument.styleSheets._list) {
    handleSheet(sheetImpl, elementImpl, declaration, specificities);
  }
}

function handleSheet(sheetImpl, elementImpl, declaration, specificities) {
  for (const ruleImpl of sheetImpl.cssRules._list) {
    if (CSSImportRule.isImpl(ruleImpl)) {
      if (ruleImpl.styleSheet !== null && evaluateMediaList(ruleImpl.media._list)) {
        for (const innerRule of ruleImpl.styleSheet.cssRules._list) {
          handleRule(innerRule, elementImpl, declaration, specificities);
        }
      }
    } else if (CSSMediaRule.isImpl(ruleImpl)) {
      if (evaluateMediaList(ruleImpl.media._list)) {
        for (const innerRule of ruleImpl.cssRules._list) {
          handleRule(innerRule, elementImpl, declaration, specificities);
        }
      }
    } else if (CSSStyleRule.isImpl(ruleImpl)) {
      handleRule(ruleImpl, elementImpl, declaration, specificities);
    }
  }
}

function handleRule(ruleImpl, elementImpl, declaration, specificities) {
  const { ast, match } = matches(ruleImpl.selectorText, elementImpl);
  if (match) {
    handleStyle(ruleImpl.style, declaration, specificities, ast);
  }
}

function handleStyle(style, declaration, specificities, ast) {
  for (let i = 0; i < style.length; i++) {
    const property = style.item(i);
    handleProperty(property, declaration, style, specificities, ast);
  }
}

function handleProperty(property, declaration, style, specificities, ast) {
  const value = style.getPropertyValue(property);
  const priority = style.getPropertyPriority(property);
  if (priority) {
    declaration.setProperty(property, value, priority);
  } else if (!declaration.getPropertyPriority(property)) {
    const { value: specificity } = Specificity.max(...Specificity.calculate(ast));
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

function matches(selectorText, elementImpl) {
  try {
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
  } catch {
    // fall through
  }
  return {
    match: false
  };
}

function preparePartiallyResolvedValue(property, value, elementImpl, { inherit, initial, longhands }) {
  if (value === "") {
    if (longhands) {
      return "";
    } else if (inherit && elementImpl.parentElement) {
      return getInheritedPropertyValue(property, elementImpl, { inherit, initial });
    }
    return initial;
  }

  if (isGlobalKeyword(value)) {
    return resolveGlobalKeywords(property, value, elementImpl, { inherit, initial });
  }

  return value;
}

function getInheritedPropertyValue(property, elementImpl, { inherit, initial }) {
  const styleCache = elementImpl._ownerDocument._styleCache;
  const { parentElement } = elementImpl;
  if (!parentElement) {
    return initial;
  }

  let parent = parentElement;
  while (parent) {
    let declaration;
    if (styleCache.has(parent)) {
      declaration = styleCache.get(parent);
    } else {
      declaration = prepareComputedStyleDeclaration(parent, styleCache);
    }
    const value = declaration.getPropertyValue(property);
    if (value) {
      return value;
    } else if (!parent.parentElement || !inherit) {
      break;
    }
    parent = parent.parentElement;
  }

  return initial;
}

function resolveGlobalKeywords(property, value, elementImpl, { inherit, initial }) {
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
        value = getInheritedPropertyValue(property, element, { inherit, initial });
        break;
      }
      case "unset": {
        if (!inherit || !element.parentElement) {
          return initial;
        }
        value = getInheritedPropertyValue(property, element, { inherit, initial });
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
        return resolveGlobalKeywords(property, value, element, { inherit, initial });
      } else {
        return value;
      }
    } else {
      return initial;
    }
  }

  return value;
}

function invalidateStyleCache(elementImpl) {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = new WeakMap();
  }
}

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
exports.getComputedStyleDeclaration = getComputedStyleDeclaration;
exports.getInheritedPropertyValue = getInheritedPropertyValue;
exports.invalidateStyleCache = invalidateStyleCache;
exports.prepareComputedStyleDeclaration = prepareComputedStyleDeclaration;
exports.preparePartiallyResolvedValue = preparePartiallyResolvedValue;
exports.resolveGlobalKeywords = resolveGlobalKeywords;
