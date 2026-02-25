"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cssom = require("@acemir/cssom");
const Specificity = require("@bramus/specificity").default;
const { CSSStyleDeclaration, propertyDefinitions } = require("cssstyle");
const { wrapperForImpl } = require("../../../generated/idl/utils");
const { getSpecifiedColor, getComputedOrUsedColor } = require("./colors");
const { asciiLowercase } = require("./strings");
const { deprecatedAliases, systemColors } = require("./system-colors");

const defaultStyleSheet = fs.readFileSync(
  path.resolve(__dirname, "../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
);
let parsedDefaultStyleSheet;

function getPropertyMetadata(property) {
  if (property.startsWith("--")) {
    return { inherited: true, initial: "", computedValue: "as-specified" };
  }
  const def = propertyDefinitions.get(property);
  if (!def || def.initial === "see individual properties") {
    return undefined;
  }
  return {
    inherited: def.inherited === "yes",
    initial: def.initial,
    computedValue: /<color>/.test(def.syntax) ? "computed-color" : "as-specified"
  };
}

function getComputedStyleDeclaration(elementImpl) {
  const styleCache = elementImpl._ownerDocument._styleCache;
  const cachedDeclaration = styleCache.get(elementImpl);
  if (cachedDeclaration) {
    const opts = prepareCssstyleOpts(elementImpl);
    opts.resolveProperty = property => {
      const value = cachedDeclaration.getPropertyValue(property);
      return value !== "" ? value : undefined;
    };
    const clonedDeclaration = new CSSStyleDeclaration(null, opts);
    // TODO: Remove when cssstyle options are ready.
    clonedDeclaration._global = elementImpl._globalObject;
    clonedDeclaration._computed = true;

    for (let i = 0; i < cachedDeclaration.length; i++) {
      const property = cachedDeclaration.item(i);
      const value = cachedDeclaration.getPropertyValue(property);
      const priority = cachedDeclaration.getPropertyPriority(property);
      clonedDeclaration.setProperty(property, value, priority);
    }

    clonedDeclaration._readonly = true;
    return clonedDeclaration;
  }

  const computing = new Set();
  function resolveProperty(property) {
    if (computing.has(property)) {
      return undefined;
    }
    const metadata = getPropertyMetadata(property);
    if (!metadata) {
      return undefined;
    }
    computing.add(property);
    const resolved = getResolvedValue(elementImpl, property);
    computing.delete(property);
    return resolved;
  }

  const declaration = prepareComputedStyleDeclaration(elementImpl, { styleCache, resolveProperty });
  declaration._readonly = true;

  return declaration;
}

function prepareComputedStyleDeclaration(elementImpl, { styleCache, resolveProperty }) {
  const { style } = elementImpl;
  const opts = prepareCssstyleOpts(elementImpl);
  opts.resolveProperty = resolveProperty;
  const declaration = new CSSStyleDeclaration(null, opts);
  // TODO: Remove when cssstyle options are ready.
  declaration._global = elementImpl._globalObject;
  declaration._computed = true;

  applyStyleSheetRules(elementImpl, declaration);

  for (let i = 0; i < style.length; i++) {
    handlePropertyForInlineStyle(style.item(i), declaration, style);
  }

  styleCache.set(elementImpl, declaration);

  return declaration;
}

function prepareCssstyleOpts(elementImpl) {
  // TODO: Prepare options for cssstyle.
  const opts = {
    context: wrapperForImpl(elementImpl)
  };

  return opts;
}

function applyStyleSheetRules(elementImpl, declaration) {
  if (!parsedDefaultStyleSheet) {
    parsedDefaultStyleSheet = cssom.parse(defaultStyleSheet);
  }

  const specificities = new Map();
  handleSheet(parsedDefaultStyleSheet, elementImpl, declaration, specificities);
  for (const sheet of elementImpl._ownerDocument.styleSheets._list) {
    handleSheet(sheet, elementImpl, declaration, specificities);
  }
}

function handleSheet(sheet, elementImpl, declaration, specificities) {
  for (const rule of sheet.cssRules) {
    if (rule.media) {
      let hasMediaScreen = false;
      for (let i = 0; i < rule.media.length; i++) {
        hasMediaScreen = rule.media[i] === "screen";
        if (hasMediaScreen) {
          break;
        }
      }
      if (rule.constructor.name === "CSSImportRule") {
        // Handle @import rules if:
        // - imported sheet loaded successfully
        // - media is empty or matches "screen"
        if (rule.styleSheet !== null && (rule.media.length === 0 || hasMediaScreen)) {
          for (const innerRule of rule.styleSheet.cssRules) {
            handleRule(innerRule, elementImpl, declaration, specificities);
          }
        }
        // Keep handling @media rules only if media matches "screen"
      } else if (hasMediaScreen) {
        for (const innerRule of rule.cssRules) {
          handleRule(innerRule, elementImpl, declaration, specificities);
        }
      }
    } else {
      handleRule(rule, elementImpl, declaration, specificities);
    }
  }
}

function handleRule(rule, elementImpl, declaration, specificities) {
  const { ast, match } = matches(rule.selectorText, elementImpl);
  if (match) {
    handleStyle(rule.style, declaration, specificities, ast);
  }
}

function handleStyle(style, declaration, specificities, ast) {
  for (let i = 0; i < style.length; i++) {
    const property = style[i];
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
    const domSelector = elementImpl._ownerDocument._domSelector;
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

// Naive implementation of https://drafts.csswg.org/css-cascade-4/#cascading
// based on the previous jsdom implementation of getComputedStyle.
// Does not implement https://drafts.csswg.org/css-cascade-4/#cascade-specificity,
// or rather specificity is only implemented by the order in which the matching
// rules appear. The last rule is the most specific while the first rule is
// the least specific.
function getCascadedPropertyValue(element, property) {
  const cached = element._ownerDocument._styleCache.get(element);
  if (cached) {
    return cached.getPropertyValue(property);
  }
  return getComputedStyleDeclaration(element).getPropertyValue(property);
}

// https://drafts.csswg.org/css-cascade-4/#specified-value
function getSpecifiedValue(element, property) {
  const { initial, inherited, computedValue } = getPropertyMetadata(property);
  const cascade = getCascadedPropertyValue(element, property);

  if (cascade !== "") {
    if (computedValue === "computed-color") {
      return getSpecifiedColor(cascade);
    }

    return cascade;
  }

  // Defaulting
  if (inherited && element.parentElement !== null) {
    return getComputedValue(element.parentElement, property);
  }

  // root element without parent element or inherited property
  return initial;
}

// https://drafts.csswg.org/css-cascade-4/#computed-value
function getComputedValue(element, property) {
  const { computedValue, inherited, initial } = getPropertyMetadata(property);
  let specifiedValue = getSpecifiedValue(element, property);
  // https://drafts.csswg.org/css-cascade/#defaulting-keywords
  switch (specifiedValue) {
    case "initial": {
      specifiedValue = initial;
      break;
    }
    case "inherit": {
      if (element.parentElement !== null) {
        specifiedValue = getComputedValue(element.parentElement, property);
      } else {
        specifiedValue = initial;
      }
      break;
    }
    case "unset": {
      if (inherited && element.parentElement !== null) {
        specifiedValue = getComputedValue(element.parentElement, property);
      } else {
        specifiedValue = initial;
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
  if (computedValue === "as-specified") {
    return specifiedValue;
  } else if (computedValue === "computed-color") {
    let value = asciiLowercase(specifiedValue);
    // https://drafts.csswg.org/css-color-4/#resolving-other-colors
    if (specifiedValue === "currentcolor") {
      if (property === "color") {
        if (element.parentElement !== null) {
          return getComputedValue(element.parentElement, "color");
        }
        value = initial;
      } else {
        return getComputedValue(element, "color");
      }
    }
    if (systemColors.has(value) || deprecatedAliases.has(value)) {
      let key = value;
      if (deprecatedAliases.has(value)) {
        key = deprecatedAliases.get(value);
      }
      const { light, dark } = systemColors.get(key);
      const colorScheme = getCascadedPropertyValue(element, "color-scheme");
      if (colorScheme === "dark") {
        return dark;
      }
      return light;
    }
    return getComputedOrUsedColor(specifiedValue);
  }

  throw new TypeError(`Internal error: unrecognized computed value instruction '${computedValue}'`);
}

// https://drafts.csswg.org/cssom/#resolved-value
function getResolvedValue(element, property) {
  // We can always use the computed value:
  // * Color properties end up with the used value, but we don't implement any actual differences between used and
  //   computed that https://drafts.csswg.org/css-cascade-5/#used-value gestures at.
  // * The other properties fall back to the "any other property: The resolved value is the computed value." case.
  return getComputedValue(element, property);
}

function invalidateStyleCache(elementImpl) {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = new WeakMap();
  }
}

module.exports = {
  SHADOW_DOM_PSEUDO_REGEXP: /^::(?:part|slotted)\(/i,
  getComputedStyleDeclaration,
  invalidateStyleCache
};
