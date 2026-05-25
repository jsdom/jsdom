"use strict";

const parsers = require("../helpers/css-values");
const backgroundPosition = require("./backgroundPosition");

const property = backgroundPosition.propertyX;
const shorthand = backgroundPosition.property;

const descriptor = {
  set(v) {
    v = v.trim();
    if (parsers.hasVarFunc(v)) {
      this._setProperty("background", "");
      this._setProperty(shorthand, "");
      this._setProperty(property, v);
    } else {
      const val = parse(v);
      if (typeof val === "string") {
        const priority =
          !this._priorities.get(shorthand) && this._priorities.has(property) ? this._priorities.get(property) : "";
        backgroundPosition.setLonghand(this, property, val, priority);
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
  parse,
  property
};
