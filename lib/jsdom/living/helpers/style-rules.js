"use strict";
const path = require("node:path");
const fs = require("node:fs");
const cssom = require("@acemir/cssom");
const cssstyle = require("cssstyle");
const CSSStyleProperties = require("../generated/CSSStyleProperties");
const NODE_TYPE = require("../node-type");
const { asciiLowercase } = require("./strings");
const { deprecatedAliases, systemColors } = require("./system-colors");

const defaultStyleSheet = fs.readFileSync(
  path.resolve(__dirname, "../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
);
const propertyList = new Map(Object.entries(cssstyle.propertyList));
const initializableProperties = new Set([...propertyList].map(arr => {
  const [key, { inherited, initial }] = arr;
  if (!initial || initial.includes(" ")) {
    return false;
  } else if (!inherited || !/^(?:yes|no)$/i.test(inherited)) {
    return false;
  }
  return key;
}).filter(key => key));

function matches(rule, elementImpl) {
  try {
    if (rule.selectorText) {
      const domSelector = elementImpl._ownerDocument._domSelector;
      const selector = rule.selectorText;
      const { match, pseudoElement } = domSelector.check(selector, elementImpl);
      // `pseudoElement` is a pseudo-element selector (e.g. `::before`).
      // However, we do not support getComputedStyle(element, pseudoElement), so return `false`.
      if (pseudoElement) {
        return false;
      }
      return match;
    }
  } catch {
    // fall through
  }
  return false;
}

function getPropertyValueFromAncestor(property, elementImpl, opt) {
  const { styleCache } = opt;
  const { initial } = propertyList.get(property);
  if (!elementImpl.parentElement) {
    return initial;
  }
  let value = "";
  let node = elementImpl.parentElement;
  while (node) {
    if (!styleCache.has(node)) {
      setDeclarationForElement(node, opt);
    }
    const declaration = styleCache.get(node);
    value = declaration.getPropertyValue(property);
    if (value) {
      break;
    }
    if (node.parentElement) {
      node = node.parentElement;
    } else if (node.parentNode && node.parentNode.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      const { host } = node.parentNode;
      if (host) {
        node = host;
      } else {
        value = initial;
        break;
      }
    } else {
      value = initial;
      break;
    }
  }
  return value;
}

// TODO: port this feature to cssstyle and let cssstyle take care of color values
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
    const priority = declaration.getPropertyPriority(property);
    declaration.setProperty(property, colorValue, priority ?? "");
  }
}

function resolveValue(value, property, elementImpl, opt) {
  const { computedValue, inherited, initial } = propertyList.get(property);
  const { colorProperties } = opt;
  if (value === "") {
    if (inherited === "no" || elementImpl.parentElement === null) {
      value = initial;
    } else {
      value = getPropertyValueFromAncestor(property, elementImpl, opt);
    }
  }
  const lowercasedValue = asciiLowercase(value);
  let specifiedValue = value;
  // https://drafts.csswg.org/css-cascade/#defaulting-keywords
  switch (lowercasedValue) {
    case "initial": {
      specifiedValue = initial;
      break;
    }
    case "inherit": {
      if (elementImpl.parentElement === null) {
        specifiedValue = initial;
      } else {
        specifiedValue = getPropertyValueFromAncestor(property, elementImpl, opt);
      }
      break;
    }
    case "unset": {
      if (inherited !== "yes" || elementImpl.parentElement === null) {
        specifiedValue = initial;
      } else {
        specifiedValue = getPropertyValueFromAncestor(property, elementImpl, opt);
      }
      break;
    }
    // TODO: https://drafts.csswg.org/css-cascade-5/#revert-layer
    case "revert-layer": {
      break;
    }
    // TODO: https://drafts.csswg.org/css-cascade-5/#default
    case "revert": {
      break;
    }
    default: {
      // fall through; specifiedValue is not a CSS-wide keyword.
    }
  }
  if (computedValue === "as specified") {
    return specifiedValue;
  }
  if (/^(?:a |the )?computed color/i.test(computedValue)) {
    let colorValue = asciiLowercase(specifiedValue);
    // https://drafts.csswg.org/css-color-4/#resolving-other-colors
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
      specifiedValue = colorValue;
    }
    if (systemColors.has(colorValue) || deprecatedAliases.has(colorValue)) {
      colorProperties.add(property);
      specifiedValue = colorValue;
    }
  }
  return specifiedValue;
}

