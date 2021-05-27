'use strict';
const assert = require('assert');
const verbose = require('debug')('streams:writable-stream:verbose');

const { promiseResolvedWith, promiseRejectedWith, newPromise, resolvePromise, rejectPromise, uponPromise,
        setPromiseIsHandledToTrue, stateIsPending } = require('../helpers/webidl.js');
const { IsNonNegativeNumber } = require('./miscellaneous.js');
const { DequeueValue, EnqueueValueWithSize, PeekQueueValue, ResetQueue } = require('./queue-with-sizes.js');
const { AbortSteps, ErrorSteps } = require('./internal-methods.js');

const WritableStream = require('../../../../generated/WritableStream.js');
const WritableStreamDefaultController = require('../../../../generated/WritableStreamDefaultController.js');
const WritableStreamDefaultWriter = require('../../../../generated/WritableStreamDefaultWriter.js');

const closeSentinel = Symbol('close sentinel');

Object.assign(exports, {
  AcquireWritableStreamDefaultWriter,
  CreateWritableStream,
  InitializeWritableStream,
  IsWritableStreamLocked,
  SetUpWritableStreamDefaultControllerFromUnderlyingSink,
  SetUpWritableStreamDefaultWriter,
  WritableStreamAbort,
  WritableStreamClose,
  WritableStreamCloseQueuedOrInFlight,
  WritableStreamDefaultControllerClearAlgorithms,
  WritableStreamDefaultControllerError,
  WritableStreamDefaultControllerErrorIfNeeded,
  WritableStreamDefaultWriterAbort,
  WritableStreamDefaultWriterClose,
  WritableStreamDefaultWriterCloseWithErrorPropagation,
  WritableStreamDefaultWriterGetDesiredSize,
  WritableStreamDefaultWriterRelease,
  WritableStreamDefaultWriterWrite
});

// Working with writable streams

function AcquireWritableStreamDefaultWriter(globalObject, stream) {
  const writer = WritableStreamDefaultWriter.new(globalObject);
  SetUpWritableStreamDefaultWriter(writer, stream);
  return writer;
}

function CreateWritableStream(globalObject, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1,
                              sizeAlgorithm = () => 1) {
  assert(IsNonNegativeNumber(highWaterMark) === true);

  const stream = WritableStream.new(globalObject);
  InitializeWritableStream(stream);

  const controller = WritableStreamDefaultController.new(globalObject);

  SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm,
                                       abortAlgorithm, highWaterMark, sizeAlgorithm);
  return stream;
}

