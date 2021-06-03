"use strict";

const ReadableStreamDefaultController = require("../generated/ReadableStreamDefaultController");
const ReadableStreamDefaultReader = require("../generated/ReadableStreamDefaultReader");
const UnderlyingSource = require("../generated/UnderlyingSource");
const { newPromiseCapability } = require("./helpers");

function extractHighWaterMark(strategy, defaultHWM) {
  const { highWaterMark = defaultHWM } = strategy;

  if (Number.isNaN(highWaterMark) || highWaterMark < 0) {
    throw new RangeError("TODO error message");
  }

  return highWaterMark;
}

function extractSizeAlgorithm(strategy) {
  const { size = () => 1 } = strategy;

  return size;
}
class ReadableStreamImpl {
  constructor(globalObject, [underlyingSource, strategy]) {
    this._globalObject = globalObject;
    const underlyingSourceDict = UnderlyingSource.convert(underlyingSource);
    const { type } = underlyingSourceDict;
    const start = underlyingSourceDict.start ?
      underlyingSourceDict.start.bind(underlyingSource) :
      () => {};
    const pull = underlyingSourceDict.pull ?
      underlyingSourceDict.pull.bind(underlyingSource) :
      async () => {};
    const cancel = underlyingSourceDict.cancel ?
      underlyingSourceDict.cancel.bind(underlyingSource) :
      async () => {};

    this._state = "readable";
    this._disturbed = false;

    if (type === "bytes") {
      if (strategy.size !== undefined) {
        throw new RangeError("TODO error message");
      }

      throw new RangeError("support for readable byte streams is not yet implemented");
    } else {
      const size = extractSizeAlgorithm(strategy);
      const highWaterMark = extractHighWaterMark(strategy, 1);

      this._controller = ReadableStreamDefaultController.createImpl(globalObject, [], {
        stream: this,
        pull,
        cancel,
        highWaterMark,
        size
      });
      this._controller._start(start);
    }
  }

  get locked() {
    return this._reader !== undefined;
  }

  cancel(reason) {
    if (this.locked) {
      throw new TypeError("TODO error message");
    }

    return this._cancel(reason);
  }

  async _cancel(reason) {
    this._disturbed = true;

    if (this._state === "closed") {
      return;
    }

    if (this._state === "errored") {
      throw this._storedError;
    }

    this._close();

    await this._controller._cancel(reason);
  }

  _close() {
    this._state = "closed";

    if (this._reader === undefined) {
      return;
    }

    this._reader._closedPromiseCapability.resolve(undefined);

    if (ReadableStreamDefaultReader.isImpl(this._reader)) {
      for (const promiseCapability of this._reader._readRequests) {
        promiseCapability.resolve({ value: undefined, done: true });
      }

      this._reader._readRequests = [];
    }
  }

  getReader(options) {
    if (options.mode === undefined) {
      return ReadableStreamDefaultReader.createImpl(this._globalObject, [this]);
    }

    // mode is "byob"
    throw new TypeError("cannot get a BYOB reader for a non-byte stream");
  }

  _addReadRequest() {
    const promiseCapability = newPromiseCapability();
    this._reader._readRequests.push(promiseCapability);
    return promiseCapability.promise;
  }

  _error(error) {
    this._state = "errored";
    this._storedError = error;

    if (this._reader === undefined) {
      return;
    }

    this._reader._closedPromiseCapability.reject(error);
    this._reader._closedPromiseCapability.promise.catch(() => {});

    if (ReadableStreamDefaultReader.isImpl(this._reader)) {
      for (const promiseCapability of this._reader._readRequests) {
        promiseCapability.reject(error);
      }
      this._reader._readRequests = [];
    } else {
      throw new Error("unimplemented");
    }
  }

  _fulfillReadRequest(value, done) {
    const promiseCapability = this._reader._readRequests.shift();
    promiseCapability.resolve({ done, value });
  }
}

exports.implementation = ReadableStreamImpl;
