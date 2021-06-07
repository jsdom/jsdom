"use strict";
const assert = require("assert");
const verbose = require("debug")("streams:writable-stream:verbose");

const { promiseResolvedWith, promiseRejectedWith, newPromise, resolvePromise, rejectPromise, uponPromise,
  setPromiseIsHandledToTrue, stateIsPending } = require("../helpers/webidl.js");
const { isNonNegativeNumber } = require("./miscellaneous.js");
const { dequeueValue, enqueueValueWithSize, peekQueueValue, resetQueue } = require("./queue-with-sizes.js");
const { AbortSteps, ErrorSteps } = require("./internal-methods.js");

const WritableStream = require("../../generated/WritableStream.js");
const WritableStreamDefaultController = require("../../generated/WritableStreamDefaultController.js");
const WritableStreamDefaultWriter = require("../../generated/WritableStreamDefaultWriter.js");

const closeSentinel = Symbol("close sentinel");

Object.assign(exports, {
  acquireWritableStreamDefaultWriter,
  createWritableStream,
  initializeWritableStream,
  isWritableStreamLocked,
  setUpWritableStreamDefaultControllerFromUnderlyingSink,
  setUpWritableStreamDefaultWriter,
  writableStreamAbort,
  writableStreamClose,
  writableStreamCloseQueuedOrInFlight,
  writableStreamDefaultControllerClearAlgorithms,
  writableStreamDefaultControllerError,
  writableStreamDefaultControllerErrorIfNeeded,
  writableStreamDefaultWriterAbort,
  writableStreamDefaultWriterClose,
  writableStreamDefaultWriterCloseWithErrorPropagation,
  writableStreamDefaultWriterGetDesiredSize,
  writableStreamDefaultWriterRelease,
  writableStreamDefaultWriterWrite
});

// Working with writable streams

function acquireWritableStreamDefaultWriter(globalObject, stream) {
  const writer = WritableStreamDefaultWriter.new(globalObject);
  setUpWritableStreamDefaultWriter(writer, stream);
  return writer;
}

function createWritableStream(
  globalObject,
  startAlgorithm,
  writeAlgorithm,
  closeAlgorithm,
  abortAlgorithm,
  highWaterMark = 1,
  sizeAlgorithm = () => 1
) {
  assert(isNonNegativeNumber(highWaterMark) === true);

  const stream = WritableStream.new(globalObject);
  initializeWritableStream(globalObject, stream);

  const controller = WritableStreamDefaultController.new(globalObject);

  setUpWritableStreamDefaultController(
    stream,
    controller,
    startAlgorithm,
    writeAlgorithm,
    closeAlgorithm,
    abortAlgorithm,
    highWaterMark,
    sizeAlgorithm
  );
  return stream;
}

function initializeWritableStream(globalObject, stream) {
  stream._globalObject = globalObject;
  stream._state = "writable";

  // The error that will be reported by new method calls once the state becomes errored. Only set when [[state]] is
  // 'erroring' or 'errored'. May be set to an undefined value.
  stream._storedError = undefined;

  stream._writer = undefined;

  // Initialize to undefined first because the constructor of the controller checks this
  // variable to validate the caller.
  stream._controller = undefined;

  // Write requests are removed from _writeRequests when write() is called on the underlying sink. This prevents
  // them from being erroneously rejected on error. If a write() call is in-flight, the request is stored here.
  stream._inFlightWriteRequest = undefined;

  // The promise that was returned from writer.close(). Stored here because it may be fulfilled after the writer
  // has been detached.
  stream._closeRequest = undefined;

  // Close request is removed from _closeRequest when close() is called on the underlying sink. This prevents it
  // from being erroneously rejected on error. If a close() call is in-flight, the request is stored here.
  stream._inFlightCloseRequest = undefined;

  // The promise that was returned from writer.abort(). This may also be fulfilled after the writer has detached.
  stream._pendingAbortRequest = undefined;

  // This queue is placed here instead of the writer class in order to allow for passing a writer to the next data
  // producer without waiting for the queued writes to finish.
  stream._writeRequests = [];

  // The backpressure signal set by the controller.
  stream._backpressure = false;
}

function isWritableStreamLocked(stream) {
  assert(WritableStream.isImpl(stream));

  if (stream._writer === undefined) {
    return false;
  }

  return true;
}

