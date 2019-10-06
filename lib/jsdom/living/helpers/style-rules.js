"use strict";
const cssom = require("cssom");
const defaultStyleSheet = require("../../browser/default-stylesheet");
const { matchesDontThrow } = require("./selectors");

const { forEach, indexOf } = Array.prototype;

let parsedDefaultStyleSheet;

/**
 * properties for which `getResolvedValue` is implemented which is less than
 * every supported property according to step 5
 * @type Record<string, { inherited: boolean; initial: unknown; computedValue: 'as-specified' }>
 */
const properties = {
  visibility: {
    inherited: true,
    initial: "visible",
    computedValue: "as-specified"
  }
};

function forEachSheetRuleOfElement(element, handleRule) {
  function handleSheet(sheet) {
    forEach.call(sheet.cssRules, rule => {
      if (rule.media) {
        if (indexOf.call(rule.media, "screen") !== -1) {
          forEach.call(rule.cssRules, handleRule);
        }
      } else {
        handleRule(rule);
      }
    });
  }

  if (!parsedDefaultStyleSheet) {
    parsedDefaultStyleSheet = cssom.parse(defaultStyleSheet);
  }

  handleSheet(parsedDefaultStyleSheet);
  forEach.call(element.ownerDocument.styleSheets, handleSheet);
}

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

/**
 * Naive implementation of https://drafts.csswg.org/css-cascade-4/#cascading
 * based on the previous behavior of getComputedStyle
 * Does not implement https://drafts.csswg.org/css-cascade-4/#cascade-specificity
 * or rather specificity is only implemented by the order in which the matching
 * rules appear. The last rule is the most specific while the first rule is
 * the least specific.
 * @param {Element} element
 * @param {string} property
 */
function getCascadedPropertyValue(element, property) {
  let value = "";

  forEachSheetRuleOfElement(element, rule => {
    if (matches(rule, element)) {
      value = rule.style.getPropertyValue(property);
    }
  });

  return value;
}

/**
 * https://drafts.csswg.org/css-cascade-4/#specified-value
 *
 * @param {Element} element
 * @param {string} property
 */
function getSpecifiedValue(element, property) {
  const cascade = getCascadedPropertyValue(element, property);

  if (cascade !== "") {
    return cascade;
  }

  // Defaulting
  const { initial, inherited } = properties[property];
  if (inherited === true && element.parentElement !== null) {
    return getComputedValue(element.parentElement, property);
  }

  // root element without parent element or inherited property
  return initial;
}

/**
 * https://drafts.csswg.org/css-cascade-4/#computed-value
 * @param {Element} element
 * @param {string} property
 */
function getComputedValue(element, property) {
  const { computedValue } = properties[property];
  if (computedValue === "as-specified") {
    return getSpecifiedValue(element, property);
  }

  throw new TypeError(`Unrecognized computed value instruction '${computedValue}'`);
}

/**
 * https://drafts.csswg.org/cssom/#resolved-value
 * Only implements `visibility`
 * @param {Element} element
 * @param {string} property
 */
function getResolvedValue(element, property) {
  // determined for special case properties none of which are implemented here
  // so we skip to "any other property: The resolved value is the computed value."
  return getComputedValue(element, property);
}

module.exports = { forEachSheetRuleOfElement, getResolvedValue, matches, properties };
