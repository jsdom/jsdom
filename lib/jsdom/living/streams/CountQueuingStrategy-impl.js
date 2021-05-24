"use strict";

const sizeFns = new WeakMap();

class CountQueuingStrategy {
  constructor(globalObject, [{ highWaterMark }]) {
    this._highWaterMark = highWaterMark;
    if (!sizeFns.has(globalObject)) {
      sizeFns.set(globalObject, function size() {
        return 1;
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

exports.implementation = CountQueuingStrategy;
