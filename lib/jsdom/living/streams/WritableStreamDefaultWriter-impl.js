"use strict";
const assert = require("assert");

const { promiseRejectedWith } = require("./helpers/webidl.js");
const aos = require("./abstract-ops/writable-streams.js");

exports.implementation = class WritableStreamDefaultWriterImpl {
  constructor(globalObject, [stream]) {
    aos.setUpWritableStreamDefaultWriter(this, stream);
  }

  get closed() {
    return this._closedPromise;
  }

  get desiredSize() {
    if (this._stream === undefined) {
      throw defaultWriterLockException("desiredSize");
    }

    return aos.writableStreamDefaultWriterGetDesiredSize(this);
  }

  get ready() {
    return this._readyPromise;
  }

  abort(reason) {
    if (this._stream === undefined) {
      return promiseRejectedWith(defaultWriterLockException("abort"));
    }

    return aos.writableStreamDefaultWriterAbort(this, reason);
  }

  close() {
    const stream = this._stream;

    if (stream === undefined) {
      return promiseRejectedWith(defaultWriterLockException("close"));
    }

    if (aos.writableStreamCloseQueuedOrInFlight(stream) === true) {
      return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
    }

    return aos.writableStreamDefaultWriterClose(this);
  }

  releaseLock() {
    const stream = this._stream;

    if (stream === undefined) {
      return;
    }

    assert(stream._writer !== undefined);

    aos.writableStreamDefaultWriterRelease(this);
  }

  write(chunk) {
    if (this._stream === undefined) {
      return promiseRejectedWith(defaultWriterLockException("write to"));
    }

    return aos.writableStreamDefaultWriterWrite(this, chunk);
  }
};

function defaultWriterLockException(name) {
  return new TypeError("Cannot " + name + " a stream using a released writer");
}
