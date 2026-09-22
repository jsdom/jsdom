"use strict";

const parsers = require("../helpers/css-values");
const { getResolvedBorderWidth, resolveLineWidth } = require("../helpers/line-widths");

const property = "border-bottom-width";

const descriptor = {
  set(v, priority = "") {
    v = v.trim();
    if (parsers.hasVarFunc(v)) {
      this._borderSetter(property, v, priority);
    } else {
      const val = parse(v);
      if (typeof val === "string") {
        this._borderSetter(property, val, priority);
      }
    }
  },
  get() {
    return this.getPropertyValue(property);
  },
  enumerable: true,
  configurable: true
};

function resolveComputedValue(value, resolvers) {
  return resolveLineWidth(value, resolvers);
}

function getResolvedValue(computedValue, resolvers) {
  return getResolvedBorderWidth(computedValue, "border-bottom-style", resolvers);
}

/**
 * Parses the border-bottom-width property value.
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
