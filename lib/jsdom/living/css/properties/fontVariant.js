"use strict";

const parsers = require("../helpers/css-values");

const property = "font-variant";

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
 * Parses the font-variant property value.
 *
 * @param {string} v - The value to parse.
 * @returns {string|undefined} The parsed value or undefined if invalid.
 */
function parse(v) {
  if (v === "") {
    return v;
  }
  const values = parsers.splitValue(v);
  const parsedValues = [];
  for (const val of values) {
    const value = parsers.parsePropertyValue(property, val);
    if (Array.isArray(value) && value.length === 1) {
      const parsedValue = parsers.resolveFunctionValue(value);
      if (!parsedValue) {
        return undefined;
      }
      parsedValues.push(parsedValue);
    } else if (typeof value === "string") {
      parsedValues.push(value);
    }
  }
  if (parsedValues.length) {
    if (parsedValues.length > 1) {
      if (parsedValues.includes("normal") || parsedValues.includes("none")) {
        return undefined;
      }
    }
    return parsedValues.join(" ");
  }
  return undefined;
}

module.exports = {
  descriptor,
  parse,
  property
};
