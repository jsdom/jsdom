"use strict";
const cssom = require("cssom");
const { CSSStyleDeclaration } = require("cssstyle");
const defaultStyleSheet = require("../../browser/default-stylesheet");
const { matchesDontThrow } = require("./selectors");
const CSSwhat = require("css-what");

const { forEach, indexOf } = Array.prototype;

let parsedDefaultStyleSheet;


// properties for which `getResolvedValue` is implemented which is less than
// every supported property according to step 5
// https://drafts.csswg.org/css2/propidx.html
exports.propertiesWithResolvedValueImplemented = {
  __proto__: null,
  "text-align": {
    inherited: true,
    initial: "start",
    // match-parent not implemented
    computedValue: "as-specified"
  },
  // https://drafts.csswg.org/css2/visufx.html#visibility
  visibility: {
    inherited: true,
    initial: "visible",
    computedValue: "as-specified"
  }
};

/**
 * @param {CSSStyleRule} rule
 * @returns {string[]}
 */
function getSelectors(rule) {
  const cssSelectorSplitRe = /((?:[^,"']|"[^"]*"|'[^']*')+)/;
  return rule.selectorText.split(cssSelectorSplitRe);
}

/**
 * [A, B, C] as defined in https://drafts.csswg.org/selectors/#specificity-rules
 * @typedef {[number, number, number]} Specificity
 */

/**
 * https://drafts.csswg.org/selectors/#specificity-rules
 * @param {string} selectorText -
 * @returns {Specificity}
 */
function calculateSpecificity(selectorText) {
  let tokens = [];
  try {
    [tokens] = CSSwhat.parse(selectorText.trim());
  } catch (error) {
    // TODO: silence?
    throw new TypeError(`Failed to parse selector '${selectorText}'`);
  }

  // "count the number of ID selectors in the selector (= A)"
  const a = tokens.filter(({ type, name }) => {
    return type === "attribute" && name === "id";
  }).length;
  // "count the number of class selectors, attributes selectors, and pseudo-classes in the selector (= B)"
  const b = tokens.filter(({ type, name }) => {
    // attribute includes class selectors
    return (type === "attribute" && name !== "id") || type === "pseudo";
  }).length;
  // "count the number of type selectors and pseudo-elements in the selector (= C)"
  const c = tokens.filter(({ type }) => {
    return (
      type === "tag" ||
      // "The universal selector is a special type selector"
      type === "universal" ||
      type === "pseudo-element"
    );
  }).length;

  return [a, b, c];
}

/**
 * @param {Specificity} a
 * @param {Specificity} b
 * @returns {number}
 */
function compareSpecificityAsc(a, b) {
  if (a[0] !== b[0]) {
    return a[0] - b[0];
  }
  if (a[1] !== b[1]) {
    return a[1] - b[1];
  }
  return a[2] - b[2];
}

/**
 * An enumerable list of properties declared in a given declaration
 * @param {CSSStyleDeclaration} declaration
 * @returns {Array<{ name: string, value: string, importance: Priority }>}
 */
function propertiesOf(declaration) {
  return Array.from({ length: declaration.length }, (_, index) => {
    // const name = declaration.item(index);
    const name = declaration[index];

    return {
      name,
      value: declaration.getPropertyValue(name),
      importance: declaration.getPropertyPriority(name)
    };
  });
}

/**
 * https://drafts.csswg.org/css-cascade-4/#cascade
 * @param {Element} element
 */
function computeCascadedDeclaration(element) {
  if (!parsedDefaultStyleSheet) {
    parsedDefaultStyleSheet = cssom.parse(defaultStyleSheet);
  }
  /**
   * @type {CSSStyleSheet}
   */
  const userAgentSheet = parsedDefaultStyleSheet;

  /**
   * @param {CSSStyleSheet} sheet
   * @returns {CSSStyleRule[]}
   */
  function rulesOf(sheet) {
    const rules = [];

    forEach.call(sheet.cssRules, rule => {
      if (rule.media) {
        if (indexOf.call(rule.media, "screen") !== -1) {
          forEach.call(rule.cssRules, innerRule => {
            if (matches(innerRule, element)) {
              rules.push(innerRule);
            }
          });
        }
      } else if (matches(rule, element)) {
        rules.push(rule);
      }
    });

    return rules;
  }

  // Add origin to all applicable rules
  const rules = rulesOf(userAgentSheet).map(rule => {
    return { rule, origin: "user-agent" };
  });

  if (element.isConnected) {
    for (const sheet of element.ownerDocument.styleSheets) {
      rules.push(...rulesOf(sheet).map(rule => {
        return { rule, origin: "author" };
      }));
    }
  }

  // filter matching rules and determine their specificity
  const declarations = rules
    .map(({ rule, origin }) => {
      const matchingSelectors = getSelectors(rule).filter(selector => {
        return matchesDontThrow(element, selector);
      });
      if (matchingSelectors.length === 0) {
        return null;
      }

      //  "the specificity in effect is that of the most specific selector in the list that matches"
      const highestSpecificity = matchingSelectors
        .map(selector => {
          return calculateSpecificity(selector);
        })
        .sort(compareSpecificityAsc)
        .pop();

      return {
        declaration: rule.style,
        origin,
        specificity: highestSpecificity
      };
    })
    // filter the entries where we returned `null` for rules that don't match
    .filter(Boolean)
    .concat({
      declaration: element.style,
      origin: "author",
      // "(such as the contents of a style attribute) are considered to have a specificity higher than any selector"
      // https://drafts.csswg.org/css-cascade-4/#cascade-specificity
      specificity: [Number.POSITIVE_INFINITY]
    });

  const cascadedDeclaration = declarations
    // flatten declarations to declared values
    .map(({ declaration, origin, specificity }) => {
      return propertiesOf(declaration).map(property => {
        return { property, origin, specificity };
      });
    })
    .reduce((flattened, partial) => {
      return flattened.concat(partial);
    }, [])
    // prepare for sort (sort() should do as little as possible)
    .map(({ property, origin, specificity }) => {
      const important = property.importance === "important";
      // https://drafts.csswg.org/css-cascade-4/#cascade-origin
      const order = [
        false, // 0, not used
        false, // 1, TODO: Transition declarations
        important && origin === "user-agent", // 2
        important && origin === "user", // 3
        important && origin === "author", // 4
        false, // 5, TODO: Animation declarations
        !important && origin === "author", // 6
        !important && origin === "user", // 7
        true // 8, any
      ].findIndex(Boolean);

      return {
        property,
        order: [order, ...specificity]
      };
    })
    .sort((a, b) => {
      // the last item in this order will win
      if (a.order[0] !== b.order[0]) {
        // Origin and Importance: the lower number wins so sort descending
        return b.order[0] - a.order[0];
      }
      // higher specificity wins so sort ascending
      return compareSpecificityAsc(a.order.slice(1), b.order.slice(1));
    })
    // now we got them ordered by importance, origin, specificity
    // just apply them by this order and the squashed result is our declaration
    .reduce((declaration, { property }) => {
      declaration.setProperty(
        property.name,
        property.value,
        property.importance
      );

      return declaration;
    }, new CSSStyleDeclaration());

  return cascadedDeclaration;
}

exports.forEachMatchingSheetRuleOfElement = (element, handleRule) => {
  function handleSheet(sheet) {
    forEach.call(sheet.cssRules, rule => {
      if (rule.media) {
        if (indexOf.call(rule.media, "screen") !== -1) {
          forEach.call(rule.cssRules, innerRule => {
            if (matches(innerRule, element)) {
              handleRule(innerRule);
            }
          });
        }
      } else if (matches(rule, element)) {
        handleRule(rule);
      }
    });
  }

  if (!parsedDefaultStyleSheet) {
    parsedDefaultStyleSheet = cssom.parse(defaultStyleSheet);
  }

  handleSheet(parsedDefaultStyleSheet);
  forEach.call(element.ownerDocument.styleSheets, handleSheet);
};

function matches(rule, element) {
  if (!rule.selectorText) {
    return false;
  }

  const cssSelectorSplitRe = /((?:[^,"']|"[^"]*"|'[^']*')+)/;
  const selectors = rule.selectorText.split(cssSelectorSplitRe);

  for (const selectorText of selectors) {
    if (
      selectorText !== "" &&
      selectorText !== "," &&
      matchesDontThrow(element, selectorText)
    ) {
      return true;
    }
  }

  return false;
}

// https://drafts.csswg.org/css-cascade-4/#cascading
function getCascadedPropertyValue(element, property) {
  // TODO do this once per getComputedStyle
  const cascade = computeCascadedDeclaration(element);
  return cascade.getPropertyValue(property);
}

// https://drafts.csswg.org/css-cascade-4/#specified-value
function getSpecifiedValue(element, property) {
  const cascade = getCascadedPropertyValue(element, property);

  if (cascade !== "") {
    return cascade;
  }

  // Defaulting
  const { initial, inherited } = exports.propertiesWithResolvedValueImplemented[property];
  if (inherited === true && element.parentElement !== null) {
    return getComputedValue(element.parentElement, property);
  }

  // root element without parent element or inherited property
  return initial;
}

// https://drafts.csswg.org/css-cascade-4/#computed-value
function getComputedValue(element, property) {
  const { computedValue } = exports.propertiesWithResolvedValueImplemented[property];
  if (computedValue === "as-specified") {
    return getSpecifiedValue(element, property);
  }

  throw new TypeError(`Internal error: unrecognized computed value instruction '${computedValue}'`);
}

// https://drafts.csswg.org/cssom/#resolved-value
// Only implements `text-align`, `visibility`
exports.getResolvedValue = (element, property) => {
  // determined for special case properties none of which are implemented here
  // so we skip to "any other property: The resolved value is the computed value."
  return getComputedValue(element, property);
};
