"use strict";

const { hasVarFunc, isGlobalKeyword, splitValue } = require("./css-values");
const { getPositionValue, shorthandProperties } = require("./shorthand-properties");

// Serialize the shorthands whose declarations we expand, using their resolved longhand values.
function serializeShorthand(property, getValue) {
  if (property === "background") {
    return serializeBackground(getValue);
  }
  if (property === "border") {
    const sides = ["top", "right", "bottom", "left"].map(side => getValue(`border-${side}`));
    return sides.every(value => value === sides[0]) ? sides[0] : "";
  }

  const { shorthandFor } = shorthandProperties.get(property);
  const values = Array.from(shorthandFor.keys(), getValue);
  if (values.some(value => !value || hasVarFunc(value))) {
    return "";
  }
  if (values.some(isGlobalKeyword)) {
    return values.every(value => value === values[0]) ? values[0] : "";
  }
  if (property === "background-position") {
    const [x, y] = values.map(value => splitValue(value, { delimiter: "," }));
    if (x.length !== y.length) {
      return "";
    }
    return x.map((value, i) => `${value} ${y[i]}`).join(", ");
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
    if (weight !== "normal" && weight !== "400") {
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
      return values.join(" ");
  }
}

function serializeBackground(getValue) {
  const properties = [
    "background-image", "background-position", "background-size", "background-repeat",
    "background-attachment", "background-origin", "background-clip"
  ];
  const layers = properties.map(property => splitValue(getValue(property), { delimiter: "," }));
  const color = getValue("background-color");
  const count = layers[0].length;
  if (!color || hasVarFunc(color) ||
      layers.some(values => !values.length || values.some(value => !value || hasVarFunc(value)))) {
    return "";
  }
  const result = [];
  for (let i = 0; i < count; ++i) {
    const [image, position, size, repeat, attachment, origin, clip] = layers.map(values => values[i % values.length]);
    const prefix = i === count - 1 ? `${color} ` : "";
    result.push(`${prefix}${image} ${repeat} ${attachment} ${position} / ${size} ${origin} ${clip}`);
  }
  return result.join(", ");
}

exports.serializeShorthand = serializeShorthand;
