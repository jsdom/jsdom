"use strict";

const parsers = require("../helpers/css-values");
const fontStyle = require("./fontStyle");
const fontVariant = require("./fontVariant");
const fontWeight = require("./fontWeight");
const fontSize = require("./fontSize");
const lineHeight = require("./lineHeight");
const fontFamily = require("./fontFamily");
const { asciiLowercase } = require("../../helpers/strings");

const property = "font";
const fontStretch = "font-stretch";

const shorthandFor = new Map([
  [fontStyle.property, fontStyle],
  [fontVariant.property, fontVariant],
  [fontWeight.property, fontWeight],
  [fontSize.property, fontSize],
  [lineHeight.property, lineHeight],
  [fontFamily.property, fontFamily],
  [fontStretch, { property: fontStretch }]
]);

const descriptor = {
  set(value, priority = "") {
    this._setShorthand(property, value.trim(), priority);
  },
  get() {
    return this._getPropertyValue(property);
  },
  enumerable: true,
  configurable: true
};

/**
 * Parses the font property value.
 *
 * @param {string} v - The value to parse.
 * @returns {object|string|undefined} The parsed value object or undefined if invalid.
 */
function parse(v) {
  if (v === "") {
    return v;
  } else if (parsers.hasCalcFunc(v)) {
    v = parsers.resolveCalc(v);
    if (v === undefined) {
      return undefined;
    }
  }
  if (!parsers.isValidPropertyValue(property, v)) {
    return undefined;
  }
  const [fontBlock, ...families] = parsers.splitValue(v, { delimiter: "," });
  const [beforeSlash, afterSlash] = parsers.splitValue(fontBlock, { delimiter: "/" });
  const parts = splitFontBlock(beforeSlash);
  const font = {
    [fontStyle.property]: "normal",
    [fontVariant.property]: "normal",
    [fontWeight.property]: "normal",
    [fontStretch]: "normal",
    [lineHeight.property]: "normal"
  };
  let sizeIndex = -1;
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    const keyword = asciiLowercase(part);
    if (keyword === "normal") {
      continue;
    }
    const size = fontSize.parse(part);
    if (size !== undefined) {
      font[fontSize.property] = size;
      sizeIndex = i;
      break;
    }
    const style = fontStyle.parse(part);
    const weight = fontWeight.parse(part);
    if (style !== undefined) {
      font[fontStyle.property] = style;
    } else if (weight !== undefined) {
      font[fontWeight.property] = weight;
    } else if (keyword === "small-caps") {
      font[fontVariant.property] = keyword;
    } else if (parsers.isValidPropertyValue(fontStretch, part)) {
      font[fontStretch] = keyword;
    } else {
      return undefined;
    }
  }
  // System fonts are not implemented.
  if (sizeIndex === -1) {
    return undefined;
  }
  let family;
  if (afterSlash !== undefined) {
    const [height, ...familyParts] = parsers.splitValue(afterSlash);
    const parsedHeight = lineHeight.parse(height);
    if (parsedHeight === undefined) {
      return undefined;
    }
    font[lineHeight.property] = parsedHeight;
    family = familyParts.join(" ");
  } else {
    family = parts.slice(sizeIndex + 1).join(" ");
  }
  const parsedFamily = fontFamily.parse([family, ...families].join(", "));
  if (!parsedFamily) {
    return undefined;
  }
  font[fontFamily.property] = parsedFamily;
  return font;
}

function splitFontBlock(value) {
  const parts = parsers.splitValue(value);
  // An oblique style and its optional angle form a single component of the shorthand.
  for (let i = 0; i + 1 < parts.length; ++i) {
    if (asciiLowercase(parts[i]) === "oblique") {
      const style = fontStyle.parse(`${parts[i]} ${parts[i + 1]}`);
      if (style !== undefined) {
        parts.splice(i, 2, style);
      }
      break;
    }
  }
  return parts;
}

module.exports = {
  descriptor,
  parse,
  property,
  shorthandFor
};
