"use strict";

const sizeFns = new WeakMap();

class ByteLengthQueuingStrategy {
  constructor(globalObject, [{ highWaterMark }]) {
    this._highWaterMark = highWaterMark;

    if (!sizeFns.has(globalObject)) {
      // eslint-disable-next-line prefer-arrow-callback
      sizeFns.set(globalObject, function size(chunk) {
        return chunk.byteLength;
      });
    }
    this._size = sizeFns.get(globalObject);
  }

  get highWaterMark() {
    return this._highWaterMark;
  }

  get size() {
    return this._size;
  }
}

exports.implementation = ByteLengthQueuingStrategy;
