"use strict";
const cssom = require("cssom");
const { CustomPropertyDependencyGraph,
        isCustomProperty } = require("./custom-property-dependency-graph");
const defaultStyleSheet = require("../../browser/default-stylesheet");
const { matchesDontThrow } = require("./selectors");
const { propertiesWithResolvedValueImplemented } = require("./resolved-properties");

const { forEach, indexOf } = Array.prototype;
const guaranteedInvalid = Object.freeze({value: '', priority: null});

let parsedDefaultStyleSheet;

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
function getCascadedPropertyValue(element, property) {
  let style = {...guaranteedInvalid};

  exports.forEachMatchingSheetRuleOfElement(element, rule => {
    const propertyValue = rule.style.getPropertyValue(property);
    // getPropertyValue returns "" if the property is not found
    if (propertyValue !== "") {
      style.value = propertyValue;
      style.priority = rule.style.getPropertyPriority(property);
    }
  });

  const inlineValue = element.style.getPropertyValue(property);
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
function getDefaultValue(element, property, request=null) {
  const { initial,
          inherited } = propertiesWithResolvedValueImplemented[property];

  if (request !== 'initial' &&
      (request === 'inherit' || inherited) &&
      element.parentElement !== null) {

    return getComputedValue(element.parentElement, property);
  }

  // root element without parent element or inherited property
  return {
    value: initial,
    priority: null,
  };
}

// https://drafts.csswg.org/css-cascade-4/#specified-value
function getSpecifiedValue(element, property) {
  const cascade = getCascadedPropertyValue(element, property);

  if (cascade.value !== "") {
    return cascade;
  }
  
  return getDefaultValue(element, property);
}

// Parses a single var() from the property value. Returns
// a list of [precedingText, cssVar, followingText]
function parseCssVar(propertyValue) {
  let buffer = '';
  let openParens = 0;

  for (let ii = 0; ii < propertyValue.length; ii++) {
    const newChar = propertyValue[ii];
    buffer += newChar;
    if (openParens === 0 && buffer.includes('var(')) {
      buffer = 'var(';
      openParens = 1;
      
    } else if (openParens > 0 && newChar === '(') {
      openParens += 1;
      
    } else if (openParens > 0 && newChar === ')') {
      openParens -= 1;
      if (openParens === 0) {
        return [
          propertyValue.slice(0, ii - (buffer.length-1)),
          buffer,
          propertyValue.slice(ii+1),
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

  return false;
}

// https://www.w3.org/TR/css-variables-1/#using-variables
//
// Specifically, this handles a single variable and its fallback
// Expected input: var(--a, red)
function getSingleCssVarSubstitute(element, cssVar) {
  const cssVarArgs = cssVar.match(
    /^var\((?<customProp>--[-\w]+),?\s*(?<fallback>.*)\)/);

  if (cssVarArgs) {
    const customProp = cssVarArgs.groups.customProp;
    const customPropSubstitute = getVarSubstitute(element, customProp);
    const fallback = {
      value: cssVarArgs.groups.fallback,
      priority: customPropSubstitute.priority,
    };
    
    if (!customPropSubstitute.value) {
      return makeCssVarSubstitutions(element, fallback);
    }
    return customPropSubstitute;
  }

  return guaranteedInvalid;
}

// Modifies the substitution string based on the surrounding chars.
//
// At the moment, specific to the case where two var()s are back-to-back
// like: var(--a)var(--b) => var(--a) var(--b)
function normalizeCssVarSubstitution(substitute) {
  return (match, offset, string) => {
    // Add leading space if immediately against something else
    if (offset > 0 && /[^,\s(]/.test(string[offset-1])) {
      return ` ${substitute.value}`;
    }

    return substitute.value;
  };
}

// https://www.w3.org/TR/css-variables-1/#using-variables
//
// Specifically, this function parses a specified value of (possibly)
// many var()s and their fallbacks, substituting the computed value
// for each var().
//
// Expected input: var(--a, red) var(--b, var(--c, var(--d)))
function makeCssVarSubstitutions(element, computedPropertyInfo) {
  let cssVar;
  const substitute = computedPropertyInfo;

  while(cssVar !== null) {
    let leadingText, trailingText;
    [leadingText, cssVar, trailingText] = parseCssVar(substitute.value);

    if (cssVar) {
      if (isCssVarInvalid(leadingText, cssVar, trailingText)) {
        return guaranteedInvalid;
      }
      
      const cssVarSubstitute = getSingleCssVarSubstitute(element, cssVar);
      substitute.value = substitute.value.replace(
        cssVar,
        normalizeCssVarSubstitution(cssVarSubstitute));
        
      substitute.priority = (
        cssVarSubstitute.priority || substitute.priority ?
          "important" : null);

      // Sorry for the magic number here. It's needed to prevent a variation
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
function getVarSubstitute(element, property) {
  // See [1] for cycles
  if (isCustomProperty(property)) {
    let graph = new CustomPropertyDependencyGraph(
      property => getSpecifiedValue(element, property));
    
    graph.createNodesFrom(property);
    if (graph.isCyclicAround(property)) {
      return guaranteedInvalid;
    }

    const substitute = getSpecifiedValue(element, property);
    return makeCssVarSubstitutions(element, substitute);

  // See [2] for using variables
  } else {
    const cascadedProperty = getSpecifiedValue(element, property);
    let substitute = makeCssVarSubstitutions(element, cascadedProperty);
    if (!substitute.value) {
      substitute = getDefaultValue(element, property);
    }
    return substitute;
  }
}

// https://www.w3.org/TR/css-cascade-4/#defaulting-keywords
function replaceKeywords(element, property, computedValue) {
  let resolvedValue = computedValue.value;
  
  const substituteDefaultForKeyword = (match, object, string) => {
    return getDefaultValue(element, property, match).value;
  };
  
  resolvedValue = resolvedValue.replace(
    /\binitial\b/,
    substituteDefaultForKeyword);
  resolvedValue = resolvedValue.replace(
    /\binherit\b/,
    substituteDefaultForKeyword);
  resolvedValue = resolvedValue.replace(
    /\brevert\b/,
    substituteDefaultForKeyword);
  resolvedValue = resolvedValue.replace(
    /\bunset\b/,
    substituteDefaultForKeyword);

  return {
    value: resolvedValue,
    priority: computedValue.priority,
  };
}

// https://drafts.csswg.org/css-cascade-4/#computed-value
function getComputedValue(element, property) {
  const computedValue = getVarSubstitute(element, property);
  return replaceKeywords(element, property, computedValue);
}

// https://drafts.csswg.org/cssom/#resolved-value
exports.getResolvedValue = (element, property) => {
  // Determined for special case properties, none of which are implemented here.
  // So we skip to "any other property: The resolved value is the computed value."
  if (propertiesWithResolvedValueImplemented[property]) {
    return getComputedValue(element, property);
    
  } else {
    return getCascadedPropertyValue(element, property);
  }
};

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
