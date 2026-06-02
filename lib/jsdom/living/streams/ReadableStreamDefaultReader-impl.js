"use strict";

const ReadableStream = require("../../../generated/idl/ReadableStream");
const {
  newPromiseCapability,
  isReadableStreamLocked,
  readableStreamReaderGenericInitialize,
  readableStreamReaderGenericCancel,
  readableStreamDefaultReaderRelease,
  readableStreamDefaultReaderRead,
  READER
} = require("./internals");

exports.implementation = class ReadableStreamDefaultReaderImpl {
  constructor(globalObject, [streamWrapper]) {
    this._globalObject = globalObject;
    this._readerType = READER.DEFAULT;
    this._readRequests = [];
    this._readIntoRequests = []; // unused, but harmless

    const streamImpl = ReadableStream.convert(globalObject, streamWrapper);
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

  read() {
    if (this._stream === undefined) {
      return this._globalObject.Promise.reject(
        new this._globalObject.TypeError("Reader is no longer associated with a stream.")
      );
    }
    const capability = newPromiseCapability(this._globalObject);
    const readRequest = {
      chunkSteps: chunk => capability.resolve({ value: chunk, done: false }),
      closeSteps: () => capability.resolve({ value: undefined, done: true }),
      errorSteps: e => capability.reject(e)
    };
    readableStreamDefaultReaderRead(this, readRequest);
    return capability.promise;
  }

  releaseLock() {
    if (this._stream === undefined) {
      return;
    }
    readableStreamDefaultReaderRelease(this);
  }
};
