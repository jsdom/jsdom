"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { parseStyleSheet } = require("./css-parser");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const Specificity = require("@bramus/specificity").default;
const CSSStyleProperties = require("../../../../generated/idl/CSSStyleProperties.js");
const { getSpecifiedColor, getComputedOrUsedColor } = require("./colors");
const { asciiLowercase } = require("../../helpers/strings");
const { evaluateMediaList } = require("../MediaList-impl.js");
const { deprecatedAliases, systemColors } = require("./system-colors");

const defaultStyleSheet = fs.readFileSync(
  path.resolve(__dirname, "../../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
);
let parsedDefaultStyleSheet;

// Properties for which getResolvedValue is implemented. This is less than
// every supported property.
// https://drafts.csswg.org/indexes/#properties
const propertiesWithResolvedValueImplemented = {
  "__proto__": null,

  // https://drafts.csswg.org/css2/visufx.html#visibility
  "visibility": {
    inherited: true,
    initial: "visible",
    computedValue: "as-specified"
  },
  // https://svgwg.org/svg2-draft/interact.html#PointerEventsProperty
  "pointer-events": {
    inherited: true,
    initial: "auto",
    computedValue: "as-specified"
  },
  // https://drafts.csswg.org/css-backgrounds-3/#propdef-background-color
  "background-color": {
    inherited: false,
    initial: "transparent",
    computedValue: "computed-color"
  },
  // https://drafts.csswg.org/css-logical-1/#propdef-border-block-end-color
  "border-block-start-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  "border-block-end-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  "border-inline-start-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  "border-inline-end-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  // https://drafts.csswg.org/css-backgrounds-3/#propdef-border-bottom-color
  "border-top-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  "border-right-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  "border-bottom-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  "border-left-color": {
    inherited: false,
    initial: "currentcolor",
    computedValue: "computed-color"
  },
  // https://drafts.csswg.org/css-ui-4/#propdef-caret-color
  "caret-color": {
    inherited: true,
    initial: "auto",
    computedValue: "computed-color"
  },
  // https://drafts.csswg.org/css-color-4/#propdef-color
  "color": {
    inherited: true,
    initial: "canvastext",
    computedValue: "computed-color"
  },
  // https://drafts.csswg.org/css-ui-4/#propdef-outline-color
  "outline-color": {
    inherited: false,
    initial: "invert",
    computedValue: "computed-color"
  },
  // https://drafts.csswg.org/css-display/#the-display-properties
  // Currently only "as-specified" is supported as a computed value
  "display": {
    inherited: false,
    initial: "inline",
    computedValue: "as-specified"
  }
};
const implementedProperties = Object.keys(propertiesWithResolvedValueImplemented);

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

  const declaration = prepareComputedStyleDeclaration(elementImpl, { styleCache });

  // TODO: Remove later.
  for (const property of implementedProperties) {
    declaration.setProperty(property, getResolvedValue(elementImpl, property));
  }
  declaration._readonly = true;

  return declaration;
}

function prepareComputedStyleDeclaration(elementImpl, { styleCache }) {
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
  const { initial, inherited, computedValue } = propertiesWithResolvedValueImplemented[property];
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
  const { computedValue, inherited, initial } = propertiesWithResolvedValueImplemented[property];
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
// Only implements the properties that are defined in propertiesWithResolvedValueImplemented.
function getResolvedValue(element, property) {
  // We can always use the computed value with the current set of propertiesWithResolvedValueImplemented:
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
