"use strict";

const { newPromiseCapability } = require("./helpers");
const ReadableStreamGenericReaderImpl = require("./ReadableStreamGenericReader-impl").implementation;
const { mixin } = require("../../utils");

class ReadableStreamDefaultReaderImpl {
  constructor(_globalObject, [stream]) {
    if (stream.locked) {
      throw new TypeError("TODO error message");
    }

    this._stream = stream;
    stream._reader = this;

    if (stream._state === "readable") {
      this._closedPromiseCapability = newPromiseCapability();
    } else if (stream._state === "closed") {
      this._closedPromiseCapability = { promise: Promise.resolve() };
    } else {
      this._closedPromiseCapability = { promise: Promise.reject(stream._storedError) };
      this._closedPromiseCapability.promise.catch(() => {});
    }

    this._readRequests = [];
  }

  read() {
    if (this._stream === undefined) {
      return Promise.reject(new TypeError("TODO error message"));
    }

    this._stream._disturbed = true;

    if (this._stream._state === "closed") {
      return Promise.resolve({ value: undefined, done: true });
    }

    if (this._stream._state === "errored") {
      return Promise.reject(this._stream._storedError);
    }

    return this._stream._controller._pull();
  }

  releaseLock() {
    if (this._stream === undefined) {
      return;
    }

    if (this._readRequests.length > 0) {
      throw new TypeError("TODO error message");
    }

    if (this._stream._state === "readable") {
      this._closedPromiseCapability.reject(new TypeError("TODO error message"));
    } else {
      this._closedPromiseCapability = { promise: Promise.reject(new TypeError("TODO error message")) };
    }

    this._closedPromiseCapability.promise.catch(() => {});
    this._stream._reader = undefined;
    this._stream = undefined;
  }
}

mixin(ReadableStreamDefaultReaderImpl.prototype, ReadableStreamGenericReaderImpl.prototype);

exports.implementation = ReadableStreamDefaultReaderImpl;
