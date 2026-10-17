"use strict";

const parsers = require("../helpers/css-values");
const marginTop = require("./marginTop");
const marginRight = require("./marginRight");
const marginBottom = require("./marginBottom");
const marginLeft = require("./marginLeft");

const property = "margin";

const position = "edges";

const shorthandFor = new Map([
  [marginTop.property, marginTop],
  [marginRight.property, marginRight],
  [marginBottom.property, marginBottom],
  [marginLeft.property, marginLeft]
]);

const descriptor = {
  set(value, priority = "") {
    this._setShorthand(property, value.trim(), priority);
  },
  get() {
    return this._getPropertyValue(property);
  },
  enumerable: true,
  configurable: true
};

/**
 * Parses the margin property value.
 *
 * @param {string} v - The value to parse.
 * @returns {Array<string>|string|undefined} The parsed value or undefined if invalid.
 */
function parse(v) {
  if (v === "") {
    return v;
  }
  const values = parsers.parsePropertyValue(property, v);
  const parsedValues = [];
  if (Array.isArray(values) && values.length) {
    if (values.length > 4) {
      return undefined;
    }
    for (const value of values) {
      const parsedValue = parsers.resolveNumericValue([value], {
        length: values.length,
        type: "length"
      });
      if (!parsedValue) {
        return undefined;
      }
      parsedValues.push(parsedValue);
    }
  } else if (typeof values === "string") {
    parsedValues.push(values);
  }
  if (parsedValues.length) {
    return parsedValues;
  }
  return undefined;
}

module.exports = {
  descriptor,
  parse,
  position,
  property,
  shorthandFor
};
