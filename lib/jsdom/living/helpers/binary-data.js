"use strict";

exports.concatTypedArrays = arrays => {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    const toSet = arr instanceof Uint8Array ? arr : new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    result.set(toSet, offset);
    offset += arr.byteLength;
  }
  return result;
};

// See https://github.com/jsdom/jsdom/pull/2743#issuecomment-562991955 for background.
exports.copyToArrayBufferInNewRealm = (uint8Array, newRealm) => {
  const newAB = new newRealm.ArrayBuffer(uint8Array.byteLength);
  const view = new newRealm.Uint8Array(newAB);
  view.set(uint8Array);
  return newAB;
};
