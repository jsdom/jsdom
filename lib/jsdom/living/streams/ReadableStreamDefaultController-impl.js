"use strict";

function isNonNegativeNumber(value) {
  // TODO should Number objects be allowed?
  return typeof value === "number" && value >= 0;
}

class ReadableStreamDefaultControllerImpl {
  constructor(_globalObject, _constructorArgs, privateData) {
    const { stream, pull, cancel, highWaterMark, size } = privateData;
    this._stream = stream;
    this._resetQueue();
    this._started = false;
    this._closeRequested = false;
    this._pullAgain = false;
    this._pulling = false;
    this._size = size;
    this._highWaterMark = highWaterMark;
    this._pull = pull;
    this._cancel = cancel;
    // Creator has to do start() themselves
  }

  get desiredSize() {
    const state = this._stream._state;
    if (state === "errored") {
      return null;
    }

    if (state === "closed") {
      return 0;
    }

    return this._highWaterMark - this._queueTotalSize;
  }

  close() {
    if (!this._canCloseOrEnqueue()) {
      throw new TypeError("TODO error message");
    }

    this._close();
  }

  _close() {
    if (!this._canCloseOrEnqueue()) {
      return;
    }

    this._closeRequested = true;

    if (this._queue.length === 0) {
      this._clearAlgorithms();
      this._stream._close();
    }
  }

  enqueue(chunk) {
    if (!this._canCloseOrEnqueue()) {
      throw new TypeError("TODO error message");
    }

    this._enqueue(chunk);
  }

  _enqueue(chunk) {
    if (!this._canCloseOrEnqueue()) {
      return;
    }

    if (this._stream.locked && this._stream._reader._readRequests.length > 0) {
      this._stream._fulfillReadRequest(chunk, false);
    } else {
      try {
        const size = this._size(chunk);
        this._enqueueValueWithSize(chunk, size);
      } catch (error) {
        this.error(error);
        throw error;
      }
    }

    this._callPullIfNeeded();
  }

  _enqueueValueWithSize(value, size) {
    if (!isNonNegativeNumber(size) || size === Infinity) {
      throw new RangeError("TODO error message");
    }

    this._queue.push({ value, size });
    this._queueTotalSize += size;
  }

  error(error) {
    if (this._stream._state !== "readable") {
      return;
    }

    this._resetQueue();
    this._clearAlgorithms();

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

    this._pull().then(() => {
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

  _resetQueue() {
    this._queueTotalSize = 0;
    this._queue = [];
  }

  // This diverges from the spec a fair bit. Where the spec passes in a
  // readRequest containing "steps" to perform when the underlying _pull()
  // completes, here we instead return a promise representing the result of the
  // underlying _pull(), and leave it to the caller to attach their handlers.
  _pullSteps() {
    if (this._queue.length > 0) {
      const { value, size } = this._queue.shift();
      this._queueTotalSize -= size;
      if (this._queueTotalSize < 0) {
        this._queueTotalSize = 0;
      }

      if (this._closeRequested && this._queue.length === 0) {
        this._clearAlgorithms();
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

  _cancelSteps(reason) {
    this._resetQueue();
    const result = this._cancel(reason);
    this._clearAlgorithms();
    return result;
  }

  _clearAlgorithms() {
    this._pull = undefined;
    this._cancel = undefined;
    this._size = undefined;
  }
}

exports.implementation = ReadableStreamDefaultControllerImpl;
