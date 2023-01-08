"use strict";
const cssom = require("cssom");
const { CustomPropertyDependencyGraph,
  isCustomProperty } = require("./custom-property-dependency-graph");
const defaultStyleSheet = require("../../browser/default-stylesheet");
const { matchesDontThrow } = require("./selectors");

const { forEach, indexOf } = Array.prototype;

let parsedDefaultStyleSheet;

exports.PropertyRequest = function (element, name, initial = "", inherited = true) {
  if (typeof initial !== "string") {
    throw new TypeError(
      `Cannot set PropertyRequest.initial to type ${typeof initial}`
    );
  }
  if (typeof inherited !== "boolean") {
    throw new TypeError(
      `Cannot set PropertyRequest.inherited to type ${typeof inherited}`
    );
  }

  this.element = element;
  this.name = name;
  this.initial = initial;
  this.inherited = inherited;
};
exports.ResolvedProperty = function (value = "", priority = null) {
  this.value = value;
  this.priority = priority;
};
const guaranteedInvalid = Object.freeze(new exports.ResolvedProperty());

exports.forEachMatchingSheetRuleOfElement = (elementImpl, handleRule) => {
  function handleSheet(sheet) {
    forEach.call(sheet.cssRules, rule => {
      if (rule.media) {
        if (indexOf.call(rule.media, "screen") !== -1) {
          forEach.call(rule.cssRules, innerRule => {
            if (matches(innerRule, elementImpl)) {
              handleRule(innerRule);
            }
          });
        }
      } else if (matches(rule, elementImpl)) {
        handleRule(rule);
      }
    });
  }

  if (!parsedDefaultStyleSheet) {
    parsedDefaultStyleSheet = cssom.parse(defaultStyleSheet);
  }

  handleSheet(parsedDefaultStyleSheet);
  forEach.call(elementImpl._ownerDocument.styleSheets._list, handleSheet);
};

function matches(rule, element) {
  return matchesDontThrow(element, rule.selectorText);
}

// Naive implementation of https://drafts.csswg.org/css-cascade-4/#cascading
// based on the previous jsdom implementation of getComputedStyle.
// Does not implement https://drafts.csswg.org/css-cascade-4/#cascade-specificity,
// or rather specificity is only implemented by the order in which the matching
// rules appear. The last rule is the most specific while the first rule is
// the least specific.
function getCascadedPropertyValue(propertyRequest) {
  const style = new exports.ResolvedProperty();

  exports.forEachMatchingSheetRuleOfElement(propertyRequest.element, rule => {
    const propertyValue = rule.style.getPropertyValue(propertyRequest.name);
    // getPropertyValue returns "" if the property is not found
    if (propertyValue !== "") {
      style.value = propertyValue;
      style.priority = rule.style.getPropertyPriority(propertyRequest.name);
    }
  });

  const inlineValue = propertyRequest.element.style.getPropertyValue(
    propertyRequest.name
  );

  if (inlineValue !== "" && inlineValue !== null) {
    style.value = inlineValue;
    style.priority = null;
  }

  return style;
}

// https://www.w3.org/TR/css-cascade-4/#defaulting
//
// Note that "revert" and "unset" keywords will behave exactly the same in the
// current implementation. The difference will need to be addressed if the
// getCascadedPropertyValue function above is made to meet the spec.
function getDefaultValue(propertyRequest, request = null) {
  if (request !== "initial" &&
      (request === "inherit" || propertyRequest.inherited) &&
      propertyRequest.element.parentElement !== null) {
    const parentRequest = { ...propertyRequest };
    parentRequest.element = propertyRequest.element.parentElement;
    return exports.getComputedValue(parentRequest);
  }

  // root element without parent element or inherited property
  return new exports.ResolvedProperty(propertyRequest.initial);
}

// https://drafts.csswg.org/css-cascade-4/#specified-value
function getSpecifiedValue(propertyRequest) {
  const cascade = getCascadedPropertyValue(propertyRequest);

  if (cascade.value !== "") {
    return cascade;
  }

  return getDefaultValue(propertyRequest);
}

// Parses a single var() from the property value. Returns
// a list of [precedingText, cssVar, followingText]
function parseCssVar(propertyValue) {
  let buffer = "";
  let openParens = 0;

  for (let ii = 0; ii < propertyValue.length; ii++) {
    const newChar = propertyValue[ii];
    buffer += newChar;
    if (openParens === 0 && buffer.includes("var(")) {
      buffer = "var(";
      openParens = 1;
    } else if (openParens > 0 && newChar === "(") {
      openParens += 1;
    } else if (openParens > 0 && newChar === ")") {
      openParens -= 1;
      if (openParens === 0) {
        return [
          propertyValue.slice(0, ii - (buffer.length - 1)),
          buffer,
          propertyValue.slice(ii + 1)
        ];
      }
    }
  }

  return [null, null, null];
}