function InitializeWritableStream(stream) {
  stream._state = 'writable';

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

function IsWritableStreamLocked(stream) {
  assert(WritableStream.isImpl(stream));

  if (stream._writer === undefined) {
    return false;
  }

  return true;
}

function WritableStreamAbort(stream, reason) {
  const state = stream._state;
  if (state === 'closed' || state === 'errored') {
    return promiseResolvedWith(undefined);
  }
  if (stream._pendingAbortRequest !== undefined) {
    return stream._pendingAbortRequest.promise;
  }

  assert(state === 'writable' || state === 'erroring');

  let wasAlreadyErroring = false;
  if (state === 'erroring') {
    wasAlreadyErroring = true;
    // reason will not be used, so don't keep a reference to it.
    reason = undefined;
  }

  const promise = newPromise();
  stream._pendingAbortRequest = { promise, reason, wasAlreadyErroring };

  if (wasAlreadyErroring === false) {
    WritableStreamStartErroring(stream, reason);
  }

  return promise;
}

function SetUpWritableStreamDefaultWriter(writer, stream) {
  if (IsWritableStreamLocked(stream) === true) {
    throw new TypeError('This stream has already been locked for exclusive writing by another writer');
  }

  writer._stream = stream;
  stream._writer = writer;

  const state = stream._state;

  if (state === 'writable') {
    if (WritableStreamCloseQueuedOrInFlight(stream) === false && stream._backpressure === true) {
      writer._readyPromise = newPromise();
    } else {
      writer._readyPromise = promiseResolvedWith(undefined);
    }

    writer._closedPromise = newPromise();
  } else if (state === 'erroring') {
    writer._readyPromise = promiseRejectedWith(stream._storedError);
    setPromiseIsHandledToTrue(writer._readyPromise);
    writer._closedPromise = newPromise();
  } else if (state === 'closed') {
    writer._readyPromise = promiseResolvedWith(undefined);
    writer._closedPromise = promiseResolvedWith(undefined);
  } else {
    assert(state === 'errored');

    const storedError = stream._storedError;
    writer._readyPromise = promiseRejectedWith(storedError);
    setPromiseIsHandledToTrue(writer._readyPromise);
    writer._closedPromise = promiseRejectedWith(storedError);
    setPromiseIsHandledToTrue(writer._closedPromise);
  }
}

function WritableStreamClose(stream) {
  const state = stream._state;
  if (state === 'closed' || state === 'errored') {
    return promiseRejectedWith(new TypeError(
      `The stream (in ${state} state) is not in the writable state and cannot be closed`));
  }

  assert(state === 'writable' || state === 'erroring');
  assert(WritableStreamCloseQueuedOrInFlight(stream) === false);

  const promise = newPromise();
  stream._closeRequest = promise;

  const writer = stream._writer;
  if (writer !== undefined && stream._backpressure === true && state === 'writable') {
    resolvePromise(writer._readyPromise, undefined);
  }

  WritableStreamDefaultControllerClose(stream._controller);

  return promise;
}

// Interfacing with controllers

function WritableStreamAddWriteRequest(stream) {
  assert(IsWritableStreamLocked(stream) === true);
  assert(stream._state === 'writable');

  const promise = newPromise();
  stream._writeRequests.push(promise);
  return promise;
}

function WritableStreamCloseQueuedOrInFlight(stream) {
  if (stream._closeRequest === undefined && stream._inFlightCloseRequest === undefined) {
    return false;
  }

  return true;
}

function WritableStreamDealWithRejection(stream, error) {
  verbose('WritableStreamDealWithRejection(stream, %o)', error);
  const state = stream._state;

  if (state === 'writable') {
    WritableStreamStartErroring(stream, error);
    return;
  }

  assert(state === 'erroring');
  WritableStreamFinishErroring(stream);
}

function WritableStreamFinishErroring(stream) {
  verbose('WritableStreamFinishErroring()');
  assert(stream._state === 'erroring');
  assert(WritableStreamHasOperationMarkedInFlight(stream) === false);
  stream._state = 'errored';
  stream._controller[ErrorSteps]();

  const storedError = stream._storedError;
  for (const writeRequest of stream._writeRequests) {
    rejectPromise(writeRequest, storedError);
  }
  stream._writeRequests = [];

  if (stream._pendingAbortRequest === undefined) {
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }

  const abortRequest = stream._pendingAbortRequest;
  stream._pendingAbortRequest = undefined;

  if (abortRequest.wasAlreadyErroring === true) {
    rejectPromise(abortRequest.promise, storedError);
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }

  const promise = stream._controller[AbortSteps](abortRequest.reason);
  uponPromise(
    promise,
    () => {
      resolvePromise(abortRequest.promise);
      WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    },
    reason => {
      rejectPromise(abortRequest.promise, reason);
      WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    });
}

function WritableStreamFinishInFlightClose(stream) {
  assert(stream._inFlightCloseRequest !== undefined);
  resolvePromise(stream._inFlightCloseRequest, undefined);
  stream._inFlightCloseRequest = undefined;

  const state = stream._state;

  assert(state === 'writable' || state === 'erroring');

  if (state === 'erroring') {
    // The error was too late to do anything, so it is ignored.
    stream._storedError = undefined;
    if (stream._pendingAbortRequest !== undefined) {
      resolvePromise(stream._pendingAbortRequest.promise, undefined);
      stream._pendingAbortRequest = undefined;
    }
  }

  stream._state = 'closed';

  const writer = stream._writer;
  if (writer !== undefined) {
    resolvePromise(writer._closedPromise, undefined);
  }

  assert(stream._pendingAbortRequest === undefined);
  assert(stream._storedError === undefined);
}

function WritableStreamFinishInFlightCloseWithError(stream, error) {
  assert(stream._inFlightCloseRequest !== undefined);
  rejectPromise(stream._inFlightCloseRequest, error);
  stream._inFlightCloseRequest = undefined;

  assert(stream._state === 'writable' || stream._state === 'erroring');

  // Never execute sink abort() after sink close().
  if (stream._pendingAbortRequest !== undefined) {
    rejectPromise(stream._pendingAbortRequest.promise, error);
    stream._pendingAbortRequest = undefined;
  }
  WritableStreamDealWithRejection(stream, error);
}

function WritableStreamFinishInFlightWrite(stream) {
  assert(stream._inFlightWriteRequest !== undefined);
  resolvePromise(stream._inFlightWriteRequest, undefined);
  stream._inFlightWriteRequest = undefined;
}

function WritableStreamFinishInFlightWriteWithError(stream, error) {
  assert(stream._inFlightWriteRequest !== undefined);
  rejectPromise(stream._inFlightWriteRequest, error);
  stream._inFlightWriteRequest = undefined;

  assert(stream._state === 'writable' || stream._state === 'erroring');

  WritableStreamDealWithRejection(stream, error);
}

function WritableStreamHasOperationMarkedInFlight(stream) {
  if (stream._inFlightWriteRequest === undefined && stream._inFlightCloseRequest === undefined) {
    verbose('WritableStreamHasOperationMarkedInFlight() is false');
    return false;
  }

  verbose('WritableStreamHasOperationMarkedInFlight() is true');
  return true;
}

function WritableStreamMarkCloseRequestInFlight(stream) {
  assert(stream._inFlightCloseRequest === undefined);
  assert(stream._closeRequest !== undefined);
  stream._inFlightCloseRequest = stream._closeRequest;
  stream._closeRequest = undefined;
}

function WritableStreamMarkFirstWriteRequestInFlight(stream) {
  assert(stream._inFlightWriteRequest === undefined);
  assert(stream._writeRequests.length !== 0);
  stream._inFlightWriteRequest = stream._writeRequests.shift();
}

function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
  verbose('WritableStreamRejectCloseAndClosedPromiseIfNeeded()');
  assert(stream._state === 'errored');
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

function WritableStreamStartErroring(stream, reason) {
  verbose('WritableStreamStartErroring(stream, %o)', reason);
  assert(stream._storedError === undefined);
  assert(stream._state === 'writable');

  const controller = stream._controller;
  assert(controller !== undefined);

  stream._state = 'erroring';
  stream._storedError = reason;
  const writer = stream._writer;
  if (writer !== undefined) {
    WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
  }

  if (WritableStreamHasOperationMarkedInFlight(stream) === false && controller._started === true) {
    WritableStreamFinishErroring(stream);
  }
}

function WritableStreamUpdateBackpressure(stream, backpressure) {
  assert(stream._state === 'writable');
  assert(WritableStreamCloseQueuedOrInFlight(stream) === false);

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


function WritableStreamDefaultWriterAbort(writer, reason) {
  const stream = writer._stream;

  assert(stream !== undefined);

  return WritableStreamAbort(stream, reason);
}

function WritableStreamDefaultWriterClose(writer) {
  const stream = writer._stream;

  assert(stream !== undefined);

  return WritableStreamClose(stream);
}

function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
  const stream = writer._stream;

  assert(stream !== undefined);

  const state = stream._state;
  if (WritableStreamCloseQueuedOrInFlight(stream) === true || state === 'closed') {
    return promiseResolvedWith(undefined);
  }

  if (state === 'errored') {
    return promiseRejectedWith(stream._storedError);
  }

  assert(state === 'writable' || state === 'erroring');

  return WritableStreamDefaultWriterClose(writer);
}

function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
  if (stateIsPending(writer._closedPromise)) {
    rejectPromise(writer._closedPromise, error);
  } else {
    writer._closedPromise = promiseRejectedWith(error);
  }
  setPromiseIsHandledToTrue(writer._closedPromise);
}

