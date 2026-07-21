"use strict";

const {
  readableByteStreamControllerCanCloseOrEnqueue,
  readableByteStreamControllerGetDesiredSize,
  readableByteStreamControllerClose,
  readableByteStreamControllerEnqueue,
  readableByteStreamControllerError,
  readableByteStreamControllerGetBYOBRequest
} = require("./internals");

function isViewByteLengthZero(view) {
  return view.byteLength === 0;
}

function isBufferDetached(buffer) {
  return typeof buffer.detached === "boolean" ? buffer.detached : buffer.byteLength === 0;
}

exports.implementation = class ReadableByteStreamControllerImpl {
  constructor(globalObject) {
    this._globalObject = globalObject;
  }

  get byobRequest() {
    return readableByteStreamControllerGetBYOBRequest(this);
  }

  get desiredSize() {
    return readableByteStreamControllerGetDesiredSize(this);
  }

  close() {
    if (this._closeRequested) {
      throw new this._globalObject.TypeError("close has already been requested.");
    }
    if (this._stream._state !== "readable") {
      throw new this._globalObject.TypeError("Stream is not readable.");
    }
    readableByteStreamControllerClose(this);
  }

  enqueue(chunk) {
    if (isViewByteLengthZero(chunk)) {
      throw new this._globalObject.TypeError("chunk.byteLength must not be 0.");
    }
    if (chunk.buffer.byteLength === 0) {
      throw new this._globalObject.TypeError("chunk.buffer.byteLength must not be 0.");
    }
    if (isBufferDetached(chunk.buffer)) {
      throw new this._globalObject.TypeError("chunk's buffer has been detached.");
    }
    if (!readableByteStreamControllerCanCloseOrEnqueue(this)) {
      throw new this._globalObject.TypeError("Cannot enqueue to stream in current state.");
    }
    readableByteStreamControllerEnqueue(this, chunk);
  }

  error(e) {
    readableByteStreamControllerError(this, e);
  }
};
