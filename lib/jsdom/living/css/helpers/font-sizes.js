"use strict";
// TODO: Support math keyword.

const cssValues = require("./css-values");

const FONT_SIZE_REGEXP = /^((?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%|[a-z]+)$/;
const LENGTH_REGEXP = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%|[a-z]*)$/;
const PERCENTAGE_REGEXP = /([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)%/g;

// Absolute font size mapping table.
const absoluteFontSize = new Map([
  ["xx-small", { px: 9, ratio: 9 / 16 }],
  ["x-small", { px: 10, ratio: 5 / 8 }],
  ["small", { px: 13, ratio: 13 / 16 }],
  ["medium", { px: 16, ratio: 1 }],
  ["large", { px: 18, ratio: 9 / 8 }],
  ["x-large", { px: 24, ratio: 1.5 }],
  ["xx-large", { px: 32, ratio: 2 }],
  ["xxx-large", { px: 48, ratio: 3 }]
]);

// Ratio of relative font size to pixels.
const relativeFontSize = new Map([
  ["smaller", 1 / 1.2],
  ["larger", 1.2]
]);

// Ratio of absolute length to pixels.
const absoluteLength = new Map([
  ["cm", 96 / 2.54],
  ["mm", 96 / 25.4],
  ["q", 96 / 101.6],
  ["in", 96],
  ["pc", 16],
  ["pt", 96 / 72],
  ["px", 1]
]);

// Ratio of root relative length to pixels.
const rootRelativeLength = new Map([
  ["rcap", 1],
  ["rch", 0.5],
  ["rem", 1],
  ["rex", 0.5],
  ["ric", 1],
  ["rlh", 1.2]
]);

// Ratio of relative length or percentage to pixels.
const relativeLength = new Map([
  ["%", 0.01],
  ["cap", 1],
  ["ch", 0.5],
  ["em", 1],
  ["ex", 0.5],
  ["ic", 1],
  ["lh", 1.2]
]);

function resolveFontSizeInPixels(elementImpl, size, root, parent) {
  const isRelative = typeof parent === "number";

  if (absoluteFontSize.has(size)) {
    const pxSize = absoluteFontSize.get(size).px;
    if (isRelative) {
      return pxSize * parent;
    }
    return pxSize;
  } else if (isRelative && relativeFontSize.has(size)) {
    return relativeFontSize.get(size) * parent;
  }

  const match = FONT_SIZE_REGEXP.exec(size);
  if (match) {
    const [, value, unit] = match;
    if (absoluteLength.has(unit)) {
      return value * absoluteLength.get(unit);
    } else if (rootRelativeLength.has(unit)) {
      const pxSize = root ?? absoluteFontSize.get("medium").px;
      return value * rootRelativeLength.get(unit) * pxSize;
    } else if (relativeLength.has(unit)) {
      if (isRelative) {
        return value * relativeLength.get(unit) * parent;
      }
      const pxSize = root ?? absoluteFontSize.get("medium").px;
      return value * relativeLength.get(unit) * pxSize;
    }
  }

  return Number.NaN;
}

// Replaces the percentages in a font-size math function with their pixel equivalent.
// Percentages in font-size are relative to the parent's font size, which is the em unit here.
function replaceFontSizePercentages(size, em) {
  if (cssValues.hasVarFunc(size)) {
    return size;
  }
  const pxSize = em ?? absoluteFontSize.get("medium").px;
  return size.replace(PERCENTAGE_REGEXP, (_, value) => `${value * relativeLength.get("%") * pxSize}px`);
}

function resolveLengthInPixels(elementImpl, size, dimension, isFontSize) {
  const { em, rem, vh, vw } = dimension;
  if (absoluteFontSize.has(size)) {
    return absoluteFontSize.get(size).px;
  } else if (relativeFontSize.has(size)) {
    return relativeFontSize.get(size) * em;
  } else if (cssValues.hasCalcFunc(size)) {
    let calcDimension = dimension;
    if (elementImpl === elementImpl._ownerDocument.documentElement) {
      calcDimension = {
        em: absoluteFontSize.get("medium").px,
        rem: absoluteFontSize.get("medium").px,
        vh: elementImpl._globalObject.innerHeight / 100,
        vw: elementImpl._globalObject.innerWidth / 100
      };
    }
    // Percentages in font-size resolve against the parent's font size at computed-value time,
    // so substitute them before reducing the math function.
    const sizeToResolve = isFontSize ? replaceFontSizePercentages(size, calcDimension.em) : size;
    const resolvedSize = cssValues.resolveCalc(sizeToResolve, {
      dimension: calcDimension,
      format: "computedValue"
    });
    const matchLength = LENGTH_REGEXP.exec(resolvedSize);
    if (matchLength) {
      const [, value] = matchLength;
      return Number(value);
    }

    // A percentage of something other than a font size prevents full reduction, e.g.
    // width: calc(100% - 1rem) resolves to calc(100% - 16px). The lengths within the math
    // function are still absolutized at computed-value time.
    if (typeof resolvedSize === "string" && resolvedSize) {
      return resolvedSize;
    }

    // Return as-is as a fallback.
    return size;
  }

  const match = LENGTH_REGEXP.exec(size);
  if (match) {
    const [, value, unit] = match;

    // Percentage value resolution varies depending on the property.
    // Therefore, except for font-size, the values are returned as-is without attempting to resolve them.
    if (unit === "%" && !isFontSize) {
      return size;
    } else if (absoluteLength.has(unit)) {
      return value * absoluteLength.get(unit);
    } else if (rootRelativeLength.has(unit)) {
      const pxSize = rem ?? absoluteFontSize.get("medium").px;
      return value * rootRelativeLength.get(unit) * pxSize;
    } else if (relativeLength.has(unit)) {
      const pxSize = em ?? absoluteFontSize.get("medium").px;
      return value * relativeLength.get(unit) * pxSize;
    }

    switch (unit) {
      case "vb": {
        return value * vh;
      }
      case "vi": {
        return value * vw;
      }
      case "vmax": {
        return value * Math.max(vh, vw);
      }
      case "vmin": {
        return value * Math.min(vh, vw);
      }
      default: {
        if (Object.hasOwn(dimension, unit)) {
          return value * dimension[unit];
        }
      }
    }
  }

  // Return as-is as a fallback.
  return size;
}

exports.absoluteFontSize = absoluteFontSize;
exports.resolveFontSizeInPixels = resolveFontSizeInPixels;
exports.resolveLengthInPixels = resolveLengthInPixels;
