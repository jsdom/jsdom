"use strict";

const ReadableStreamDefaultController = require("../generated/ReadableStreamDefaultController");
const ReadableStreamDefaultReader = require("../generated/ReadableStreamDefaultReader");
const UnderlyingSource = require("../generated/UnderlyingSource");
const { newPromiseCapability } = require("./helpers");

function todo(task = "not implemented") {
  throw new Error(`TODO: ${task}`);
}

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
  constructor(globalObject, [underlyingSource, strategy], _privateData) {
    this._globalObject = globalObject;
    const underlyingSourceDict = UnderlyingSource.convert(underlyingSource);
    const { type, autoAllocateChunkSize } = underlyingSourceDict;
    const start = underlyingSourceDict.start ?
      underlyingSourceDict.start.bind(underlyingSource) :
      () => {};
    const pull = underlyingSourceDict.pull ?
      underlyingSourceDict.pull.bind(underlyingSource) :
      async () => {};
    const cancel = underlyingSourceDict.cancel ?
      underlyingSourceDict.cancel.bind(underlyingSource) :
      async () => {};

    // ! InitializeReadableStream(this)
    this._state = "readable";
    this._disturbed = false;

    if (type === "bytes") {
      const highWaterMark = extractHighWaterMark(strategy, 0);

      if (strategy.size !== undefined) {
        throw new RangeError("TODO error message");
      }

      // Perform ? SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, underlyingSourceDict, highWaterMark).
      todo();
    } else {
      const highWaterMark = extractHighWaterMark(strategy, 1);
      const size = extractSizeAlgorithm(strategy);

      // Perform ? SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, underlyingSourceDict, highWaterMark, sizeAlgorithm).
      this._controller = ReadableStreamDefaultController.createImpl(globalObject, [], {
        stream: this,
        pull,
        cancel,
        highWaterMark,
        size
      });

      Promise.resolve(start(this._controller)).then(() => {
        this._started = true;
      }).catch(this.error);
    }
  }

  get locked() {
    return this._reader !== undefined;
  }

  async cancel(reason) {
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

    await this._controller._cancelSteps(reason);
  }

  _close() {
    this._state = "closed";

    if (this._reader === undefined) {
      return;
    }

    this._reader._closedPromise.resolve(undefined);

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

    return todo();
  }

  tee() {

  }

  async* [Symbol.asyncIterable](options) {

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

    this._reader._closedPromise.reject(error);
    this._reader._closedPromise.promise.catch(() => {});

    if (ReadableStreamDefaultReader.isImpl(this._reader)) {
      for (const promiseCapability of this._reader._readRequests) {
        promiseCapability.reject(error);
      }
      this._reader._readRequests = [];
    } else {
      todo();
    }
  }

  _fulfillReadRequest(value, done) {
    const promiseCapability = this._reader._readRequests.shift();
    promiseCapability.resolve({ done, value });
  }
}

exports.implementation = ReadableStreamImpl;
