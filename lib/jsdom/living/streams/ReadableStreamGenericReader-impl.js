"use strict";

const { promiseRejectedWith } = require("./helpers/webidl.js");
const aos = require("./abstract-ops/readable-streams.js");

exports.implementation = class ReadableStreamGenericReaderImpl {
  get closed() {
    return this._closedPromise;
  }

  cancel(reason) {
    if (this._stream === undefined) {
      return promiseRejectedWith(readerLockException("cancel"));
    }

    return aos.readableStreamReaderGenericCancel(this, reason);
  }
};

function readerLockException(name) {
  return new TypeError("Cannot " + name + " a stream using a released reader");
}
