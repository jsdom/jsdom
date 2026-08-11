"use strict";

const parsers = require("../helpers/css-values");

const property = "font-weight";
const shorthand = "font";

const descriptor = {
  set(v) {
    v = v.trim();
    if (parsers.hasVarFunc(v)) {
      this._setProperty(shorthand, "");
      this._setProperty(property, v);
    } else {
      const val = parse(v);
      if (typeof val === "string") {
        const priority =
          !this._priorities.get(shorthand) && this._priorities.has(property) ? this._priorities.get(property) : "";
        this._setProperty(property, val, priority);
      }
    }
  },
  get() {
    return this.getPropertyValue(property);
  },
  resolveComputedValue(value, elementImpl, getInheritedPropertyValue) {
    if (value === "normal") {
      return "400";
    }
    if (value === "bold") {
      return "700";
    }
    if (value !== "bolder" && value !== "lighter") {
      return value;
    }

    const inheritedValue = getInheritedPropertyValue(property, elementImpl, {
      inherit: true,
      initial: "400"
    });
    const inheritedWeight = Number(inheritedValue);

    if (value === "bolder") {
      if (inheritedWeight < 350) {
        return "400";
      }
      if (inheritedWeight < 550) {
        return "700";
      }
      if (inheritedWeight < 900) {
        return "900";
      }
      return inheritedValue;
    }

    if (inheritedWeight < 100) {
      return inheritedValue;
    }
    if (inheritedWeight < 550) {
      return "100";
    }
    if (inheritedWeight < 750) {
      return "400";
    }
    return "700";
  },
  enumerable: true,
  configurable: true
};

/**
 * Parses the font-weight property value.
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
    const parsedValue = parsers.resolveNumericValue(value, {
      min: 1,
      max: 1000
    });
    if (!parsedValue) {
      return undefined;
    }
    return parsedValue;
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