function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
  verbose('WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, %o)', error);
  if (stateIsPending(writer._readyPromise)) {
    rejectPromise(writer._readyPromise, error);
  } else {
    writer._readyPromise = promiseRejectedWith(error);
  }
  setPromiseIsHandledToTrue(writer._readyPromise);
}

function WritableStreamDefaultWriterGetDesiredSize(writer) {
  const stream = writer._stream;
  const state = stream._state;

  if (state === 'errored' || state === 'erroring') {
    return null;
  }

  if (state === 'closed') {
    return 0;
  }

  return WritableStreamDefaultControllerGetDesiredSize(stream._controller);
}

function WritableStreamDefaultWriterRelease(writer) {
  const stream = writer._stream;
  assert(stream !== undefined);
  assert(stream._writer === writer);

  const releasedError = new TypeError(
    'Writer was released and can no longer be used to monitor the stream\'s closedness');

  WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);

  // The state transitions to "errored" before the sink abort() method runs, but the writer.closed promise is not
  // rejected until afterwards. This means that simply testing state will not work.
  WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);

  stream._writer = undefined;
  writer._stream = undefined;
}

function WritableStreamDefaultWriterWrite(writer, chunk) {
  const stream = writer._stream;

  assert(stream !== undefined);

  const controller = stream._controller;

  const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);

  if (stream !== writer._stream) {
    return promiseRejectedWith(new TypeError('Cannot write to a stream using a released writer'));
  }

  const state = stream._state;
  if (state === 'errored') {
    return promiseRejectedWith(stream._storedError);
  }
  if (WritableStreamCloseQueuedOrInFlight(stream) === true || state === 'closed') {
    return promiseRejectedWith(new TypeError('The stream is closing or closed and cannot be written to'));
  }
  if (state === 'erroring') {
    return promiseRejectedWith(stream._storedError);
  }

  assert(state === 'writable');

  const promise = WritableStreamAddWriteRequest(stream);

  WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);

  return promise;
}

