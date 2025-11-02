"use strict";
const path = require("node:path");
const fs = require("node:fs");
const cssom = require("@acemir/cssom");
const cssstyle = require("cssstyle");
const CSSStyleProperties = require("../generated/CSSStyleProperties");
const { asciiLowercase } = require("./strings");
const { deprecatedAliases, systemColors } = require("./system-colors");

const NODE_TYPE = require("../node-type");

const defaultStyleSheet = fs.readFileSync(
  path.resolve(__dirname, "../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
);
const parsedDefaultStyleSheet = cssom.parse(defaultStyleSheet);
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
const customProperties = new Map();
const colorProperties = new Set();
let styleCache = null;

function matches(rule, elementImpl) {
  try {
    if (rule.selectorText) {
      const domSelector = elementImpl._ownerDocument._domSelector;
      // Workaround for cssom issue.
      // https://github.com/jsdom/cssstyle/issues/193
      // https://github.com/rrweb-io/CSSOM/issues/14
      const selector = rule.selectorText.split(";").pop().trim();
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

function getPropertyValueFromAncestor(property, elementImpl) {
  const { initial } = propertyList.get(property);
  if (!elementImpl.parentElement) {
    return initial;
  }
  let value = "";
  let node = elementImpl.parentElement;
  while (node) {
    if (!styleCache.has(node)) {
      setDeclarationForElement(node);
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
function resolveColorValue(declaration) {
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

function resolveValue(value, property, elementImpl) {
  const { computedValue, inherited, initial } = propertyList.get(property);
  if (value === "") {
    if (inherited === "no" || elementImpl.parentElement === null) {
      value = initial;
    } else {
      value = getPropertyValueFromAncestor(property, elementImpl);
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
        specifiedValue = getPropertyValueFromAncestor(property, elementImpl);
      }
      break;
    }
    case "unset": {
      if (inherited !== "yes" || elementImpl.parentElement === null) {
        specifiedValue = initial;
      } else {
        specifiedValue = getPropertyValueFromAncestor(property, elementImpl);
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
          colorValue = getPropertyValueFromAncestor(property, elementImpl);
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

function handleProperty(property, style, elementImpl, declaration) {
  // @acemir/cssom does not have style.getPropertyValue()
  const value = style.getPropertyValue(property) || style[property];
  const resolvedValue = resolveValue(value ?? "", property, elementImpl);
  const priority = style.getPropertyPriority(property);
  declaration.setProperty(property, resolvedValue, priority ?? "");
  return declaration;
}

function handleStyle(style, elementImpl, declaration) {
  // @acemir/cssom does not support style.item(i)
  for (const property in style) {
    if (typeof property === "string") {
      if (propertyList.has(property)) {
        handleProperty(property, style, elementImpl, declaration);
      } else if (/^--[A-Za-z\d-]+$/.test(property)) {
        const value = style.getPropertyValue(property);
        const priority = style.getPropertyPriority(property);
        customProperties.set(property, value);
        declaration.setProperty(property, value, priority ?? "");
      }
    }
  }
  return declaration;
}

function handleSheet(sheet, elementImpl, declaration) {
  for (const rule of sheet.cssRules) {
    if (rule.media) {
      if (rule.media.mediaText.includes("screen")) {
        for (const cssRule of rule.cssRules) {
          if (matches(cssRule, elementImpl)) {
            handleStyle(cssRule.style, elementImpl, declaration);
          }
        }
      }
    } else if (matches(rule, elementImpl)) {
      handleStyle(rule.style, elementImpl, declaration);
    }
  }
  return declaration;
}

function forEachMatchingSheetRuleOfElement(elementImpl, declaration) {
  handleSheet(parsedDefaultStyleSheet, elementImpl, declaration);
  for (const sheet of elementImpl._ownerDocument.styleSheets._list) {
    handleSheet(sheet, elementImpl, declaration);
  }
  return declaration;
}

function setDeclarationForElement(elementImpl, initialize = false) {
  styleCache = elementImpl._ownerDocument._styleCache;
  if (!styleCache) {
    elementImpl._ownerDocument._styleCache = new WeakMap();
    styleCache = elementImpl._ownerDocument._styleCache;
  }
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
      const initialValue = resolveValue("", property, elementImpl);
      declaration.setProperty(property, initialValue, "");
    }
  }
  forEachMatchingSheetRuleOfElement(elementImpl, declaration);
  const l = elementImpl._style.length;
  for (let i = 0; i < l; i++) {
    const property = elementImpl._style.item(i);
    if (propertyList.has(property)) {
      handleProperty(property, elementImpl._style, elementImpl, declaration);
    } else if (/^--[A-Za-z\d-]+$/.test(property)) {
      const value = elementImpl._style.getPropertyValue(property);
      const priority = elementImpl._style.getPropertyPriority(property);
      customProperties.set(property, value);
      declaration.setProperty(property, value, priority ?? "");
    }
  }
  if (colorProperties.size) {
    resolveColorValue(declaration);
  }
  colorProperties.clear();
  styleCache.set(elementImpl, declaration);
  return declaration;
}

exports.getDeclarationForElement = elementImpl => {
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
  customProperties.clear();
  const l = ancestors.length;
  for (let i = l - 1; i >= 0; i--) {
    const node = ancestors[i];
    setDeclarationForElement(node);
  }
  const declaration = setDeclarationForElement(elementImpl, true);
  const colorScheme = declaration.getPropertyValue("color-scheme");
  const currentColor = declaration.getPropertyValue("color");
  const customProperty = Object.fromEntries(customProperties);
  // TODO: resolve relative units, especially `em`

  // set options for cssstyle to resolve computed value
  declaration._setOptions({
    colorScheme,
    currentColor,
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
  customProperties.clear();
  return declaration;
};

exports.invalidateStyleCache = elementImpl => {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = null;
  }
};

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
