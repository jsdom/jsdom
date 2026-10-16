"use strict";

const parsers = require("../helpers/css-values");

const property = "background-image";

const descriptor = {
  set(value, priority = "") {
    value = value.trim();
    this._setProperty(property, parsers.hasVarFunc(value) ? value : parse(value), priority);
  },
  get() {
    return this._getPropertyValue(property);
  },
  enumerable: true,
  configurable: true
};

/**
 * Parses the background-image property value.
 *
 * @param {string} v - The value to parse.
 * @returns {string|undefined} The parsed value or undefined if invalid.
 */
function parse(v) {
  if (v === "") {
    return v;
  }
  if (!parsers.isValidPropertyValue(property, v)) {
    return undefined;
  }
  const values = parsers.splitValue(v, { delimiter: "," });
  const parsedValues = [];
  for (const val of values) {
    const value = parsers.parsePropertyValue(property, val);
    if (Array.isArray(value) && value.length === 1) {
      const parsedValue = parsers.resolveImageValue(value);
      if (!parsedValue) {
        return undefined;
      }
      parsedValues.push(parsedValue);
    } else if (typeof value === "string") {
      parsedValues.push(value);
    } else {
      return undefined;
    }
  }
  if (parsedValues.length) {
    return parsedValues.join(", ");
  }
  return undefined;
}

module.exports = {
  descriptor,
  parse,
  property
};
