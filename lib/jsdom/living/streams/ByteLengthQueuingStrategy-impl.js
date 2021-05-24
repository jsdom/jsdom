"use strict";

class ByteLengthQueuingStrategy {
  constructor(_globalObject, [{ highWaterMark }]) {
    this._highWaterMark = highWaterMark;
  }

  get highWaterMark() {
    return this._highWaterMark;
  }

  size(chunk) {
    return chunk.byteLength;
  }
}

exports.implementation = ByteLengthQueuingStrategy;
