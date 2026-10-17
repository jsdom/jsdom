"use strict";

const parsers = require("../helpers/css-values");
const { getResolvedBorderWidth, resolveLineWidth } = require("../helpers/line-widths");

const property = "border-top-width";

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

function resolveComputedValue(value, resolvers) {
  return resolveLineWidth(value, resolvers);
}

function getResolvedValue(computedValue, resolvers) {
  return getResolvedBorderWidth(computedValue, "border-top-style", resolvers);
}

/**
 * Parses the border-top-width property value.
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
  getResolvedValue,
  parse,
  property,
  resolveComputedValue
};
