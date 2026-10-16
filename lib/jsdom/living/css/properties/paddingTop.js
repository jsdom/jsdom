"use strict";

const parsers = require("../helpers/css-values");

const property = "padding-top";

const position = "top";

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
 * Parses the padding-top property value.
 *
 * @param {string} v - The value to parse.
 * @returns {string|undefined} The parsed value or undefined if invalid.
 */
function parse(v) {
  if (v === "") {
    return v;
  }
  const value = parsers.parsePropertyValue(property, v);
  if (Array.isArray(value) && value.length === 1) {
    return parsers.resolveNumericValue(value, {
      min: 0,
      type: "length"
    });
  } else if (typeof value === "string") {
    return value;
  }
  return undefined;
}

module.exports = {
  descriptor,
  parse,
  position,
  property
};
