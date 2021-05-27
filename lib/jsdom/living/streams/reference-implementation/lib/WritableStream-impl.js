'use strict';

const { promiseRejectedWith } = require('./helpers/webidl.js');
const { ExtractHighWaterMark, ExtractSizeAlgorithm } = require('./abstract-ops/queuing-strategy.js');
const aos = require('./abstract-ops/writable-streams.js');

const UnderlyingSink = require('../../../generated/UnderlyingSink.js');

exports.implementation = class WritableStreamImpl {
  constructor(globalObject, [underlyingSink, strategy]) {
    this._globalObject = globalObject;
    if (underlyingSink === undefined) {
      underlyingSink = null;
    }
    const underlyingSinkDict = UnderlyingSink.convert(underlyingSink);
    if ('type' in underlyingSinkDict) {
      throw new RangeError('Invalid type is specified');
    }

    aos.InitializeWritableStream(this);

    const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
    const highWaterMark = ExtractHighWaterMark(strategy, 1);

    aos.SetUpWritableStreamDefaultControllerFromUnderlyingSink(
      this._globalObject, this, underlyingSink, underlyingSinkDict, highWaterMark, sizeAlgorithm
    );
  }

  get locked() {
    return aos.IsWritableStreamLocked(this);
  }

  abort(reason) {
    if (aos.IsWritableStreamLocked(this) === true) {
      return promiseRejectedWith(new TypeError('Cannot abort a stream that already has a writer'));
    }

    return aos.WritableStreamAbort(this, reason);
  }

  close() {
    if (aos.IsWritableStreamLocked(this) === true) {
      return promiseRejectedWith(new TypeError('Cannot close a stream that already has a writer'));
    }

    if (aos.WritableStreamCloseQueuedOrInFlight(this) === true) {
      return promiseRejectedWith(new TypeError('Cannot close an already-closing stream'));
    }

    return aos.WritableStreamClose(this);
  }

  getWriter() {
    return aos.AcquireWritableStreamDefaultWriter(this._globalObject, this);
  }
};
