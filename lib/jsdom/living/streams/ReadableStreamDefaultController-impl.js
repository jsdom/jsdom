"use strict";

const { QueueWithSize } = require("./helpers");

function isNonNegativeNumber(value) {
  // TODO should Number objects be allowed?
  return typeof value === "number" && value >= 0;
}

class ReadableStreamDefaultControllerImpl {
  constructor(_globalObject, _constructorArgs, privateData) {
    const { stream, pull, cancel, highWaterMark, size } = privateData;
    this._stream = stream;
    this._queue = new QueueWithSize();
    this._started = false;
    this._closeRequested = false;
    this._pullAgain = false;
    this._pulling = false;
    this._algorithms = { pull, cancel, size };
    this._highWaterMark = highWaterMark;
  }

  _start(startAlgorithm) {
    // This method is sync because the spec requires that sync errors thrown in
    // startAlgorthim be thrown, while rejected promises returned from
    // startAlgorithm result in an errored stream.
    Promise.resolve(startAlgorithm(this)).then(() => {
      this._started = true;
      this._callPullIfNeeded();
    }).catch(reason => {
      this.error(reason);
    });
  }

  get desiredSize() {
    if (this._stream._state === "errored") {
      return null;
    }

    if (this._stream._state === "closed") {
      return 0;
    }

    return this._highWaterMark - this._queue.size;
  }

  close() {
    if (!this._canCloseOrEnqueue()) {
      throw new TypeError("TODO error message");
    }

    this._closeRequested = true;

    if (this._queue.length === 0) {
      delete this._algorithms;
      this._stream._close();
    }
  }

  enqueue(chunk) {
    if (!this._canCloseOrEnqueue()) {
      throw new TypeError("TODO error message");
    }

    if (this._stream.locked && this._stream._reader._readRequests.length > 0) {
      this._stream._fulfillReadRequest(chunk, false);
    } else {
      try {
        const size = this._algorithms.size(chunk);

        if (!isNonNegativeNumber(size) || size === Infinity) {
          throw new RangeError("TODO error message");
        }

        this._queue.enqueue(chunk, size);
      } catch (error) {
        this.error(error);
        throw error;
      }
    }

    this._callPullIfNeeded();
  }

  error(error) {
    if (this._stream._state !== "readable") {
      return;
    }

    this._queue = new QueueWithSize();
    delete this._algorithms;

    this._stream._error(error);
  }

  _callPullIfNeeded() {
    if (!this._shouldCallPull()) {
      return;
    }

    if (this._pulling) {
      this._pullAgain = true;
      return;
    }

    this._pulling = true;

    this._algorithms.pull(this).then(() => {
      this._pulling = false;
      if (this._pullAgain) {
        this._pullAgain = false;
        this._callPullIfNeeded();
      }
    }).catch(this.error);
  }

  _shouldCallPull() {
    if (!this._canCloseOrEnqueue()) {
      return false;
    }

    if (!this._started) {
      return false;
    }

    if (this._stream.locked && this._stream._reader._readRequests.length > 0) {
      return true;
    }

    return this.desiredSize > 0;
  }

  _canCloseOrEnqueue() {
    return !this._closeRequested && this._stream._state === "readable";
  }

  // This diverges from the spec a fair bit. Where the spec passes in a
  // readRequest containing "steps" to perform when the underlying _pull()
  // completes, here we instead return a promise representing the result of the
  // underlying _pull(), and leave it to the caller to attach their handlers.
  _pull() {
    if (this._queue.length > 0) {
      const value = this._queue.dequeue();

      if (this._closeRequested && this._queue.length === 0) {
        delete this._algorithms;
        this._stream._close();
      } else {
        this._callPullIfNeeded();
      }

      return Promise.resolve({ value, done: false });
    }

    const promise = this._stream._addReadRequest();
    this._callPullIfNeeded();
    return promise;
  }

  _cancel(reason) {
    this._queue = new QueueWithSize();
    const result = this._algorithms.cancel(reason);
    delete this._algorithms;
    return result;
  }
}

exports.implementation = ReadableStreamDefaultControllerImpl;
