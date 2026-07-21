"use strict";

const {
  readableStreamDefaultControllerCanCloseOrEnqueue,
  readableStreamDefaultControllerGetDesiredSize,
  readableStreamDefaultControllerClose,
  readableStreamDefaultControllerEnqueue,
  readableStreamDefaultControllerError
} = require("./internals");

exports.implementation = class ReadableStreamDefaultControllerImpl {
  constructor(globalObject) {
    this._globalObject = globalObject;
  }

  get desiredSize() {
    return readableStreamDefaultControllerGetDesiredSize(this);
  }

  close() {
    if (!readableStreamDefaultControllerCanCloseOrEnqueue(this)) {
      throw new this._globalObject.TypeError("Cannot close stream in current state.");
    }
    readableStreamDefaultControllerClose(this);
  }

  enqueue(chunk) {
    if (!readableStreamDefaultControllerCanCloseOrEnqueue(this)) {
      throw new this._globalObject.TypeError("Cannot enqueue to stream in current state.");
    }
    readableStreamDefaultControllerEnqueue(this, chunk);
  }

  error(e) {
    readableStreamDefaultControllerError(this, e);
  }
};
