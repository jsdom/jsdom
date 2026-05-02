"use strict";
// TODO: Support math keyword and calc().

const computedStyle = require("./computed-style");

const FONT_SIZE_UNIT_REGEXP = /^((?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%|[a-z]+)$/;

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

function resolveEmInPixels(node, root) {
  const fontSizes = collectFontSizes(node);
  const l = fontSizes.length;
  if (l === 1) {
    return resolveFontSizeInPixels(fontSizes[0], root);
  }
  let ratio = 1;
  for (let i = 1; i < l - 1; i++) {
    const size = fontSizes[i];
    ratio *= getFontSizeRatio(size);
  }
  const baseFontSize = resolveFontSizeInPixels(fontSizes[l - 1], root);
  const parent = baseFontSize * ratio;
  return resolveFontSizeInPixels(fontSizes[0], root, parent);
}

function collectFontSizes(node) {
  const fontSizes = [];
  let isAbsolute = false;
  while (node) {
    const propertyValue = node.style.getPropertyValue("font-size") ?? "";
    const fontSize = computedStyle.replaceEmptyValueAndKeywords(
      "font-size",
      propertyValue,
      node,
      { inherit: true, initial: "medium", isFontSize: true }
    );
    if (fontSize) {
      isAbsolute = isAbsoluteFontSize(fontSize);
      fontSizes.push(fontSize);
    }
    if (isAbsolute || !node.parentElement) {
      break;
    }
    node = node.parentElement;
  }

  return fontSizes;
}

function getFontSizeRatio(size) {
  if (absoluteFontSize.has(size)) {
    return absoluteFontSize.get(size).ratio;
  } else if (relativeFontSize.has(size)) {
    return relativeFontSize.get(size);
  }

  const match = FONT_SIZE_UNIT_REGEXP.exec(size);
  if (match) {
    const [, value, unit] = match;
    const numValue = parseFloat(value);
    if (absoluteLength.has(unit)) {
      return numValue * absoluteLength.get(unit);
    } else if (rootRelativeLength.has(unit)) {
      return numValue * rootRelativeLength.get(unit);
    } else if (relativeLength.has(unit)) {
      return numValue * relativeLength.get(unit);
    }
  }

  return Number.NaN;
}

function isAbsoluteFontSize(size) {
  if (absoluteFontSize.has(size)) {
    return true;
  }

  const match = FONT_SIZE_UNIT_REGEXP.exec(size);
  if (match) {
    const [,, unit] = match;
    return absoluteLength.has(unit) || rootRelativeLength.has(unit);
  }

  return false;
}

function resolveFontSizeInPixels(size, root, parent) {
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

  const match = FONT_SIZE_UNIT_REGEXP.exec(size);
  if (match) {
    const [, value, unit] = match;
    const numValue = parseFloat(value);
    if (absoluteLength.has(unit)) {
      return numValue * absoluteLength.get(unit);
    } else if (rootRelativeLength.has(unit)) {
      const pxSize = root ?? absoluteFontSize.get("medium").px;
      return numValue * rootRelativeLength.get(unit) * pxSize;
    } else if (relativeLength.has(unit)) {
      if (isRelative) {
        return numValue * relativeLength.get(unit) * parent;
      }
      const pxSize = root ?? absoluteFontSize.get("medium").px;
      return numValue * relativeLength.get(unit) * pxSize;
    }
  }

  return Number.NaN;
}

function resolveLengthInPixels(size, dimension = {}, isFontSize = false) {
  const { em, rem, vh, vw } = dimension;
  if (absoluteFontSize.has(size)) {
    return absoluteFontSize.get(size).px;
  } else if (relativeFontSize.has(size)) {
    return relativeFontSize.get(size) * em;
  }

  const match = FONT_SIZE_UNIT_REGEXP.exec(size);
  if (match) {
    const [, value, unit] = match;
    const numValue = parseFloat(value);

    // JSDOM does not have a layout, so return as-is for the percentage values other than font size.
    if (unit === "%" && !isFontSize) {
      return size;
    } else if (absoluteLength.has(unit)) {
      return numValue * absoluteLength.get(unit);
    } else if (rootRelativeLength.has(unit)) {
      const pxSize = rem ?? absoluteFontSize.get("medium").px;
      return numValue * rootRelativeLength.get(unit) * pxSize;
    } else if (relativeLength.has(unit)) {
      const pxSize = em ?? absoluteFontSize.get("medium").px;
      return numValue * relativeLength.get(unit) * pxSize;
    }

    switch (unit) {
      case "vb": {
        return numValue * vh;
      }
      case "vi": {
        return numValue * vw;
      }
      case "vmax": {
        return numValue * Math.max(vh, vw);
      }
      case "vmin": {
        return numValue * Math.min(vh, vw);
      }
      default: {
        if (Object.hasOwn(dimension, unit)) {
          return numValue * dimension[unit];
        }
      }
    }
  }

  // Return as-is as a fallback.
  return size;
}

exports.resolveEmInPixels = resolveEmInPixels;
exports.resolveFontSizeInPixels = resolveFontSizeInPixels;
exports.resolveLengthInPixels = resolveLengthInPixels;
