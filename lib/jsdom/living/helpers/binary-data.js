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

// Used when we have some internal data, usually in the Node.js realm, and we need to copy it to the target realm. We
// use this when we need to keep the original data around, e.g., in `Blob`.
exports.copyToArrayBufferInTargetRealm = (arrayBuffer, newRealm) => {
  const newAB = new newRealm.ArrayBuffer(arrayBuffer.byteLength);
  const view = new newRealm.Uint8Array(newAB);
  view.set(new newRealm.Uint8Array(arrayBuffer));
  return newAB;
};

// Used when we have some internal data, usually in the Node.js realm, and we need to copy it to the target realm. We
// use this when we aren't persisting the original data, e.g., `WebSocket` messages.
exports.copyToArrayBufferInTargetRealmDestructively = (arrayBuffer, newRealm) => {
  if (!newRealm.ArrayBuffer.prototype.transfer) {
    return exports.copyToArrayBufferInTargetRealm(arrayBuffer, newRealm);
  }

  return newRealm.ArrayBuffer.prototype.transfer.call(arrayBuffer);
};
