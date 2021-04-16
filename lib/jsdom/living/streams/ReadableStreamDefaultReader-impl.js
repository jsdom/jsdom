"use strict";

const { newPromiseCapability } = require("./helpers");
const ReadableStreamGenericReaderImpl = require("./ReadableStreamGenericReader-impl").implementation;
const { mixin } = require("../../utils");

class ReadableStreamDefaultReaderImpl {
  constructor(_globalObject, [stream], _privateData) {
    if (stream.locked) {
      throw new TypeError("TODO error message");
    }

    this._stream = stream;
    stream._reader = this;

    if (stream._state === "readable") {
      this._closedPromise = newPromiseCapability();
    } else if (stream._state === "closed") {
      // TODO is _closedPromise a promise capability or a promise?? how is it used?
      this._closedPromise = { promise: Promise.resolve() };
    } else {
      this._closedPromise = { promise: Promise.reject(stream._storedError) };
      this._closedPromise.promise.catch(() => {});
    }

    this._readRequests = [];
  }

  async read() {
    if (this._stream === undefined) {
      throw new TypeError("TODO error message");
    }

    this._stream._disturbed = true;

    if (this._stream._state === "closed") {
      return { value: undefined, done: true };
    }

    if (this._stream._state === "errored") {
      throw this._stream._storedError;
    }

    return this._stream._controller._pullSteps();
  }

  releaseLock() {
    if (this._stream === undefined) {
      return;
    }

    if (this._readRequests.length > 0) {
      throw new TypeError("TODO error message");
    }

    if (this._stream._state === "readable") {
      this._closedPromise.reject(new TypeError("TODO error message"));
    } else {
      this._closedPromise = { promise: Promise.reject(new TypeError("TODO error message")) };
    }

    this._closedPromise.promise.catch(() => {});
    this._stream._reader = undefined;
    this._stream = undefined;
  }
}

mixin(ReadableStreamDefaultReaderImpl.prototype, ReadableStreamGenericReaderImpl.prototype);

exports.implementation = ReadableStreamDefaultReaderImpl;
