"use strict";

exports.isMedia = isMedia;
exports.group = group;
exports.unknown = unknown;
exports.not = not;
exports.condition = condition;
exports.query = query;
exports.mapValues = mapValues;

function isMedia(value) {
  return typeof value.kind === "string" && value.kind.startsWith("media-");
}

function group(value) {
  return { kind: "media-group", value };
}

function unknown(value) {
  return { kind: "media-unknown", value };
}

function not(value) {
  return { kind: "media-not", value };
}

function condition(operator, values) {
  return values.length === 1 ? values[0] : { kind: "media-condition", operator, values };
}

function query(modifier, type, conditionValue) {
  return { kind: "media-query", modifier, type, condition: conditionValue };
}

// Only feature operands use the general value grammar. Unknown clauses remain
// opaque values; their caller decides whether to traverse them.
function mapValues(value, transform) {
  switch (value.kind) {
    case "media-group":
    case "media-not":
      return { ...value, value: mapValues(value.value, transform) };
    case "media-condition":
      return { ...value, values: value.values.map((child) => mapValues(child, transform)) };
    case "media-query":
      return value.condition === null
        ? value
        : { ...value, condition: mapValues(value.condition, transform) };
    case "media-unknown":
      return value;
    case "media-feature": {
      const result = { ...value };
      if (Object.hasOwn(value, "value")) {
        result.value = transform(value.value);
      }
      if (Object.hasOwn(value, "left")) {
        result.left = transform(value.left);
      }
      if (Object.hasOwn(value, "right")) {
        result.right = transform(value.right);
      }
      return result;
    }
    default:
      return transform(value);
  }
}
