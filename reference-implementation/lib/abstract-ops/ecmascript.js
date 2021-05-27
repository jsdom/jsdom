'use strict';
const assert = require('assert');

const isFakeDetached = Symbol('is "detached" for our purposes');

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
  const transferredIshVersion = O.slice();

  // This is specifically to fool tests that test "is transferred" by taking a non-zero-length
  // ArrayBuffer and checking if its byteLength starts returning 0.
  Object.defineProperty(O, 'byteLength', {
    get() {
      return 0;
    }
  });
  O[isFakeDetached] = true;

  return transferredIshVersion;
};

// Not implemented correctly
exports.CanTransferArrayBuffer = O => {
  return !exports.IsDetachedBuffer(O);
};

// Not implemented correctly
exports.IsDetachedBuffer = O => {
  return isFakeDetached in O;
};
