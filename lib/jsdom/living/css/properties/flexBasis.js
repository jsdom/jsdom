"use strict";

const parsers = require("../helpers/css-values");

const property = "flex-basis";
const shorthand = "flex";

const descriptor = {
  set(v, priority = "") {
    v = v.trim();
    if (parsers.hasVarFunc(v)) {
      this._setProperty(shorthand, "");
      this._setProperty(property, v, priority);
    } else {
      const val = parse(v);
      if (typeof val === "string") {
        this._flexBoxSetter(property, val, priority, shorthand);
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
 * Parses the flex-basis property value.
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
      type: "length",
      min: 0
    });
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