// Default controllers

function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm,
                                              abortAlgorithm, highWaterMark, sizeAlgorithm) {
  assert(WritableStream.isImpl(stream));
  assert(stream._controller === undefined);

  controller._stream = stream;
  stream._controller = controller;

  // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
  controller._queue = undefined;
  controller._queueTotalSize = undefined;
  ResetQueue(controller);

  controller._started = false;

  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;

  controller._writeAlgorithm = writeAlgorithm;
  controller._closeAlgorithm = closeAlgorithm;
  controller._abortAlgorithm = abortAlgorithm;

  const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
  WritableStreamUpdateBackpressure(stream, backpressure);

  const startResult = startAlgorithm();
  const startPromise = promiseResolvedWith(startResult);
  uponPromise(
    startPromise,
    () => {
      assert(stream._state === 'writable' || stream._state === 'erroring');
      controller._started = true;
      WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
    },
    r => {
      assert(stream._state === 'writable' || stream._state === 'erroring');
      controller._started = true;
      WritableStreamDealWithRejection(stream, r);
    }
  );
}

function SetUpWritableStreamDefaultControllerFromUnderlyingSink(globalObject, stream, underlyingSink, underlyingSinkDict,
                                                                highWaterMark, sizeAlgorithm) {
  const controller = WritableStreamDefaultController.new(globalObject);

  let startAlgorithm = () => undefined;
  let writeAlgorithm = () => promiseResolvedWith(undefined);
  let closeAlgorithm = () => promiseResolvedWith(undefined);
  let abortAlgorithm = () => promiseResolvedWith(undefined);

  if ('start' in underlyingSinkDict) {
    startAlgorithm = () => underlyingSinkDict.start.call(underlyingSink, controller);
  }
  if ('write' in underlyingSinkDict) {
    writeAlgorithm = chunk => underlyingSinkDict.write.call(underlyingSink, chunk, controller);
  }
  if ('close' in underlyingSinkDict) {
    closeAlgorithm = () => underlyingSinkDict.close.call(underlyingSink);
  }
  if ('abort' in underlyingSinkDict) {
    abortAlgorithm = reason => underlyingSinkDict.abort.call(underlyingSink, reason);
  }

  SetUpWritableStreamDefaultController(
    stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm
  );
}

