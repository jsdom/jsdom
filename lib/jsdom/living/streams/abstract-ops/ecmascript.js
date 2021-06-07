"use strict";
const assert = require("assert");

exports.CreateArrayFromList = elements => {
  // We use arrays to represent lists, so this is basically a no-op.
  // Do a slice though just in case we happen to depend on the unique-ness.
  return elements.slice();
};

exports.CopyDataBlockBytes = (dest, destOffset, src, srcOffset, n) => {
  new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
};

// Not implemented correctly
exports.TransferArrayBuffer = O => {
  assert(!exports.IsDetachedBuffer(O));
  return O;
};

// Not implemented correctly
exports.CanTransferArrayBuffer = O => {
  return !exports.IsDetachedBuffer(O);
};

// Not implemented correctly
exports.IsDetachedBuffer = () => {
  return false;
};