function handleProperty(property, style, elementImpl, declaration, opt) {
  const value = style.getPropertyValue(property);
  const resolvedValue = resolveValue(value ?? "", property, elementImpl, opt);
  const priority = style.getPropertyPriority(property);
  declaration.setProperty(property, resolvedValue, priority ?? "");
  return declaration;
}

function handleStyle(style, elementImpl, declaration, opt) {
  const { customProperties } = opt;
  const l = style.length;
  for (let i = 0; i < l; i++) {
    const property = style.item(i);
    if (propertyList.has(property)) {
      handleProperty(property, style, elementImpl, declaration, opt);
    } else if (property.startsWith("--")) {
      const value = style.getPropertyValue(property);
      const priority = style.getPropertyPriority(property);
      customProperties.set(property, value);
      declaration.setProperty(property, value, priority ?? "");
    }
  }
  return declaration;
}

function handleSheet(sheet, elementImpl, declaration, opt) {
  for (const rule of sheet.cssRules) {
    if (rule.media) {
      if (rule.media.mediaText.includes("screen")) {
        for (const cssRule of rule.cssRules) {
          if (matches(cssRule, elementImpl)) {
            handleStyle(cssRule.style, elementImpl, declaration, opt);
          }
        }
      }
    } else if (matches(rule, elementImpl)) {
      handleStyle(rule.style, elementImpl, declaration, opt);
    }
  }
  return declaration;
}

function forEachMatchingSheetRuleOfElement(elementImpl, declaration, opt) {
  const { parsedDefaultStyleSheet } = opt;
  handleSheet(parsedDefaultStyleSheet, elementImpl, declaration, opt);
  for (const sheet of elementImpl._ownerDocument.styleSheets._list) {
    handleSheet(sheet, elementImpl, declaration, opt);
  }
  return declaration;
}

function setDeclarationForElement(elementImpl, opt, initialize = false) {
  const { colorProperties, customProperties, styleCache } = opt;
  if (!initialize) {
    const cachedDeclaration = styleCache.get(elementImpl);
    if (cachedDeclaration) {
      return cachedDeclaration;
    }
  }
  colorProperties.clear();
  const privateData = {
    options: {
      format: "computedValue"
    }
  };
  const declaration = CSSStyleProperties.createImpl(elementImpl._globalObject, [], privateData);
  if (initialize) {
    for (const property of initializableProperties) {
      const initialValue = resolveValue("", property, elementImpl, opt);
      declaration.setProperty(property, initialValue, "");
    }
  }
  forEachMatchingSheetRuleOfElement(elementImpl, declaration, opt);
  const l = elementImpl._style.length;
  for (let i = 0; i < l; i++) {
    const property = elementImpl._style.item(i);
    if (propertyList.has(property)) {
      handleProperty(property, elementImpl._style, elementImpl, declaration, opt);
    } else if (/^--[A-Za-z\d-]+$/.test(property)) {
      const value = elementImpl._style.getPropertyValue(property);
      const priority = elementImpl._style.getPropertyPriority(property);
      customProperties.set(property, value);
      declaration.setProperty(property, value, priority ?? "");
    }
  }
  if (colorProperties.size) {
    resolveColorValue(declaration, opt);
  }
  colorProperties.clear();
  styleCache.set(elementImpl, declaration);
  return declaration;
}

exports.getDeclarationForElement = elementImpl => {
  const globalObject = elementImpl._globalObject;
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
  const customProperties = new Map();
  const opt = {
    customProperties,
    colorProperties: new Set(),
    parsedDefaultStyleSheet: cssom.parse(defaultStyleSheet, { globalObject }),
    styleCache: elementImpl._ownerDocument._styleCache ?? new WeakMap()
  };
  const l = ancestors.length;
  for (let i = l - 1; i >= 0; i--) {
    const node = ancestors[i];
    setDeclarationForElement(node, opt);
  }
  const declaration = setDeclarationForElement(elementImpl, opt, true);
  const customProperty = Object.fromEntries(customProperties);
  // TODO: resolve relative units, especially `em`

  // set options for cssstyle to resolve computed value
  declaration._setOptions({
    customProperty,
    dimension: {
      // TBD: Is it okay to fix rem to 16px?
      rem: 16,
      vh: elementImpl._globalObject.innerHeight / 100,
      vw: elementImpl._globalObject.innerWidth / 100
    },
    format: "computedValue",
    readOnly: true
  });
  return declaration;
};

exports.invalidateStyleCache = elementImpl => {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = null;
  }
};

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
