"use strict";

exports.canonicalize = canonicalize;
exports.validate = validate;
exports.getCanonicalUnitFromType = getCanonicalUnitFromType;
exports.getTypeFromUnit = getTypeFromUnit;
const lengthUnits = require("./length-units.js");
const definitions = (exports.definitions = new Map([
  [
    "<angle>",
    {
      absoluteUnits: ["deg", "grad", "rad", "turn"],
      canonicalUnit: "deg",
      units: ["deg", "grad", "rad", "turn"],
    },
  ],
  [
    "<flex>",
    {
      canonicalUnit: "fr",
      min: 0,
      units: ["fr"],
    },
  ],
  [
    "<frequency>",
    {
      absoluteUnits: ["hz", "khz"],
      canonicalUnit: "hz",
      units: ["hz", "khz"],
    },
  ],
  [
    "<length>",
    {
      absoluteUnits: ["cm", "in", "mm", "q", "pc", "pt", "px"],
      canonicalUnit: "px",
      units: Object.values(lengthUnits).flat(),
    },
  ],
  [
    "<resolution>",
    {
      absoluteUnits: ["dpcm", "dpi", "dppx", "x"],
      canonicalUnit: "dppx",
      min: 0,
      units: ["dpcm", "dpi", "dppx", "x"],
    },
  ],
  [
    "<time>",
    {
      absoluteUnits: ["s", "ms"],
      canonicalUnit: "s",
      units: ["ms", "s"],
    },
  ],
]));

function validate(dimension, name, min, max) {
  const definition = definitions.get(name);
  if (definition) {
    const { unit, value } = canonicalize(dimension);
    min = Math.max(min ?? -Infinity, definition.min ?? -Infinity);
    max = Math.min(max ?? Infinity, definition.max ?? Infinity);
    if (definition.units.includes(unit) && min <= value && value <= max) {
      return dimension;
    }
  }
  return null;
}

function canonicalize(dimension) {
  const { types, unit, value } = dimension;
  switch (unit) {
    case "cm":
      return {
        types,
        unit: "px",
        value: (value * 96) / 2.54,
      };
    case "dpcm":
      return {
        types,
        unit: "dppx",
        value: (value * 2.54) / 96,
      };
    case "dpi":
      return {
        types,
        unit: "dppx",
        value: value / 96,
      };
    case "in":
      return {
        types,
        unit: "px",
        value: value * 96,
      };
    case "grad":
      return {
        types,
        unit: "deg",
        value: (value * 360) / 400,
      };
    case "khz":
      return {
        types,
        unit: "hz",
        value: value * 1000,
      };
    case "mm":
      return {
        types,
        unit: "px",
        value: (value * 96) / 2.54 / 10,
      };
    case "ms":
      return {
        types,
        unit: "s",
        value: value / 1000,
      };
    case "q":
      return {
        types,
        unit: "px",
        value: (value * 96) / 2.54 / 40,
      };
    case "pc":
      return {
        types,
        unit: "px",
        value: (value * 96) / 6,
      };
    case "pt":
      return {
        types,
        unit: "px",
        value: (value * 96) / 72,
      };
    case "rad":
      return {
        types,
        unit: "deg",
        value: (value * 180) / Math.PI,
      };
    case "turn":
      return {
        types,
        unit: "deg",
        value: value * 360,
      };
    case "x":
      return {
        types,
        unit: "dppx",
        value,
      };
    default:
      return dimension;
  }
}

function getCanonicalUnitFromType(type) {
  return definitions.get(type).canonicalUnit;
}

function getTypeFromUnit(unit) {
  for (const [type, { units }] of definitions) {
    if (units.includes(unit)) {
      return type;
    }
  }
  return null;
}
