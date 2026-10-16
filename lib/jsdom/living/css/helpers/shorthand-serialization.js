"use strict";

const { hasVarFunc, isGlobalKeyword, splitValue } = require("./css-values");
const { serializeLayer: serializePosition } = require("../properties/backgroundPosition");
const { getPositionValue, resetOnlyLonghands } = require("./shorthand-properties");
const { longhandsByShorthand } = require("../../../../generated/css-shorthand-relationships");

// Serialize implemented shorthands from their leaf values. The caller supplies authored values
// with a common priority, or resolved values for a computed declaration.
function serializeShorthand(property, getValue, { computed = true } = {}) {
  let values, globalValue;
  if (property === "border") {
    values = [];
    for (const component of ["border-width", "border-style", "border-color"]) {
      const longhands = longhandsByShorthand.get(component);
      const value = getValue(longhands[0]);
      for (let i = 1; i < longhands.length; ++i) {
        if (getValue(longhands[i]) !== value) {
          return "";
        }
      }
      values.push(value);
    }
  } else {
    values = longhandsByShorthand.get(property).map(getValue);
  }
  for (const value of values) {
    if (!value || hasVarFunc(value)) {
      return "";
    }
    if (isGlobalKeyword(value)) {
      globalValue = value;
    }
  }
  // An authored shorthand only serializes while its reset-only longhands hold the values it
  // assigned. Computed declarations resolve those longhands independently.
  if (!computed) {
    for (const [name, initial] of resetOnlyLonghands.get(property) ?? []) {
      const value = getValue(name);
      if (globalValue !== undefined ? value !== globalValue : value !== initial && value !== "initial") {
        return "";
      }
    }
  }
  if (globalValue !== undefined) {
    return values.every(value => value === globalValue) ? globalValue : "";
  }
  if (property === "background") {
    return serializeBackground(values, computed);
  }
  if (property === "background-position") {
    return serializeBackgroundPositions(values[0], values[1]).join(", ");
  }
  if (property === "font") {
    const [style, variant, weight, size, lineHeight, family] = values;
    if (variant !== "normal" && variant !== "small-caps") {
      return "";
    }
    const parts = [];
    if (style !== "normal") {
      parts.push(style);
    }
    if (variant !== "normal") {
      parts.push(variant);
    }
    if (weight !== "normal" && (!computed || weight !== "400")) {
      parts.push(weight);
    }
    parts.push(size);
    if (lineHeight !== "normal") {
      parts.push(`/ ${lineHeight}`);
    }
    parts.push(family);
    return parts.join(" ");
  }
  switch (property) {
    case "margin":
    case "padding":
    case "border-width":
    case "border-style":
    case "border-color":
      return getPositionValue(values);
    default:
      if (!computed && (property === "border" || property.startsWith("border-"))) {
        const defaults = ["medium", "none", "currentcolor"];
        const parts = values.filter((value, i) => value !== defaults[i]);
        return parts.length ? parts.join(" ") : "medium";
      }
      return values.join(" ");
  }
}

function serializeBackgroundPositions(xValue, yValue) {
  const x = splitValue(xValue, { delimiter: "," });
  const y = splitValue(yValue, { delimiter: "," });
  if (x.length !== y.length) {
    return [];
  }
  return x.map((value, i) => serializePosition(value, y[i]));
}

function serializeBackground([images, x, y, sizes, repeats, origins, clips, attachments, color], computed) {
  const layers = [
    splitValue(images, { delimiter: "," }),
    serializeBackgroundPositions(x, y),
    ...[sizes, repeats, attachments, origins, clips].map(value => splitValue(value, { delimiter: "," }))
  ];
  const count = layers[0].length;
  if ((!computed && layers.some(values => values.length !== count)) ||
      layers.some(values => !values.length || values.some(value => !value))) {
    return "";
  }
  const result = [];
  for (let i = 0; i < count; ++i) {
    const [image, position, size, repeat, attachment, origin, clip] = layers.map(values => values[i % values.length]);
    if (computed) {
      const prefix = i === count - 1 ? `${color} ` : "";
      result.push(`${prefix}${image} ${repeat} ${attachment} ${position} / ${size} ${origin} ${clip}`);
      continue;
    }
    const parts = [];
    if (image !== "none") {
      parts.push(image);
    }
    if (position !== "0% 0%" || size !== "auto") {
      parts.push(position);
    }
    if (size !== "auto") {
      parts.push(`/ ${size}`);
    }
    if (repeat !== "repeat") {
      parts.push(repeat);
    }
    if (attachment !== "scroll") {
      parts.push(attachment);
    }
    if (origin !== "padding-box" || clip !== "border-box") {
      parts.push(origin);
      if (clip !== origin) {
        parts.push(clip);
      }
    }
    if (i === count - 1 && color !== "transparent") {
      parts.push(color);
    }
    result.push(parts.length ? parts.join(" ") : "none");
  }
  return result.join(", ");
}

exports.serializeShorthand = serializeShorthand;
