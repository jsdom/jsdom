"use strict";

const ReadableStream = require("../../../generated/idl/ReadableStream");
const {
  newPromiseCapability,
  isReadableStreamLocked,
  readableStreamReaderGenericInitialize,
  readableStreamReaderGenericCancel,
  readableStreamBYOBReaderRelease,
  readableStreamBYOBReaderRead,
  READER
} = require("./internals");

function isViewByteLengthZero(view) {
  return view.byteLength === 0;
}

function isBufferDetached(buffer) {
  return typeof buffer.detached === "boolean" ? buffer.detached : buffer.byteLength === 0;
}

exports.implementation = class ReadableStreamBYOBReaderImpl {
  constructor(globalObject, [streamWrapper]) {
    this._globalObject = globalObject;
    this._readerType = READER.BYOB;
    this._readIntoRequests = [];
    this._readRequests = []; // unused, but harmless

    const streamImpl = ReadableStream.convert(globalObject, streamWrapper);
    if (streamImpl._controller._pendingPullIntos === undefined) {
      throw new globalObject.TypeError("Cannot acquire a BYOB reader on a non-byte stream.");
    }
    if (isReadableStreamLocked(streamImpl)) {
      throw new globalObject.TypeError("Stream is already locked to a reader.");
    }
    readableStreamReaderGenericInitialize(this, streamImpl, globalObject);
  }

  get closed() {
    return this._closedPromise.promise;
  }

  cancel(reason) {
    if (this._stream === undefined) {
      return this._globalObject.Promise.reject(
        new this._globalObject.TypeError("Reader is no longer associated with a stream.")
      );
    }
    return readableStreamReaderGenericCancel(this, reason);
  }

  read(view, options) {
    const globalObject = this._globalObject;
    if (isViewByteLengthZero(view)) {
      return globalObject.Promise.reject(new globalObject.TypeError("view.byteLength must not be 0."));
    }
    if (view.buffer.byteLength === 0) {
      return globalObject.Promise.reject(new globalObject.TypeError("view.buffer.byteLength must not be 0."));
    }
    if (isBufferDetached(view.buffer)) {
      return globalObject.Promise.reject(new globalObject.TypeError("view's buffer has been detached."));
    }
    const min = options && options.min !== undefined ? Number(options.min) : 1;
    if (min === 0) {
      return globalObject.Promise.reject(new globalObject.TypeError("options.min must not be 0."));
    }
    if (!Number.isInteger(min) || min < 1) {
      return globalObject.Promise.reject(new globalObject.TypeError("options.min must be a positive integer."));
    }
    if (view.constructor !== DataView) {
      const elementCount = view.byteLength / view.BYTES_PER_ELEMENT;
      if (min > elementCount) {
        return globalObject.Promise.reject(new globalObject.RangeError("options.min exceeds view element count."));
      }
    } else if (min > view.byteLength) {
      return globalObject.Promise.reject(new globalObject.RangeError("options.min exceeds view byte length."));
    }
    if (this._stream === undefined) {
      return globalObject.Promise.reject(new globalObject.TypeError("Reader is no longer associated with a stream."));
    }
    const capability = newPromiseCapability(globalObject);
    const readIntoRequest = {
      chunkSteps: chunk => capability.resolve({ value: chunk, done: false }),
      closeSteps: chunk => capability.resolve({ value: chunk, done: true }),
      errorSteps: e => capability.reject(e)
    };
    readableStreamBYOBReaderRead(this, view, min, readIntoRequest);
    return capability.promise;
  }

  releaseLock() {
    if (this._stream === undefined) {
      return;
    }
    readableStreamBYOBReaderRelease(this);
  }
};
