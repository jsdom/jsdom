"use strict";

exports.add = add;
exports.getCalculationType = getCalculationType;
exports.matchNumericType = matchNumericType;
const dimensionValues = require("../values/dimension.js");
const cssValues = require("../values/value.js");
const valueDefinitions = require("../../../../generated/css-value-definitions.js");
const dimensionTypes = exports.dimensionTypes = [...dimensionValues.definitions.keys()];
const baseTypes = [...dimensionTypes, "<percentage>"];
exports.types = [...baseTypes, "<number>"];
const staticCalcKeywords = valueDefinitions["<calc-keyword>"].split(" | ");

function areEqualTypes(type1, type2, left = true) {
  for (const [type, power] of type1) {
    if (power === 0 && !type2.has(type)) {
      continue;
    }
    if (power !== type2.get(type)) {
      return false;
    }
  }
  return left ? areEqualTypes(type2, type1, false) : true;
}

function hasDimension(type) {
  for (const [dimension, power] of type) {
    if (dimension !== "percentage" && power > 0) {
      return true;
    }
  }
  return false;
}

function hasPercentage(type) {
  if (type.has("percentage")) {
    return type.get("percentage") > 0;
  }
  return false;
}

// https://drafts.css-houdini.org/css-typed-om-1/#apply-the-percent-hint
function applyPercentageHint(type, hint) {
  type.percentHint = hint;
  if (!type.has(hint)) {
    type.set(hint, 0);
  }
  if (type.has("percentage") && hint !== "percentage") {
    type.set(hint, type.get(hint) + type.get("percentage"));
    type.set("percentage", 0);
  }
}

function applyTypes(final, type1, type2) {
  type1.forEach((power, type) => final.set(type, power));
  type2.forEach((power, type) => {
    if (!final.has(type)) {
      final.set(type, power);
    }
  });
  final.percentHint = type1.percentHint;
}

function copy(type) {
  return create(null, type);
}

// https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-create-a-type
function create(unit, entries = [], percentHint = entries.percentHint ?? null) {
  const type = new Map(entries);
  type.percentHint = percentHint;
  if (unit === "%") {
    type.set("percentage", 1);
  } else if (unit) {
    for (const [dimension, { units }] of dimensionValues.definitions) {
      if (units.includes(unit)) {
        type.set(dimension, 1);
        return type;
      }
    }
  }
  return type;
}

// https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-invert-a-type
function invert(type) {
  const inverted = create(null, [], type.percentHint);
  type.forEach((exponent, unit) => inverted.set(unit, -1 * exponent));
  return inverted;
}

// https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-multiply-two-types
function multiply(type1, type2) {
  type1 = copy(type1);
  type2 = copy(type2);
  if (type1.percentHint) {
    if (type2.percentHint) {
      if (type2.percentHint !== type1.percentHint) {
        return null;
      }
    } else {
      applyPercentageHint(type2, type1.percentHint);
    }
  } else if (type2.percentHint) {
    applyPercentageHint(type1, type2.percentHint);
  }
  const finalType = create(undefined, type1);
  type2.forEach((power, type) => {
    if (finalType.has(type)) {
      finalType.set(type, finalType.get(type) + power);
    } else {
      finalType.set(type, power);
    }
  });
  return finalType;
}

// https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-add-two-types
function add(type1, type2) {
  type1 = copy(type1);
  type2 = copy(type2);
  if (type1.percentHint) {
    if (type2.percentHint) {
      if (type2.percentHint !== type1.percentHint) {
        return null;
      }
    } else {
      applyPercentageHint(type2, type1.percentHint);
    }
  } else if (type2.percentHint) {
    applyPercentageHint(type1, type2.percentHint);
  }
  const finalType = create();
  if (areEqualTypes(type1, type2)) {
    applyTypes(finalType, type1, type2);
    return finalType;
  }
  if ((hasPercentage(type1) || hasPercentage(type2)) && (hasDimension(type1) || hasDimension(type2))) {
    for (let baseType of baseTypes) {
      if (baseType === "<percentage>") {
        continue;
      }
      const t1 = copy(type1);
      const t2 = copy(type2);
      baseType = baseType.slice(1, -1);
      applyPercentageHint(t1, baseType);
      applyPercentageHint(t2, baseType);
      if (areEqualTypes(t1, t2)) {
        applyTypes(finalType, t1, t2);
        finalType.percentHint = baseType;
        return finalType;
      }
    }
  }
  return null;
}

// https://drafts.csswg.org/css-values-4/#css-make-a-type-consistent
function makeConsistent(base, { percentHint }) {
  if (base.percentHint && percentHint && base.percentHint !== percentHint) {
    return null;
  }
  if (!base.percentHint) {
    base.percentHint = percentHint;
  }
  return base;
}

function combineCalculationTypes(combine, [left, ...calculations], resolutionType) {
  left = getCalculationType(left, resolutionType);
  for (let right of calculations) {
    if (!left) {
      return left;
    }
    right = getCalculationType(right, resolutionType);
    if (!right) {
      return null;
    }
    left = combine(left, right);
  }
  return left;
}