function writableStreamAbort(stream, reason) {
  const state = stream._state;
  if (state === "closed" || state === "errored") {
    return promiseResolvedWith(undefined);
  }
  if (stream._pendingAbortRequest !== undefined) {
    return stream._pendingAbortRequest.promise;
  }

  assert(state === "writable" || state === "erroring");

  let wasAlreadyErroring = false;
  if (state === "erroring") {
    wasAlreadyErroring = true;
    // reason will not be used, so don't keep a reference to it.
    reason = undefined;
  }

  const promise = newPromise();
  stream._pendingAbortRequest = { promise, reason, wasAlreadyErroring };

  if (wasAlreadyErroring === false) {
    writableStreamStartErroring(stream, reason);
  }

  return promise;
}

function setUpWritableStreamDefaultWriter(writer, stream) {
  if (isWritableStreamLocked(stream) === true) {
    throw new TypeError("This stream has already been locked for exclusive writing by another writer");
  }

  writer._stream = stream;
  stream._writer = writer;

  const state = stream._state;

  if (state === "writable") {
    if (writableStreamCloseQueuedOrInFlight(stream) === false && stream._backpressure === true) {
      writer._readyPromise = newPromise();
    } else {
      writer._readyPromise = promiseResolvedWith(undefined);
    }

    writer._closedPromise = newPromise();
  } else if (state === "erroring") {
    writer._readyPromise = promiseRejectedWith(stream._storedError);
    setPromiseIsHandledToTrue(writer._readyPromise);
    writer._closedPromise = newPromise();
  } else if (state === "closed") {
    writer._readyPromise = promiseResolvedWith(undefined);
    writer._closedPromise = promiseResolvedWith(undefined);
  } else {
    assert(state === "errored");

    const storedError = stream._storedError;
    writer._readyPromise = promiseRejectedWith(storedError);
    setPromiseIsHandledToTrue(writer._readyPromise);
    writer._closedPromise = promiseRejectedWith(storedError);
    setPromiseIsHandledToTrue(writer._closedPromise);
  }
}

function writableStreamClose(stream) {
  const state = stream._state;
  if (state === "closed" || state === "errored") {
    return promiseRejectedWith(new TypeError(
      `The stream (in ${state} state) is not in the writable state and cannot be closed`
    ));
  }

  assert(state === "writable" || state === "erroring");
  assert(writableStreamCloseQueuedOrInFlight(stream) === false);

  const promise = newPromise();
  stream._closeRequest = promise;

  const writer = stream._writer;
  if (writer !== undefined && stream._backpressure === true && state === "writable") {
    resolvePromise(writer._readyPromise, undefined);
  }

  writableStreamDefaultControllerClose(stream._controller);

  return promise;
}

// Interfacing with controllers

function writableStreamAddWriteRequest(stream) {
  assert(isWritableStreamLocked(stream) === true);
  assert(stream._state === "writable");

  const promise = newPromise();
  stream._writeRequests.push(promise);
  return promise;
}

function writableStreamCloseQueuedOrInFlight(stream) {
  if (stream._closeRequest === undefined && stream._inFlightCloseRequest === undefined) {
    return false;
  }

  return true;
}

function writableStreamDealWithRejection(stream, error) {
  verbose("writableStreamDealWithRejection(stream, %o)", error);
  const state = stream._state;

  if (state === "writable") {
    writableStreamStartErroring(stream, error);
    return;
  }

  assert(state === "erroring");
  writableStreamFinishErroring(stream);
}

function writableStreamFinishErroring(stream) {
  verbose("writableStreamFinishErroring()");
  assert(stream._state === "erroring");
  assert(writableStreamHasOperationMarkedInFlight(stream) === false);
  stream._state = "errored";
  stream._controller[ErrorSteps]();

  const storedError = stream._storedError;
  for (const writeRequest of stream._writeRequests) {
    rejectPromise(writeRequest, storedError);
  }
  stream._writeRequests = [];

  if (stream._pendingAbortRequest === undefined) {
    writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }

  const abortRequest = stream._pendingAbortRequest;
  stream._pendingAbortRequest = undefined;

  if (abortRequest.wasAlreadyErroring === true) {
    rejectPromise(abortRequest.promise, storedError);
    writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }

  const promise = stream._controller[AbortSteps](abortRequest.reason);
  uponPromise(
    promise,
    () => {
      resolvePromise(abortRequest.promise);
      writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    },
    reason => {
      rejectPromise(abortRequest.promise, reason);
      writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    }
  );
}

