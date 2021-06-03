"use strict";

class ReadableStreamGenericReaderImpl {
  get closed() {
    return this._closedPromiseCapability.promise;
  }

  cancel(reason) {
    if (this._stream === undefined) {
      return Promise.reject(new TypeError("TODO error message"));
    }

    return this._stream._cancel(reason);
  }
}

exports.implementation = ReadableStreamGenericReaderImpl;