// https://www.w3.org/TR/css-variables-1/#syntax
function isCssVarInvalid(leadingText, cssVar, trailingText) {
  // Invalidate if immediately followed by CSS token
  const tokenRegex = /^\s*(?:in|cm|em|mm|pt|pc|px|ex|rem|vh|vw|ch|deg|grad|rad|%)/;
  if (trailingText && tokenRegex.test(trailingText)) {
    return true;
  }

  // Invalidate if custom property doesn"t have enough leading dashes
  if (/var\(-?[\w]+/.test(cssVar)) {
    return true;
  }

  // Invalidate if custom property is only dashes
  if (/var\(--[^\w]/.test(cssVar)) {
    return true;
  }

  // Invalidate if something is trailing custom property in first argument
  if (/var\(--[\w-]+ [\w]/.test(cssVar)) {
    return true;
  }

  return false;
}

// https://www.w3.org/TR/css-variables-1/#using-variables
//
// Specifically, this handles a single variable and its fallback
// Expected input: var(--a, red)
function getSingleCssVarSubstitute(propertyRequest, cssVar) {
  const cssVarArgs = cssVar.match(
    /^var\((?<customProp>--[-\w]+),?\s*(?<fallback>.*)\)/
  );

  if (cssVarArgs) {
    const customPropertyRequest = new exports.PropertyRequest(
      propertyRequest.element,
      cssVarArgs.groups.customProp
    );

    const customPropSubstitute = getVarSubstitute(customPropertyRequest);
    const fallback = new exports.ResolvedProperty(
      cssVarArgs.groups.fallback,
      customPropSubstitute.priority
    );

    if (!customPropSubstitute.value) {
      return makeCssVarSubstitutions(customPropertyRequest, fallback);
    }
    return customPropSubstitute;
  }

  return guaranteedInvalid;
}

// Modifies the substitution string based on the surrounding chars.
//
// At the moment, specific to the case where two var()s are back-to-back
// like: var(--a)var(--b) => var(--a) var(--b)
function normalizeCssVarSubstitution(partiallyResolvedValue) {
  return (match, offset, string) => {
    // Add leading space if immediately against something else
    if (offset > 0 && /[^,\s(]/.test(string[offset - 1])) {
      return ` ${partiallyResolvedValue.value}`;
    }

    return partiallyResolvedValue.value;
  };
}

// https://www.w3.org/TR/css-variables-1/#using-variables
//
// Specifically, this function parses a specified value of (possibly)
// many var()s and their fallbacks, substituting the computed value
// for each var().
//
// Expected input: var(--a, red) var(--b, var(--c, var(--d)))
function makeCssVarSubstitutions(propertyRequest, partiallyResolvedValue) {
  let cssVar;
  const substitute = partiallyResolvedValue;

  while (cssVar !== null) {
    let leadingText, trailingText;
    [leadingText, cssVar, trailingText] = parseCssVar(substitute.value);

    if (cssVar) {
      if (isCssVarInvalid(leadingText, cssVar, trailingText)) {
        return guaranteedInvalid;
      }

      const cssVarSubstitute = getSingleCssVarSubstitute(propertyRequest, cssVar);
      substitute.value = substitute.value.replace(
        cssVar,
        normalizeCssVarSubstitution(cssVarSubstitute)
      );

      substitute.priority = cssVarSubstitute.priority || substitute.priority ?
        "important" :
        null;

      // Sorry for the magic number here. It"s needed to prevent a variation
      // of the "billion laughs attack" mentioned in the spec. See here:
      // https://www.w3.org/TR/css-variables-1/#long-variables
      if (substitute.value.length > 1000) {
        return guaranteedInvalid;
      }
    }
  }

  return substitute;
}

// Implements two sections of the spec:
// [1] https://www.w3.org/TR/css-variables-1/#cycles
// [2] https://www.w3.org/TR/css-variables-1/#using-variables
function getVarSubstitute(propertyRequest) {
  // See [1] for cycles
  if (isCustomProperty(propertyRequest.name)) {
    const graph = new CustomPropertyDependencyGraph(
      propertyName => {
        const graphLookup = new exports.PropertyRequest(
          propertyRequest.element,
          propertyName
        );

        return getSpecifiedValue(graphLookup);
      }
    );

    graph.createNodesFrom(propertyRequest.name);
    if (graph.isCyclicAround(propertyRequest.name)) {
      return guaranteedInvalid;
    }

    const substitute = getSpecifiedValue(propertyRequest);
    return makeCssVarSubstitutions(propertyRequest, substitute);
  }

  // See [2] for using variables
  const cascadedProperty = getSpecifiedValue(propertyRequest);
  let substitute = makeCssVarSubstitutions(propertyRequest, cascadedProperty);
  if (!substitute.value) {
    substitute = getDefaultValue(propertyRequest);
  }
  return substitute;
}

// https://www.w3.org/TR/css-cascade-4/#defaulting-keywords
function replaceKeywords(propertyRequest, resolvedProperty) {
  let resolvedValue = resolvedProperty.value;

  function substituteDefaultForKeyword(match) {
    const { value } = getDefaultValue(propertyRequest, match);
    return value;
  }

  resolvedValue = resolvedValue.replace(/\binitial\b/, substituteDefaultForKeyword);
  resolvedValue = resolvedValue.replace(/\binherit\b/, substituteDefaultForKeyword);
  resolvedValue = resolvedValue.replace(/\brevert\b/, substituteDefaultForKeyword);
  resolvedValue = resolvedValue.replace(/\bunset\b/, substituteDefaultForKeyword);
  return new exports.ResolvedProperty(resolvedValue, resolvedProperty.priority);
}

// https://drafts.csswg.org/css-cascade-4/#computed-value
exports.getComputedValue = propertyRequest => {
  const resolvedProperty = getVarSubstitute(propertyRequest);
  return replaceKeywords(propertyRequest, resolvedProperty);
};

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
