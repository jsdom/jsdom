"use strict";

const parsers = require("../helpers/css-values");

const property = "font-weight";

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

function resolveComputedValue(value, { getInheritedValue, resolveDefault }) {
  if (value === "normal") {
    return "400";
  }
  if (value === "bold") {
    return "700";
  }
  if (value !== "bolder" && value !== "lighter") {
    return resolveDefault(value);
  }

  const inheritedValue = getInheritedValue(property, {
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
}

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
  property,
  resolveComputedValue
};
