"use strict";
const cssom = require("cssom");
const defaultStyleSheet = require("../../browser/default-stylesheet");
const { matchesDontThrow } = require("./selectors");

const { forEach, indexOf } = Array.prototype;

let parsedDefaultStyleSheet;

// Properties for which getResolvedValue is implemented. This is less than
// every supported property.
// https://drafts.csswg.org/indexes/#properties
exports.propertiesWithResolvedValueImplemented = new Proxy(
  {
    __proto__: null,
    
    border: {
      inherited: false,
      initial: "medium none #000000",
      computedValue: "as-specified",
    },
    color: {
      inherited: true,
      initial: "#000000",
      computedValue: "as-specified",
    },
    // https://drafts.csswg.org/css2/visufx.html#visibility
    visibility: {
      inherited: true,
      initial: "visible",
      computedValue: "as-specified",
    },
  },
  {
    get: function(target, prop, receiver) {
      if (typeof prop === 'string' && prop.indexOf("--") === 0) {
        return {
          inherited: true,
          initial: "",
          computedValue: "as-specified",
        };
      }
      return Reflect.get(...arguments);
    }
  }
);

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
  let style = {
    value: '',
    priority: null,
  };

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
  const {initial,
         inherited} = exports.propertiesWithResolvedValueImplemented[property];

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

// https://www.w3.org/TR/css-variables-1/#using-variables
function _getVarSubstitute(element, property, specifiedVal) {
  const matches = typeof specifiedVal.value !== 'string' ? [] :
        specifiedVal.value.matchAll(/^var\((--[-\w]+),?\s*(.*)\)/g);

  for (let match of matches) {
    const [_, customProp, fallback] = [...match];

    let substitute = exports.getResolvedValue(element, customProp);
    if (!substitute.value && fallback) {
      let fallbackValMatches = [...fallback.matchAll(/([^,()]+(?:\(.*?\))?)/g)];
      const fallbackVals = fallbackValMatches.map(match => {
        const [_, arg] = [...match];
        if (arg === 'initial' || arg === 'inherit' ||
            arg === 'unset' || arg === 'revert') {
          return getDefaultValue(element, property, arg);
        }
        
        const fallbackVal = {
          value: arg,
          priority: specifiedVal.priority,
        };
        return getVarSubstitute(
          element, property,
          fallbackVal, callStack=callStack);
      });

      substitute.value = fallbackVals.map(e=>e.value).join(',');
    }

    // TODO: Check for animation-taintedness
    // https://www.w3.org/TR/css-variables/#animation-tainted
    //
    // Left this undone since there's currently no way to check whether a
    // property is animatable. 

    // Sorry for the magic number here. It's needed to prevent a variation
    // of the "billion laughs attack" mentioned in the spec. See here:
    // https://www.w3.org/TR/css-variables-1/#long-variables
    return substitute.length > 1000 ? "" : substitute;
  }

  return specifiedVal;
}

// This wrapper function checks for dependency cycles. It's a simpler
// implementation than the one suggested at the link below, but it still
// does the trick.
// https://www.w3.org/TR/css-variables-1/#cycles
//
// In essence, this function tracks the recursive calls to getVarSubstitute
// and checks if the same custom property has been encountered twice. If so,
// it returns the guaranteed-invalid value. 
function getVarSubstitute(element, property, specifiedVal) {
  if (getVarSubstitute.callStack === undefined) {
    getVarSubstitute.callStack = [];
    
  } else if (getVarSubstitute.callStack.includes(specifiedVal.value)) {
    // Dependency cycles detected - return guaranteed-invalid value
    callStack.pop();
    return {
      value: '',
      priority: null,
    };
  }

  getVarSubstitute.callStack.push(specifiedVal.value);
  const substitute = _getVarSubstitute(element, property, specifiedVal);
  getVarSubstitute.callStack.pop();

  return substitute;
}

// https://drafts.csswg.org/css-cascade-4/#computed-value
function getComputedValue(element, property) {
  const { computedValue } = exports.propertiesWithResolvedValueImplemented[property];
  if (computedValue === "as-specified") {
    return getVarSubstitute(
      element, property,
      getSpecifiedValue(element, property));
  }

  throw new TypeError(`Internal error: unrecognized computed value instruction '${computedValue}'`);
}

// https://drafts.csswg.org/cssom/#resolved-value
// Only implements `visibility`
exports.getResolvedValue = (element, property) => {
  // Determined for special case properties, none of which are implemented here.
  // So we skip to "any other property: The resolved value is the computed value."
  if (exports.propertiesWithResolvedValueImplemented[property]) {
    return getComputedValue(element, property);
  } else {
    return getCascadedPropertyValue(element, property);
  }
};

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
