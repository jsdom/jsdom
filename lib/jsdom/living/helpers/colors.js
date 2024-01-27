"use strict";

const { resolve: getResolvedValueForColor } = require("@asamuzakjp/css-color");

// Implements some of https://drafts.csswg.org/css-color-4/#resolving-sRGB-values and
// https://drafts.csswg.org/css-color-4/#serializing-sRGB-values, in a somewhat fragile way since
// we're not using a real parser/serializer. Attempts to cover:
// * hex colors
// * 'rgb()' and 'rgba()' values
// * named colors
// * 'transparent'

exports.getSpecifiedColor = color => {
  if (/^transparent$/i.test(color)) {
    return "transparent";
  }

  return getResolvedValueForColor(color);
};

exports.getComputedOrUsedColor = color => {
  return getResolvedValueForColor(color);
};
