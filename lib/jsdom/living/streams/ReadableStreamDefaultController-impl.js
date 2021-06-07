"use strict";

const { CancelSteps, PullSteps } = require("./abstract-ops/internal-methods.js");
const { DequeueValue, ResetQueue } = require("./abstract-ops/queue-with-sizes.js");
const aos = require("./abstract-ops/readable-streams.js");

exports.implementation = class ReadableStreamDefaultControllerImpl {
  get desiredSize() {
    return aos.ReadableStreamDefaultControllerGetDesiredSize(this);
  }

  close() {
    if (aos.ReadableStreamDefaultControllerCanCloseOrEnqueue(this) === false) {
      throw new TypeError("The stream is not in a state that permits close");
    }

    aos.ReadableStreamDefaultControllerClose(this);
  }

  enqueue(chunk) {
    if (aos.ReadableStreamDefaultControllerCanCloseOrEnqueue(this) === false) {
      throw new TypeError("The stream is not in a state that permits enqueue");
    }

    return aos.ReadableStreamDefaultControllerEnqueue(this, chunk);
  }

  error(e) {
    aos.ReadableStreamDefaultControllerError(this, e);
  }

  [CancelSteps](reason) {
    ResetQueue(this);
    const result = this._cancelAlgorithm(reason);
    aos.ReadableStreamDefaultControllerClearAlgorithms(this);
    return result;
  }

  [PullSteps](readRequest) {
    const stream = this._stream;

    if (this._queue.length > 0) {
      const chunk = DequeueValue(this);

      if (this._closeRequested === true && this._queue.length === 0) {
        aos.ReadableStreamDefaultControllerClearAlgorithms(this);
        aos.ReadableStreamClose(stream);
      } else {
        aos.ReadableStreamDefaultControllerCallPullIfNeeded(this);
      }

      readRequest.chunkSteps(chunk);
    } else {
      aos.ReadableStreamAddReadRequest(stream, readRequest);
      aos.ReadableStreamDefaultControllerCallPullIfNeeded(this);
    }
  }
};