function getCalculationFunctionType({ name, value }, resolutionType) {
  switch (name) {
    case "anchor":
    case "anchor-size":
      return create(undefined, [["length", 1]]);
    case "abs":
    case "calc":
      return getCalculationType(value, resolutionType);
    case "acos":
    case "asin":
    case "atan": {
      const type = getCalculationType(value, resolutionType);
      if (matchNumericType(type, "<number>", resolutionType)) {
        return makeConsistent(create(undefined, [["angle", 1]]), type);
      }
      return null;
    }
    case "atan2": {
      const type = combineCalculationTypes(add, value.filter(cssValues.isCalculation), resolutionType);
      if (type) {
        return makeConsistent(create(undefined, [["angle", 1]]), type);
      }
      return null;
    }
    case "calc-mix":
      return combineCalculationTypes(
        add,
        value.map(item => item[0]),
        resolutionType
      );
    case "clamp":
    case "hypot":
    case "max":
    case "min":
    case "mod":
    case "random":
    case "rem":
      return combineCalculationTypes(add, value.filter(cssValues.isCalculation), resolutionType);
    case "progress": {
      const type = combineCalculationTypes(add, value.filter(cssValues.isCalculation), resolutionType);
      if (matchNumericType(type, exports.types, resolutionType)) {
        return makeConsistent(create(), type);
      }
      return null;
    }
    case "cos":
    case "sin":
    case "tan": {
      const type = getCalculationType(value, resolutionType);
      if (matchNumericType(type, ["<number>", "<angle>"], resolutionType)) {
        return makeConsistent(create(), type);
      }
      return null;
    }
    case "exp":
    case "sqrt": {
      const type = getCalculationType(value, resolutionType);
      if (matchNumericType(type, "<number>", resolutionType)) {
        return makeConsistent(create(), type);
      }
      return null;
    }
    case "log":
    case "pow": {
      const type = combineCalculationTypes(add, value.filter(cssValues.isCalculation), resolutionType);
      if (matchNumericType(type, "<number>", resolutionType)) {
        return makeConsistent(create(), type);
      }
      return null;
    }
    case "round": {
      const type = combineCalculationTypes(add, value.filter(cssValues.isCalculation), resolutionType);
      if (value[0].value === "line-width" && !matchNumericType(type, "<length>", resolutionType)) {
        return null;
      }
      return type;
    }
    case "sibling-count":
    case "sibling-index":
      return create();
    case "sign": {
      const type = getCalculationType(value, resolutionType);
      if (type) {
        return makeConsistent(create(), type);
      }
      return null;
    }
    default:
      return null;
  }
}

// https://drafts.csswg.org/css-values-4/#determine-the-type-of-a-calculation
function getCalculationType(calculation, resolutionType) {
  for (let index = calculation.types.length - 1; index >= 0; index--) {
    switch (calculation.types[index]) {
      case "<calc-invert>": {
        const type = getCalculationType(calculation.value, resolutionType);
        return type ? invert(type) : null;
      }
      case "<calc-keyword>": {
        if (staticCalcKeywords.includes(calculation.value) || !resolutionType || resolutionType === "<number>") {
          return create();
        }
        return create(undefined, [[resolutionType.slice(1, -1), 1]]);
      }
      case "<calc-negate>":
        return getCalculationType(calculation.value, resolutionType);
      case "<calc-product>":
        return combineCalculationTypes(multiply, calculation, resolutionType);
      case "<calc-sum>":
        return combineCalculationTypes(add, calculation, resolutionType);
      case "<dimension-token>": {
        const type = dimensionValues.getTypeFromUnit(calculation.unit);
        return type ? create(undefined, [[type.slice(1, -1), 1]]) : null;
      }
      case "<function>":
        return getCalculationFunctionType(calculation, resolutionType);
      case "<integer>":
      case "<number>":
        return create();
      case "<percentage>":
        if (resolutionType && resolutionType !== "<number>") {
          return create(undefined, [[resolutionType.slice(1, -1), 1]], resolutionType.slice(1, -1));
        }
        return create(undefined, [["percentage", 1]], "percentage");
    }
  }
  return null;
}

// https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-match
function matchNumericType(type, production, resolutionType = null) {
  // Allow running this function with a type failure, for convenience
  if (!type) {
    return false;
  }
  // Allow running this function with some productions to match
  if (Array.isArray(production)) {
    return production.some(entryProduction => matchNumericType(type, entryProduction, resolutionType));
  }
  const nonZeroEntries = [];
  type.forEach((power, entryType) => {
    if (power) {
      nonZeroEntries.push([entryType, power]);
    }
  });
  production = production.slice(1, -1);
  if (resolutionType) {
    resolutionType = resolutionType?.slice(1, -1);
  }
  const { length } = nonZeroEntries;
  if (length === 1) {
    const [[entry, power]] = nonZeroEntries;
    // Future CSS types may have power > 1
    if (power !== 1) {
      return false;
    }
    if (production === entry) {
      if (production === "percentage") {
        return type.percentHint === "percentage";
      }
      return !type.percentHint || type.percentHint === resolutionType;
    }
    return false;
  }
  if (length === 0 && production === "number") {
    switch (type.percentHint) {
      case null:
        return true;
      case "percentage":
        return resolutionType === "number";
      default:
        return type.percentHint === resolutionType;
    }
  }
  return false;
}
