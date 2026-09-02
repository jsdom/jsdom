"use strict";

// The <line-width> keywords, as resolved by Chrome and Firefox. The values are
// implementation-defined; the spec only requires thin <= medium <= thick.
const lineWidthKeywords = new Map([
  ["thin", "1px"],
  ["medium", "3px"],
  ["thick", "5px"]
]);

// A border with one of these styles draws nothing and reserves no width.
const noBorderStyles = new Set(["none", "hidden"]);

/**
 * Resolves the computed value of a <line-width>: an absolute length.
 *
 * The computed value depends on nothing but the specified value; in particular not on the
 * border style beside it, since it is the computed value that inheritance transfers.
 *
 * @param {string} value - The specified value.
 * @param {object} resolvers - The computed value resolvers.
 * @param {Function} resolvers.resolveDefault - Resolves the value the default way.
 * @returns {string} The computed value.
 */
function resolveLineWidth(value, { resolveDefault }) {
  if (lineWidthKeywords.has(value)) {
    return lineWidthKeywords.get(value);
  }
  return resolveDefault(value);
}

/**
 * Returns the resolved value of a border-*-width property.
 *
 * Per https://drafts.csswg.org/css-backgrounds/#the-border-width, the used width is 0 if the
 * corresponding border style is none or hidden. Browsers expose that as the resolved value,
 * while the computed value - and so what a child inherits - stays the absolute length.
 *
 * @param {string} computedValue - The computed value.
 * @param {string} styleProperty - The border-*-style property beside it.
 * @param {object} resolvers - The resolved value resolvers.
 * @param {Function} resolvers.getComputedValue - Reads another property's computed value.
 * @returns {string} The resolved value.
 */
function getResolvedBorderWidth(computedValue, styleProperty, { getComputedValue }) {
  if (noBorderStyles.has(getComputedValue(styleProperty))) {
    return "0px";
  }
  return computedValue;
}

exports.getResolvedBorderWidth = getResolvedBorderWidth;
exports.resolveLineWidth = resolveLineWidth;