function writableStreamFinishInFlightClose(stream) {
  assert(stream._inFlightCloseRequest !== undefined);
  resolvePromise(stream._inFlightCloseRequest, undefined);
  stream._inFlightCloseRequest = undefined;

  const state = stream._state;

  assert(state === "writable" || state === "erroring");

  if (state === "erroring") {
    // The error was too late to do anything, so it is ignored.
    stream._storedError = undefined;
    if (stream._pendingAbortRequest !== undefined) {
      resolvePromise(stream._pendingAbortRequest.promise, undefined);
      stream._pendingAbortRequest = undefined;
    }
  }

  stream._state = "closed";

  const writer = stream._writer;
  if (writer !== undefined) {
    resolvePromise(writer._closedPromise, undefined);
  }

  assert(stream._pendingAbortRequest === undefined);
  assert(stream._storedError === undefined);
}

function writableStreamFinishInFlightCloseWithError(stream, error) {
  assert(stream._inFlightCloseRequest !== undefined);
  rejectPromise(stream._inFlightCloseRequest, error);
  stream._inFlightCloseRequest = undefined;

  assert(stream._state === "writable" || stream._state === "erroring");

  // Never execute sink abort() after sink close().
  if (stream._pendingAbortRequest !== undefined) {
    rejectPromise(stream._pendingAbortRequest.promise, error);
    stream._pendingAbortRequest = undefined;
  }
  writableStreamDealWithRejection(stream, error);
}

function writableStreamFinishInFlightWrite(stream) {
  assert(stream._inFlightWriteRequest !== undefined);
  resolvePromise(stream._inFlightWriteRequest, undefined);
  stream._inFlightWriteRequest = undefined;
}

function writableStreamFinishInFlightWriteWithError(stream, error) {
  assert(stream._inFlightWriteRequest !== undefined);
  rejectPromise(stream._inFlightWriteRequest, error);
  stream._inFlightWriteRequest = undefined;

  assert(stream._state === "writable" || stream._state === "erroring");

  writableStreamDealWithRejection(stream, error);
}

function writableStreamHasOperationMarkedInFlight(stream) {
  if (stream._inFlightWriteRequest === undefined && stream._inFlightCloseRequest === undefined) {
    verbose("writableStreamHasOperationMarkedInFlight() is false");
    return false;
  }

  verbose("writableStreamHasOperationMarkedInFlight() is true");
  return true;
}

function writableStreamMarkCloseRequestInFlight(stream) {
  assert(stream._inFlightCloseRequest === undefined);
  assert(stream._closeRequest !== undefined);
  stream._inFlightCloseRequest = stream._closeRequest;
  stream._closeRequest = undefined;
}

function writableStreamMarkFirstWriteRequestInFlight(stream) {
  assert(stream._inFlightWriteRequest === undefined);
  assert(stream._writeRequests.length !== 0);
  stream._inFlightWriteRequest = stream._writeRequests.shift();
}

function writableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
  verbose("writableStreamRejectCloseAndClosedPromiseIfNeeded()");
  assert(stream._state === "errored");
  if (stream._closeRequest !== undefined) {
    assert(stream._inFlightCloseRequest === undefined);

    rejectPromise(stream._closeRequest, stream._storedError);
    stream._closeRequest = undefined;
  }
  const writer = stream._writer;
  if (writer !== undefined) {
    rejectPromise(writer._closedPromise, stream._storedError);
    setPromiseIsHandledToTrue(writer._closedPromise);
  }
}

function writableStreamStartErroring(stream, reason) {
  verbose("writableStreamStartErroring(stream, %o)", reason);
  assert(stream._storedError === undefined);
  assert(stream._state === "writable");

  const controller = stream._controller;
  assert(controller !== undefined);

  stream._state = "erroring";
  stream._storedError = reason;
  const writer = stream._writer;
  if (writer !== undefined) {
    writableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
  }

  if (writableStreamHasOperationMarkedInFlight(stream) === false && controller._started === true) {
    writableStreamFinishErroring(stream);
  }
}

function writableStreamUpdateBackpressure(stream, backpressure) {
  assert(stream._state === "writable");
  assert(writableStreamCloseQueuedOrInFlight(stream) === false);

  const writer = stream._writer;
  if (writer !== undefined && backpressure !== stream._backpressure) {
    if (backpressure === true) {
      writer._readyPromise = newPromise();
    } else {
      assert(backpressure === false);

      resolvePromise(writer._readyPromise, undefined);
    }
  }

  stream._backpressure = backpressure;
}

// Writers


function writableStreamDefaultWriterAbort(writer, reason) {
  const stream = writer._stream;

  assert(stream !== undefined);

  return writableStreamAbort(stream, reason);
}

function writableStreamDefaultWriterClose(writer) {
  const stream = writer._stream;

  assert(stream !== undefined);

  return writableStreamClose(stream);
}

