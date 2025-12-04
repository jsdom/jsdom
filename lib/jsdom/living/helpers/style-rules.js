"use strict";
const fs = require("node:fs");
const path = require("node:path");
const cssom = require("@acemir/cssom");
const cssstyle = require("cssstyle");
const CSSStyleProperties = require("../generated/CSSStyleProperties");
const NODE_TYPE = require("../node-type");
const { asciiLowercase } = require("./strings");
const { deprecatedAliases, systemColors } = require("./system-colors");

const propertyDefinitions = new Map(Object.entries(cssstyle.propertyDefinitions));
const initializableProperties = new Set(getInitializableProperties(propertyDefinitions));
const defaultStyleSheet = cssom.parse(fs.readFileSync(
  path.resolve(__dirname, "../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
));

function getInitializableProperties(definitions) {
  return [...definitions].map(arr => {
    const [key, { inherited, initial }] = arr;
    if (!initial || initial.includes(" ")) {
      return false;
    } else if (!inherited || !/^(?:yes|no)$/i.test(inherited)) {
      return false;
    }
    return key;
  }).filter(key => key);
}

function matchSelector(selectorText, elementImpl) {
  const domSelector = elementImpl._ownerDocument._domSelector;
  const { match, pseudoElement } = domSelector.check(selectorText, elementImpl);
  // `pseudoElement` is a pseudo-element selector (e.g. `::before`).
  // However, we do not support getComputedStyle(element, pseudoElement), so return `false`.
  if (pseudoElement) {
    return false;
  }
  return match;
}

function matches(rule, elementImpl) {
  try {
    if (rule.selectorText) {
      return matchSelector(rule.selectorText, elementImpl);
    }
  } catch {
    // Fall through.
  }
  return false;
}

function getPropertyValueFromAncestor(property, elementImpl, opt) {
  const { styleCache } = opt;
  const { initial } = propertyDefinitions.get(property);
  let node = elementImpl.parentElement;
  if (!node) {
    return initial;
  }
  while (node) {
    if (!styleCache.has(node)) {
      setDeclarationForElement(node, opt);
    }
    const declaration = styleCache.get(node);
    const value = declaration.getPropertyValue(property);
    if (value) {
      return value;
    }
    // Move to parent or shadow host.
    // If the node is a DocumentFragment (Shadow Root), we need to check its host element.
    if (node.parentElement) {
      node = node.parentElement;
    } else if (node.parentNode && node.parentNode.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      node = node.parentNode.host;
    } else {
      // No more parents.
      return initial;
    }
  }
  return initial;
}

function resolveColorValue(declaration, opt) {
  const { colorProperties } = opt;
  const currentColor = declaration.getPropertyValue("color");
  const colorScheme = declaration.getPropertyValue("color-scheme");
  for (const property of colorProperties) {
    let colorValue = declaration.getPropertyValue(property);
    if (colorValue === "currentcolor") {
      colorValue = currentColor;
    }
    if (systemColors.has(colorValue) || deprecatedAliases.has(colorValue)) {
      let key = colorValue;
      if (deprecatedAliases.has(colorValue)) {
        key = deprecatedAliases.get(colorValue);
      }
      const { light, dark } = systemColors.get(key);
      if (colorScheme === "dark") {
        colorValue = dark;
      } else {
        colorValue = light;
      }
    }
    const priority = declaration.getPropertyPriority(property) ?? "";
    declaration.setProperty(property, colorValue, priority);
  }
}

// @see https://drafts.csswg.org/css-cascade/#defaulting-keywords
function resolveKeyword(lowercasedValue, property, elementImpl, opt) {
  const { inherited, initial } = propertyDefinitions.get(property);
  switch (lowercasedValue) {
    case "initial": {
      return initial;
    }
    case "inherit": {
      if (elementImpl.parentElement === null) {
        return initial;
      }
      return getPropertyValueFromAncestor(property, elementImpl, opt);
    }
    case "unset": {
      if (inherited !== "yes" || elementImpl.parentElement === null) {
        return initial;
      }
      return getPropertyValueFromAncestor(property, elementImpl, opt);
    }
    // TODO: https://drafts.csswg.org/css-cascade-5/#revert-layer
    case "revert-layer": {
      return null;
    }
    // TODO: https://drafts.csswg.org/css-cascade-5/#default
    case "revert": {
      return null;
    }
  }
  return null;
}

// @see https://drafts.csswg.org/css-color-4/#resolving-other-colors
function resolveCurrentColorOrSystemColor(value, property, elementImpl, opt) {
  let colorValue = asciiLowercase(value);
  const { colorProperties } = opt;
  const { initial } = propertyDefinitions.get(property);
  if (colorValue === "currentcolor") {
    if (property === "color") {
      if (elementImpl.parentElement === null) {
        colorValue = initial;
      } else {
        colorValue = getPropertyValueFromAncestor(property, elementImpl, opt);
      }
    } else {
      colorProperties.add(property);
    }
    return colorValue;
  }
  if (systemColors.has(colorValue) || deprecatedAliases.has(colorValue)) {
    colorProperties.add(property);
    return colorValue;
  }
  return value;
}

function resolveValue(value, property, elementImpl, opt) {
  const { computedValue, inherited, initial } = propertyDefinitions.get(property);
  if (value === "") {
    if (inherited === "no" || elementImpl.parentElement === null) {
      value = initial;
    } else {
      value = getPropertyValueFromAncestor(property, elementImpl, opt);
    }
  }
  const lowercasedValue = asciiLowercase(value);
  const keywordValue = resolveKeyword(lowercasedValue, property, elementImpl, opt);
  let specifiedValue = keywordValue !== null ? keywordValue : value;
  if (computedValue === "as specified" || computedValue === "specified keyword") {
    return specifiedValue;
  }
  if (/^(?:a |the )?computed color/i.test(computedValue)) {
    specifiedValue = resolveCurrentColorOrSystemColor(specifiedValue, property, elementImpl, opt);
  }
  return specifiedValue;
}

function handleProperty(property, style, elementImpl, declaration, opt) {
  const value = style.getPropertyValue(property) ?? "";
  const resolvedValue = resolveValue(value, property, elementImpl, opt);
  const priority = style.getPropertyPriority(property) ?? "";
  declaration.setProperty(property, resolvedValue, priority);
  return declaration;
}

function handleStyle(style, elementImpl, declaration, opt) {
  const l = style.length;
  for (let i = 0; i < l; i++) {
    const property = style.item(i);
    if (propertyDefinitions.has(property)) {
      handleProperty(property, style, elementImpl, declaration, opt);
    } else if (property.startsWith("--")) {
      const value = style.getPropertyValue(property);
      const priority = style.getPropertyPriority(property) ?? "";
      declaration.setProperty(property, value, priority);
    }
  }
  return declaration;
}

function handleImportRule(rule, elementImpl, declaration, opt) {
  handleSheet(rule.__styleSheet, elementImpl, declaration, opt);
}

function handleMediaRule(rule, elementImpl, declaration, opt) {
  if (rule.media.mediaText.includes("screen")) {
    for (const cssRule of rule.cssRules) {
      handleStyleRule(cssRule, elementImpl, declaration, opt);
    }
  }
}

function handleStyleRule(rule, elementImpl, declaration, opt) {
  if (matches(rule, elementImpl)) {
    handleStyle(rule.style, elementImpl, declaration, opt);
  }
}

function handleSheet(sheet, elementImpl, declaration, opt) {
  for (const rule of sheet.cssRules) {
    if (rule instanceof cssom.CSSImportRule) {
      handleImportRule(rule, elementImpl, declaration, opt);
    } else if (rule.media) {
      handleMediaRule(rule, elementImpl, declaration, opt);
    } else {
      handleStyleRule(rule, elementImpl, declaration, opt);
    }
  }
  return declaration;
}

function applyInitialValues(declaration, elementImpl, opt) {
  for (const property of initializableProperties) {
    const initialValue = resolveValue("", property, elementImpl, opt);
    declaration.setProperty(property, initialValue, "");
  }
}

function applySheetRules(elementImpl, declaration, opt) {
  handleSheet(defaultStyleSheet, elementImpl, declaration, opt);
  for (const sheet of elementImpl._ownerDocument.styleSheets._list) {
    handleSheet(sheet, elementImpl, declaration, opt);
  }
  return declaration;
}

function applyInlineStyle(declaration, elementImpl, opt) {
  const l = elementImpl._style.length;
  for (let i = 0; i < l; i++) {
    const property = elementImpl._style.item(i);
    if (propertyDefinitions.has(property)) {
      handleProperty(property, elementImpl._style, elementImpl, declaration, opt);
    } else if (/^--[A-Za-z\d-]+$/.test(property)) {
      const value = elementImpl._style.getPropertyValue(property);
      const priority = elementImpl._style.getPropertyPriority(property) ?? "";
      declaration.setProperty(property, value, priority);
    }
  }
}

function setDeclarationForElement(elementImpl, opt) {
  const { colorProperties, initialize, styleCache } = opt;
  const declaration = CSSStyleProperties.createImpl(elementImpl._globalObject, [], {
    options: {
      format: "computedValue"
    }
  });
  colorProperties.clear();
  // CSS Cascade: 1. Initial values (if enabled).
  if (initialize) {
    applyInitialValues(declaration, elementImpl, opt);
  }
  // 2. Normal rules from stylesheets.
  applySheetRules(elementImpl, declaration, opt);
  // 3. Inline styles (highest specificity in this context).
  applyInlineStyle(declaration, elementImpl, opt);
  // Resolution of computed values that depend on color properties (e.g. currentColor).
  if (colorProperties.size) {
    resolveColorValue(declaration, opt);
  }
  colorProperties.clear();
  styleCache.set(elementImpl, declaration);
  return declaration;
}

exports.getDeclarationForElement = elementImpl => {
  const styleCache = elementImpl._ownerDocument._styleCache ?? new WeakMap();
  const ancestors = [];
  let parent = elementImpl.parentElement;
  while (parent) {
    ancestors.push(parent);
    if (parent.parentElement) {
      parent = parent.parentElement;
    } else {
      break;
    }
  }
  // Context object for style resolution.
  // - styleCache: WeakMap<Element, CSSStyleDeclaration> (Cache for computed styles)
  // - colorProperties: Set<string> (Properties involved in color resolution to detect cycles)
  // - initialize: boolean (Whether to apply initial values)
  const opt = {
    styleCache,
    colorProperties: new Set(),
    initialize: false
  };
  const l = ancestors.length;
  for (let i = l - 1; i >= 0; i--) {
    const node = ancestors[i];
    if (!styleCache.has(node)) {
      setDeclarationForElement(node, opt);
    }
  }
  opt.initialize = true;
  // TODO: Prepare options, e.g. custom properties, font size (em), dimensions.
  const declaration = setDeclarationForElement(elementImpl, opt);
  // TODO: Once the declaration is ready, make the declaration read-only.
  return declaration;
};

exports.invalidateStyleCache = elementImpl => {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = null;
  }
};

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
