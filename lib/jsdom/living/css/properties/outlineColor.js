"use strict";

const parsers = require("../helpers/css-values");

const property = "outline-color";

const descriptor = {
  set(v) {
    v = v.trim();
    if (parsers.hasVarFunc(v)) {
      this._setProperty(property, v);
    } else {
      const val = parse(v);
      if (typeof val === "string") {
        const priority = this._priorities.get(property) ?? "";
        this._setProperty(property, val, priority);
      }
    }
  },
  get() {
    const value = this.getPropertyValue(property);
    if (this._computed) {
      return this._getComputedValue(property, value);
    }
    return value;
  },
  enumerable: true,
  configurable: true
};

/**
 * Parses the outline-color property value.
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
    return parsers.resolveColorValue(value);
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
