"use strict";

const idlUtils = require("../../../generated/idl/utils");
const ReadableStreamDefaultReader = require("../../../generated/idl/ReadableStreamDefaultReader");
const ReadableStreamBYOBReader = require("../../../generated/idl/ReadableStreamBYOBReader");
const {
  initializeReadableStream,
  isReadableStreamLocked,
  readableStreamCancel,
  extractHighWaterMark,
  extractSizeAlgorithm,
  convertUnderlyingDefaultOrByteSource,
  setUpReadableStreamDefaultControllerFromUnderlyingSource,
  setUpReadableByteStreamControllerFromUnderlyingSource,
  readableStreamTee
} = require("./internals");

exports.implementation = class ReadableStreamImpl {
  constructor(globalObject, [underlyingSource, strategy]) {
    this._globalObject = globalObject;
    initializeReadableStream(this);

    const underlyingSourceDict = convertUnderlyingDefaultOrByteSource(underlyingSource);
    const strat = strategy || {};

    if (underlyingSourceDict.type === "bytes") {
      if (strat.size !== undefined) {
        throw new RangeError("byte streams must not have a size function.");
      }
      const highWaterMark = extractHighWaterMark(strat, 0);
      setUpReadableByteStreamControllerFromUnderlyingSource(
        this,
        underlyingSource,
        underlyingSourceDict,
        highWaterMark,
        globalObject
      );
    } else {
      const sizeAlgorithm = extractSizeAlgorithm(strat);
      const highWaterMark = extractHighWaterMark(strat, 1);
      setUpReadableStreamDefaultControllerFromUnderlyingSource(
        this,
        underlyingSource,
        underlyingSourceDict,
        highWaterMark,
        sizeAlgorithm,
        globalObject
      );
    }
  }

  get locked() {
    return isReadableStreamLocked(this);
  }

  cancel(reason) {
    if (isReadableStreamLocked(this)) {
      return this._globalObject.Promise.reject(
        new this._globalObject.TypeError("Cannot cancel a stream that already has a reader.")
      );
    }
    return readableStreamCancel(this, reason);
  }

  getReader(options) {
    if (options && options.mode === "byob") {
      return ReadableStreamBYOBReader.createImpl(this._globalObject, [idlUtils.wrapperForImpl(this)], {});
    }
    return ReadableStreamDefaultReader.createImpl(this._globalObject, [idlUtils.wrapperForImpl(this)], {});
  }

  tee() {
    if (isReadableStreamLocked(this)) {
      throw new this._globalObject.TypeError("Cannot tee a stream that already has a reader.");
    }
    return readableStreamTee(this).map(branchImpl => idlUtils.wrapperForImpl(branchImpl));
  }
};
