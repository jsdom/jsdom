"use strict";

const parsers = require("../helpers/css-values");
const backgroundPosition = require("./backgroundPosition");

const property = backgroundPosition.propertyX;

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
 * Parses the background-position-x property value.
 *
 * @param {string} v - The value to parse.
 * @returns {string|undefined} The parsed value or undefined if invalid.
 */
function parse(v) {
  return backgroundPosition.parseLonghand(property, v);
}

module.exports = {
  descriptor,
  getResolvedValue: backgroundPosition.getResolvedLonghand,
  parse,
  property,
  resolveComputedValue: backgroundPosition.resolveComputedLonghand
};
