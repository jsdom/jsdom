"use strict";

const { serializeComponentValue, serializeIdentifierFromPrimitive } = require("../serialize.js");

function serializeMedia(value, context) {
  switch (value.kind) {
    case "media-unknown":
      return serializeComponentValue(value.value);
    case "media-group":
      return `(${serializeComponentValue(value.value)})`;
    case "media-not":
      return `not ${serializeComponentValue(value.value)}`;
    case "media-condition":
      return value.values.map(child => serializeComponentValue(child, context)).join(` ${value.operator} `);
    case "media-query": {
      const { modifier, type, condition } = value;
      if (modifier === null && type === "all" && condition !== null) {
        return serializeComponentValue(condition);
      }
      return (modifier === null ? "" : `${modifier} `) + serializeIdentifierFromPrimitive(type) +
        (condition === null ? "" : ` and ${serializeComponentValue(condition)}`);
    }
    case "media-feature": {
      const name = serializeIdentifierFromPrimitive(value.name);
      if (Object.hasOwn(value, "value")) {
        return `${name}: ${serializeComponentValue(value.value, context)}`;
      }
      const left = !Object.hasOwn(value, "left") ?
        "" :
        `${serializeComponentValue(value.left, context)} ${value.leftOperator} `;
      const right = !Object.hasOwn(value, "right") ?
        "" :
        ` ${value.rightOperator} ${serializeComponentValue(value.right, context)}`;
      return left + name + right;
    }
    default:
      throw new RangeError("Unexpected native media kind");
  }
}

exports.serializeMedia = serializeMedia;
