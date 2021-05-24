"use strict";

class CountQueuingStrategy {
  constructor(_globalObject, [{ highWaterMark }]) {
    this._highWaterMark = highWaterMark;
  }

  get highWaterMark() {
    return this._highWaterMark;
  }

  size() {
    return 1;
  }
}

exports.implementation = CountQueuingStrategy;