function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
  verbose('WritableStreamDefaultControllerAdvanceQueueIfNeeded()');
  const stream = controller._stream;

  if (controller._started === false) {
    return;
  }

  if (stream._inFlightWriteRequest !== undefined) {
    return;
  }

  const state = stream._state;
  assert(state !== 'closed' && state !== 'errored');
  if (state === 'erroring') {
    WritableStreamFinishErroring(stream);
    return;
  }

  if (controller._queue.length === 0) {
    return;
  }

  const value = PeekQueueValue(controller);
  if (value === closeSentinel) {
    WritableStreamDefaultControllerProcessClose(controller);
  } else {
    WritableStreamDefaultControllerProcessWrite(controller, value);
  }
}

function WritableStreamDefaultControllerClearAlgorithms(controller) {
  controller._writeAlgorithm = undefined;
  controller._closeAlgorithm = undefined;
  controller._abortAlgorithm = undefined;
  controller._strategySizeAlgorithm = undefined;
}

function WritableStreamDefaultControllerClose(controller) {
  EnqueueValueWithSize(controller, closeSentinel, 0);
  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}

function WritableStreamDefaultControllerError(controller, error) {
  const stream = controller._stream;

  assert(stream._state === 'writable');

  WritableStreamDefaultControllerClearAlgorithms(controller);
  WritableStreamStartErroring(stream, error);
}

function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
  if (controller._stream._state === 'writable') {
    WritableStreamDefaultControllerError(controller, error);
  }
}

function WritableStreamDefaultControllerGetBackpressure(controller) {
  const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
  return desiredSize <= 0;
}

function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
  try {
    return controller._strategySizeAlgorithm(chunk);
  } catch (chunkSizeE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
    return 1;
  }
}

function WritableStreamDefaultControllerGetDesiredSize(controller) {
  return controller._strategyHWM - controller._queueTotalSize;
}

function WritableStreamDefaultControllerProcessClose(controller) {
  const stream = controller._stream;

  WritableStreamMarkCloseRequestInFlight(stream);

  DequeueValue(controller);
  assert(controller._queue.length === 0);

  const sinkClosePromise = controller._closeAlgorithm();
  WritableStreamDefaultControllerClearAlgorithms(controller);
  uponPromise(
    sinkClosePromise,
    () => {
      WritableStreamFinishInFlightClose(stream);
    },
    reason => {
      WritableStreamFinishInFlightCloseWithError(stream, reason);
    }
  );
}

function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
  const stream = controller._stream;

  WritableStreamMarkFirstWriteRequestInFlight(stream);

  const sinkWritePromise = controller._writeAlgorithm(chunk);
  uponPromise(
    sinkWritePromise,
    () => {
      WritableStreamFinishInFlightWrite(stream);

      const state = stream._state;
      assert(state === 'writable' || state === 'erroring');

      DequeueValue(controller);

      if (WritableStreamCloseQueuedOrInFlight(stream) === false && state === 'writable') {
        const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
        WritableStreamUpdateBackpressure(stream, backpressure);
      }

      WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
    },
    reason => {
      if (stream._state === 'writable') {
        WritableStreamDefaultControllerClearAlgorithms(controller);
      }
      WritableStreamFinishInFlightWriteWithError(stream, reason);
    }
  );
}

function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
  try {
    EnqueueValueWithSize(controller, chunk, chunkSize);
  } catch (enqueueE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
    return;
  }

  const stream = controller._stream;
  if (WritableStreamCloseQueuedOrInFlight(stream) === false && stream._state === 'writable') {
    const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
    WritableStreamUpdateBackpressure(stream, backpressure);
  }

  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}
