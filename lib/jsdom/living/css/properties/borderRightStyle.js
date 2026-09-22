"use strict";

const parsers = require("../helpers/css-values");

const property = "border-right-style";

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

/**
 * Parses the border-right-style property value.
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
    return parsers.resolveKeywordValue(value);
  } else if (typeof value === "string") {
    return value;
  }
  return undefined;
}

module.exports = {
  descriptor,
  parse,
  property
};
