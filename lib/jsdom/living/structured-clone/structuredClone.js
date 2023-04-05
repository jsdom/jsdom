"use strict";

const { structuredDeserializeWithTransfer } = require("./structuredDeserializeWithTransfer");
const { structuredSerializeWithTransfer } = require("./structuredSerializeWithTransfer");

module.exports = function (globalObject) {
  return function (value, options) {
    // Let serialized be ? StructuredSerializeWithTransfer(value, options["transfer"]).
    const serialized = structuredSerializeWithTransfer(value, options.transfer);

    // Let deserializeRecord be ? StructuredDeserializeWithTransfer(serialized, this's relevant realm).
    const deserializeRecord = structuredDeserializeWithTransfer(serialized, globalObject);

    // Return deserializeRecord.[[Deserialized]].
    return deserializeRecord.Deserialized;
  };
};