function writableStreamDefaultWriterCloseWithErrorPropagation(writer) {
  const stream = writer._stream;

  assert(stream !== undefined);

  const state = stream._state;
  if (writableStreamCloseQueuedOrInFlight(stream) === true || state === "closed") {
    return promiseResolvedWith(undefined);
  }

  if (state === "errored") {
    return promiseRejectedWith(stream._storedError);
  }

  assert(state === "writable" || state === "erroring");

  return writableStreamDefaultWriterClose(writer);
}

function writableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
  if (stateIsPending(writer._closedPromise)) {
    rejectPromise(writer._closedPromise, error);
  } else {
    writer._closedPromise = promiseRejectedWith(error);
  }
  setPromiseIsHandledToTrue(writer._closedPromise);
}

function writableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
  verbose("writableStreamDefaultWriterEnsureReadyPromiseRejected(writer, %o)", error);
  if (stateIsPending(writer._readyPromise)) {
    rejectPromise(writer._readyPromise, error);
  } else {
    writer._readyPromise = promiseRejectedWith(error);
  }
  setPromiseIsHandledToTrue(writer._readyPromise);
}

function writableStreamDefaultWriterGetDesiredSize(writer) {
  const stream = writer._stream;
  const state = stream._state;

  if (state === "errored" || state === "erroring") {
    return null;
  }

  if (state === "closed") {
    return 0;
  }

  return writableStreamDefaultControllerGetDesiredSize(stream._controller);
}

function writableStreamDefaultWriterRelease(writer) {
  const stream = writer._stream;
  assert(stream !== undefined);
  assert(stream._writer === writer);

  const releasedError = new TypeError(
    "Writer was released and can no longer be used to monitor the stream's closedness"
  );

  writableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);

  // The state transitions to "errored" before the sink abort() method runs, but the writer.closed promise is not
  // rejected until afterwards. This means that simply testing state will not work.
  writableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);

  stream._writer = undefined;
  writer._stream = undefined;
}

function writableStreamDefaultWriterWrite(writer, chunk) {
  const stream = writer._stream;

  assert(stream !== undefined);

  const controller = stream._controller;

  const chunkSize = writableStreamDefaultControllerGetChunkSize(controller, chunk);

  if (stream !== writer._stream) {
    return promiseRejectedWith(new TypeError("Cannot write to a stream using a released writer"));
  }

  const state = stream._state;
  if (state === "errored") {
    return promiseRejectedWith(stream._storedError);
  }
  if (writableStreamCloseQueuedOrInFlight(stream) === true || state === "closed") {
    return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
  }
  if (state === "erroring") {
    return promiseRejectedWith(stream._storedError);
  }

  assert(state === "writable");

  const promise = writableStreamAddWriteRequest(stream);

  writableStreamDefaultControllerWrite(controller, chunk, chunkSize);

  return promise;
}

// Default controllers

function setUpWritableStreamDefaultController(
  stream,
  controller,
  startAlgorithm,
  writeAlgorithm,
  closeAlgorithm,
  abortAlgorithm,
  highWaterMark,
  sizeAlgorithm
) {
  assert(WritableStream.isImpl(stream));
  assert(stream._controller === undefined);

  controller._stream = stream;
  stream._controller = controller;

  // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
  controller._queue = undefined;
  controller._queueTotalSize = undefined;
  resetQueue(controller);

  controller._started = false;

  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;

  controller._writeAlgorithm = writeAlgorithm;
  controller._closeAlgorithm = closeAlgorithm;
  controller._abortAlgorithm = abortAlgorithm;

  const backpressure = writableStreamDefaultControllerGetBackpressure(controller);
  writableStreamUpdateBackpressure(stream, backpressure);

  const startResult = startAlgorithm();
  const startPromise = promiseResolvedWith(startResult);
  uponPromise(
    startPromise,
    () => {
      assert(stream._state === "writable" || stream._state === "erroring");
      controller._started = true;
      writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
    },
    r => {
      assert(stream._state === "writable" || stream._state === "erroring");
      controller._started = true;
      writableStreamDealWithRejection(stream, r);
    }
  );
}

function setUpWritableStreamDefaultControllerFromUnderlyingSink(
  globalObject,
  stream,
  underlyingSink,
  underlyingSinkDict,
  highWaterMark,
  sizeAlgorithm
) {
  const controller = WritableStreamDefaultController.new(globalObject);

  /* eslint-disable func-style */
  let startAlgorithm = () => undefined;
  let writeAlgorithm = () => promiseResolvedWith(undefined);
  let closeAlgorithm = () => promiseResolvedWith(undefined);
  let abortAlgorithm = () => promiseResolvedWith(undefined);
  /* eslint-enable func-style */

  if ("start" in underlyingSinkDict) {
    startAlgorithm = () => underlyingSinkDict.start.call(underlyingSink, controller);
  }
  if ("write" in underlyingSinkDict) {
    writeAlgorithm = chunk => underlyingSinkDict.write.call(underlyingSink, chunk, controller);
  }
  if ("close" in underlyingSinkDict) {
    closeAlgorithm = () => underlyingSinkDict.close.call(underlyingSink);
  }
  if ("abort" in underlyingSinkDict) {
    abortAlgorithm = reason => underlyingSinkDict.abort.call(underlyingSink, reason);
  }

  setUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
}

function writableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
  verbose("writableStreamDefaultControllerAdvanceQueueIfNeeded()");
  const stream = controller._stream;

  if (controller._started === false) {
    return;
  }

  if (stream._inFlightWriteRequest !== undefined) {
    return;
  }

  const state = stream._state;
  assert(state !== "closed" && state !== "errored");
  if (state === "erroring") {
    writableStreamFinishErroring(stream);
    return;
  }

  if (controller._queue.length === 0) {
    return;
  }

  const value = peekQueueValue(controller);
  if (value === closeSentinel) {
    writableStreamDefaultControllerProcessClose(controller);
  } else {
    writableStreamDefaultControllerProcessWrite(controller, value);
  }
}

function writableStreamDefaultControllerClearAlgorithms(controller) {
  controller._writeAlgorithm = undefined;
  controller._closeAlgorithm = undefined;
  controller._abortAlgorithm = undefined;
  controller._strategySizeAlgorithm = undefined;
}

function writableStreamDefaultControllerClose(controller) {
  enqueueValueWithSize(controller, closeSentinel, 0);
  writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}

function writableStreamDefaultControllerError(controller, error) {
  const stream = controller._stream;

  assert(stream._state === "writable");

  writableStreamDefaultControllerClearAlgorithms(controller);
  writableStreamStartErroring(stream, error);
}

function writableStreamDefaultControllerErrorIfNeeded(controller, error) {
  if (controller._stream._state === "writable") {
    writableStreamDefaultControllerError(controller, error);
  }
}

function writableStreamDefaultControllerGetBackpressure(controller) {
  const desiredSize = writableStreamDefaultControllerGetDesiredSize(controller);
  return desiredSize <= 0;
}

function writableStreamDefaultControllerGetChunkSize(controller, chunk) {
  try {
    return controller._strategySizeAlgorithm(chunk);
  } catch (chunkSizeE) {
    writableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
    return 1;
  }
}

function writableStreamDefaultControllerGetDesiredSize(controller) {
  return controller._strategyHWM - controller._queueTotalSize;
}

function writableStreamDefaultControllerProcessClose(controller) {
  const stream = controller._stream;

  writableStreamMarkCloseRequestInFlight(stream);

  dequeueValue(controller);
  assert(controller._queue.length === 0);

  const sinkClosePromise = controller._closeAlgorithm();
  writableStreamDefaultControllerClearAlgorithms(controller);
  uponPromise(
    sinkClosePromise,
    () => {
      writableStreamFinishInFlightClose(stream);
    },
    reason => {
      writableStreamFinishInFlightCloseWithError(stream, reason);
    }
  );
}

function writableStreamDefaultControllerProcessWrite(controller, chunk) {
  const stream = controller._stream;

  writableStreamMarkFirstWriteRequestInFlight(stream);

  const sinkWritePromise = controller._writeAlgorithm(chunk);
  uponPromise(
    sinkWritePromise,
    () => {
      writableStreamFinishInFlightWrite(stream);

      const state = stream._state;
      assert(state === "writable" || state === "erroring");

      dequeueValue(controller);

      if (writableStreamCloseQueuedOrInFlight(stream) === false && state === "writable") {
        const backpressure = writableStreamDefaultControllerGetBackpressure(controller);
        writableStreamUpdateBackpressure(stream, backpressure);
      }

      writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
    },
    reason => {
      if (stream._state === "writable") {
        writableStreamDefaultControllerClearAlgorithms(controller);
      }
      writableStreamFinishInFlightWriteWithError(stream, reason);
    }
  );
}

function writableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
  try {
    enqueueValueWithSize(controller, chunk, chunkSize);
  } catch (enqueueE) {
    writableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
    return;
  }

  const stream = controller._stream;
  if (writableStreamCloseQueuedOrInFlight(stream) === false && stream._state === "writable") {
    const backpressure = writableStreamDefaultControllerGetBackpressure(controller);
    writableStreamUpdateBackpressure(stream, backpressure);
  }

  writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}
