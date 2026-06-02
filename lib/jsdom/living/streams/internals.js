"use strict";

// Implementation of the WHATWG Streams Standard "readable streams" section.
// See https://streams.spec.whatwg.org/#rs-abstract-ops and related sections.
// The slot/state names below follow the spec's `[[name]]` slots, lower-cased.

const STATE = Object.freeze({
  READABLE: "readable",
  CLOSED: "closed",
  ERRORED: "errored"
});

const READER = Object.freeze({
  DEFAULT: "default",
  BYOB: "byob"
});

// --- Promise helpers --------------------------------------------------------

function newPromiseCapability(globalObject) {
  let resolve,
    reject;
  const promise = new globalObject.Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function resolvedPromise(globalObject, value) {
  return globalObject.Promise.resolve(value);
}

function rejectedPromise(globalObject, reason) {
  return globalObject.Promise.reject(reason);
}

// Mark a promise as handled so unhandled-rejection diagnostics ignore it.
// We attach an empty rejection handler.
function markPromiseHandled(promise) {
  promise.then(undefined, () => {});
}

// --- Queue-with-sizes -------------------------------------------------------

function dequeueValue(container) {
  const valueWithSize = container._queue.shift();
  container._queueTotalSize -= valueWithSize.size;
  if (container._queueTotalSize < 0) {
    container._queueTotalSize = 0;
  }
  return valueWithSize.value;
}

function enqueueValueWithSize(container, value, size) {
  if (!Number.isFinite(size) || size < 0) {
    throw new RangeError("Size must be a finite, non-negative number.");
  }
  container._queue.push({ value, size });
  container._queueTotalSize += size;
}

function resetQueue(container) {
  container._queue = [];
  container._queueTotalSize = 0;
}

// --- Strategy helpers -------------------------------------------------------

function extractHighWaterMark(strategy, defaultHWM) {
  if (strategy.highWaterMark === undefined) {
    return defaultHWM;
  }
  const hwm = Number(strategy.highWaterMark);
  if (Number.isNaN(hwm) || hwm < 0) {
    throw new RangeError("highWaterMark must be a non-negative number.");
  }
  return hwm;
}

function extractSizeAlgorithm(strategy) {
  if (strategy.size === undefined) {
    return () => 1;
  }
  return chunk => strategy.size(chunk);
}

// --- Stream state -----------------------------------------------------------

function initializeReadableStream(stream) {
  stream._state = STATE.READABLE;
  stream._reader = undefined;
  stream._storedError = undefined;
  stream._disturbed = false;
  stream._controller = undefined;
}

function isReadableStreamLocked(stream) {
  return stream._reader !== undefined;
}

function readableStreamGetNumReadRequests(stream) {
  return stream._reader._readRequests.length;
}

function readableStreamGetNumReadIntoRequests(stream) {
  return stream._reader._readIntoRequests.length;
}

function readableStreamHasDefaultReader(stream) {
  const reader = stream._reader;
  return reader !== undefined && reader._readerType === READER.DEFAULT;
}

function readableStreamHasBYOBReader(stream) {
  const reader = stream._reader;
  return reader !== undefined && reader._readerType === READER.BYOB;
}

function readableStreamFulfillReadRequest(stream, chunk, done) {
  const readRequest = stream._reader._readRequests.shift();
  if (done) {
    readRequest.closeSteps();
  } else {
    readRequest.chunkSteps(chunk);
  }
}

function readableStreamFulfillReadIntoRequest(stream, chunk, done) {
  const readIntoRequest = stream._reader._readIntoRequests.shift();
  if (done) {
    readIntoRequest.closeSteps(chunk);
  } else {
    readIntoRequest.chunkSteps(chunk);
  }
}

function readableStreamAddReadRequest(stream, readRequest) {
  stream._reader._readRequests.push(readRequest);
}

function readableStreamAddReadIntoRequest(stream, readIntoRequest) {
  stream._reader._readIntoRequests.push(readIntoRequest);
}

function readableStreamClose(stream) {
  stream._state = STATE.CLOSED;
  const reader = stream._reader;
  if (reader === undefined) {
    return;
  }
  reader._closedPromise.resolve(undefined);
  if (reader._readerType === READER.DEFAULT) {
    for (const readRequest of reader._readRequests) {
      readRequest.closeSteps();
    }
    reader._readRequests = [];
  }
}

function readableStreamError(stream, error) {
  stream._state = STATE.ERRORED;
  stream._storedError = error;
  const reader = stream._reader;
  if (reader === undefined) {
    return;
  }
  reader._closedPromise.reject(error);
  markPromiseHandled(reader._closedPromise.promise);
  if (reader._readerType === READER.DEFAULT) {
    for (const readRequest of reader._readRequests) {
      readRequest.errorSteps(error);
    }
    reader._readRequests = [];
  } else {
    for (const readIntoRequest of reader._readIntoRequests) {
      readIntoRequest.errorSteps(error);
    }
    reader._readIntoRequests = [];
  }
}

function readableStreamCancel(stream, reason) {
  const globalObject = stream._globalObject;
  stream._disturbed = true;
  if (stream._state === STATE.CLOSED) {
    return resolvedPromise(globalObject, undefined);
  }
  if (stream._state === STATE.ERRORED) {
    return rejectedPromise(globalObject, stream._storedError);
  }
  readableStreamClose(stream);
  const reader = stream._reader;
  if (reader !== undefined && reader._readerType === READER.BYOB) {
    for (const readIntoRequest of reader._readIntoRequests) {
      readIntoRequest.closeSteps(undefined);
    }
    reader._readIntoRequests = [];
  }
  const sourceCancelPromise = stream._controller._cancelSteps(reason);
  return sourceCancelPromise.then(() => undefined);
}

// --- Generic reader ---------------------------------------------------------

function readableStreamReaderGenericInitialize(reader, stream, globalObject) {
  reader._globalObject = globalObject;
  reader._stream = stream;
  stream._reader = reader;
  if (stream._state === STATE.READABLE) {
    reader._closedPromise = newPromiseCapability(globalObject);
  } else if (stream._state === STATE.CLOSED) {
    reader._closedPromise = newPromiseCapability(globalObject);
    reader._closedPromise.resolve(undefined);
  } else {
    reader._closedPromise = newPromiseCapability(globalObject);
    reader._closedPromise.reject(stream._storedError);
    markPromiseHandled(reader._closedPromise.promise);
  }
}

function readableStreamReaderGenericCancel(reader, reason) {
  const stream = reader._stream;
  return readableStreamCancel(stream, reason);
}

function readableStreamReaderGenericRelease(reader) {
  const globalObject = reader._globalObject;
  const stream = reader._stream;
  const releasedError = new globalObject.TypeError("Reader was released.");
  if (stream._state === STATE.READABLE) {
    reader._closedPromise.reject(releasedError);
  } else {
    reader._closedPromise = newPromiseCapability(globalObject);
    reader._closedPromise.reject(releasedError);
  }
  markPromiseHandled(reader._closedPromise.promise);
  stream._controller._releaseSteps();
  stream._reader = undefined;
  reader._stream = undefined;
}

function readableStreamDefaultReaderRelease(reader) {
  readableStreamReaderGenericRelease(reader);
  const globalObject = reader._globalObject;
  const releasedError = new globalObject.TypeError("Reader was released.");
  for (const readRequest of reader._readRequests) {
    readRequest.errorSteps(releasedError);
  }
  reader._readRequests = [];
}

function readableStreamBYOBReaderRelease(reader) {
  readableStreamReaderGenericRelease(reader);
  const globalObject = reader._globalObject;
  const releasedError = new globalObject.TypeError("Reader was released.");
  for (const readIntoRequest of reader._readIntoRequests) {
    readIntoRequest.errorSteps(releasedError);
  }
  reader._readIntoRequests = [];
}

// --- Default reader read ---------------------------------------------------

function readableStreamDefaultReaderRead(reader, readRequest) {
  const stream = reader._stream;
  stream._disturbed = true;
  if (stream._state === STATE.CLOSED) {
    readRequest.closeSteps();
  } else if (stream._state === STATE.ERRORED) {
    readRequest.errorSteps(stream._storedError);
  } else {
    stream._controller._pullSteps(readRequest);
  }
}

// --- BYOB reader read ------------------------------------------------------

function readableStreamBYOBReaderRead(reader, view, min, readIntoRequest) {
  const stream = reader._stream;
  stream._disturbed = true;
  if (stream._state === STATE.ERRORED) {
    readIntoRequest.errorSteps(stream._storedError);
  } else {
    readableByteStreamControllerPullInto(stream._controller, view, min, readIntoRequest);
  }
}

// --- Default controller ---------------------------------------------------

function readableStreamDefaultControllerShouldCallPull(controller) {
  const stream = controller._stream;
  if (!readableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return false;
  }
  if (!controller._started) {
    return false;
  }
  if (isReadableStreamLocked(stream) && readableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }
  const desiredSize = readableStreamDefaultControllerGetDesiredSize(controller);
  return desiredSize > 0;
}

function readableStreamDefaultControllerCanCloseOrEnqueue(controller) {
  return !controller._closeRequested && controller._stream._state === STATE.READABLE;
}

function readableStreamDefaultControllerGetDesiredSize(controller) {
  const state = controller._stream._state;
  if (state === STATE.ERRORED) {
    return null;
  }
  if (state === STATE.CLOSED) {
    return 0;
  }
  return controller._strategyHWM - controller._queueTotalSize;
}

function readableStreamDefaultControllerCallPullIfNeeded(controller) {
  if (!readableStreamDefaultControllerShouldCallPull(controller)) {
    return;
  }
  if (controller._pulling) {
    controller._pullAgain = true;
    return;
  }
  controller._pulling = true;
  const pullPromise = controller._pullAlgorithm();
  pullPromise.then(
    () => {
      controller._pulling = false;
      if (controller._pullAgain) {
        controller._pullAgain = false;
        readableStreamDefaultControllerCallPullIfNeeded(controller);
      }
    },
    err => {
      readableStreamDefaultControllerError(controller, err);
    }
  );
}

function readableStreamDefaultControllerClearAlgorithms(controller) {
  controller._pullAlgorithm = undefined;
  controller._cancelAlgorithm = undefined;
  controller._strategySizeAlgorithm = undefined;
}

function readableStreamDefaultControllerClose(controller) {
  if (!readableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return;
  }
  controller._closeRequested = true;
  if (controller._queue.length === 0) {
    readableStreamDefaultControllerClearAlgorithms(controller);
    readableStreamClose(controller._stream);
  }
}

function readableStreamDefaultControllerEnqueue(controller, chunk) {
  if (!readableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return;
  }
  const stream = controller._stream;
  if (isReadableStreamLocked(stream) && readableStreamGetNumReadRequests(stream) > 0) {
    readableStreamFulfillReadRequest(stream, chunk, false);
  } else {
    let chunkSize;
    try {
      chunkSize = controller._strategySizeAlgorithm(chunk);
    } catch (e) {
      readableStreamDefaultControllerError(controller, e);
      throw e;
    }
    try {
      enqueueValueWithSize(controller, chunk, chunkSize);
    } catch (e) {
      readableStreamDefaultControllerError(controller, e);
      throw e;
    }
  }
  readableStreamDefaultControllerCallPullIfNeeded(controller);
}

function readableStreamDefaultControllerError(controller, e) {
  const stream = controller._stream;
  if (stream._state !== STATE.READABLE) {
    return;
  }
  resetQueue(controller);
  readableStreamDefaultControllerClearAlgorithms(controller);
  readableStreamError(stream, e);
}

// _pullSteps for default controller
function defaultControllerPullSteps(controller, readRequest) {
  const stream = controller._stream;
  if (controller._queue.length > 0) {
    const chunk = dequeueValue(controller);
    if (controller._closeRequested && controller._queue.length === 0) {
      readableStreamDefaultControllerClearAlgorithms(controller);
      readableStreamClose(stream);
    } else {
      readableStreamDefaultControllerCallPullIfNeeded(controller);
    }
    readRequest.chunkSteps(chunk);
  } else {
    readableStreamAddReadRequest(stream, readRequest);
    readableStreamDefaultControllerCallPullIfNeeded(controller);
  }
}

function defaultControllerCancelSteps(controller, reason) {
  resetQueue(controller);
  const result = controller._cancelAlgorithm(reason);
  readableStreamDefaultControllerClearAlgorithms(controller);
  return result;
}

function defaultControllerReleaseSteps() {
  // no-op for default controller
}

function setUpReadableStreamDefaultController(
  stream,
  controller,
  startAlgorithm,
  pullAlgorithm,
  cancelAlgorithm,
  highWaterMark,
  sizeAlgorithm
) {
  controller._stream = stream;
  resetQueue(controller);
  controller._started = false;
  controller._closeRequested = false;
  controller._pullAgain = false;
  controller._pulling = false;
  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;
  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;
  controller._pullSteps = readRequest => defaultControllerPullSteps(controller, readRequest);
  controller._cancelSteps = reason => defaultControllerCancelSteps(controller, reason);
  controller._releaseSteps = defaultControllerReleaseSteps;

  stream._controller = controller;
  const startResult = startAlgorithm();
  Promise.resolve(startResult).then(
    () => {
      controller._started = true;
      readableStreamDefaultControllerCallPullIfNeeded(controller);
    },
    r => {
      readableStreamDefaultControllerError(controller, r);
    }
  );
}

function setUpReadableStreamDefaultControllerFromUnderlyingSource(
  stream,
  underlyingSource,
  underlyingSourceDict,
  highWaterMark,
  sizeAlgorithm,
  globalObject
) {
  const ReadableStreamDefaultController = require("../../../generated/idl/ReadableStreamDefaultController");
  const controller = ReadableStreamDefaultController.createImpl(globalObject, [], {});

  function startAlgorithm() {
    if (underlyingSourceDict.start === undefined) {
      return undefined;
    }
    return underlyingSourceDict.start.call(underlyingSource, getControllerWrapper(controller));
  }
  function pullAlgorithm() {
    if (underlyingSourceDict.pull === undefined) {
      return resolvedPromise(globalObject, undefined);
    }
    try {
      return Promise.resolve(underlyingSourceDict.pull.call(underlyingSource, getControllerWrapper(controller)));
    } catch (e) {
      return rejectedPromise(globalObject, e);
    }
  }
  function cancelAlgorithm(reason) {
    if (underlyingSourceDict.cancel === undefined) {
      return resolvedPromise(globalObject, undefined);
    }
    try {
      return Promise.resolve(underlyingSourceDict.cancel.call(underlyingSource, reason));
    } catch (e) {
      return rejectedPromise(globalObject, e);
    }
  }
  setUpReadableStreamDefaultController(
    stream,
    controller,
    startAlgorithm,
    pullAlgorithm,
    cancelAlgorithm,
    highWaterMark,
    sizeAlgorithm
  );
}

// --- Byte stream controller ------------------------------------------------

function readableByteStreamControllerCanCloseOrEnqueue(controller) {
  return !controller._closeRequested && controller._stream._state === STATE.READABLE;
}

function readableByteStreamControllerGetDesiredSize(controller) {
  const state = controller._stream._state;
  if (state === STATE.ERRORED) {
    return null;
  }
  if (state === STATE.CLOSED) {
    return 0;
  }
  return controller._strategyHWM - controller._queueTotalSize;
}

function readableByteStreamControllerInvalidateBYOBRequest(controller) {
  if (controller._byobRequest === null) {
    return;
  }
  controller._byobRequest._controller = undefined;
  controller._byobRequest._view = null;
  controller._byobRequest = null;
}

function readableByteStreamControllerClearPendingPullIntos(controller) {
  readableByteStreamControllerInvalidateBYOBRequest(controller);
  controller._pendingPullIntos = [];
}

function readableByteStreamControllerClearAlgorithms(controller) {
  controller._pullAlgorithm = undefined;
  controller._cancelAlgorithm = undefined;
}

function readableByteStreamControllerError(controller, e) {
  const stream = controller._stream;
  if (stream._state !== STATE.READABLE) {
    return;
  }
  readableByteStreamControllerClearPendingPullIntos(controller);
  resetQueue(controller);
  readableByteStreamControllerClearAlgorithms(controller);
  readableStreamError(stream, e);
}

function readableByteStreamControllerClose(controller) {
  const stream = controller._stream;
  if (controller._closeRequested || stream._state !== STATE.READABLE) {
    return;
  }
  if (controller._queueTotalSize > 0) {
    controller._closeRequested = true;
    return;
  }
  if (controller._pendingPullIntos.length > 0) {
    const firstPendingPullInto = controller._pendingPullIntos[0];
    if (firstPendingPullInto.bytesFilled % firstPendingPullInto.elementSize !== 0) {
      const e = new TypeError("Insufficient bytes to fill elements in the given buffer.");
      readableByteStreamControllerError(controller, e);
      throw e;
    }
  }
  readableByteStreamControllerClearAlgorithms(controller);
  readableStreamClose(stream);
}

function readableByteStreamControllerHandleQueueDrain(controller) {
  if (controller._queueTotalSize === 0 && controller._closeRequested) {
    readableByteStreamControllerClearAlgorithms(controller);
    readableStreamClose(controller._stream);
  } else {
    readableByteStreamControllerCallPullIfNeeded(controller);
  }
}

function readableByteStreamControllerShouldCallPull(controller) {
  const stream = controller._stream;
  if (stream._state !== STATE.READABLE) {
    return false;
  }
  if (controller._closeRequested) {
    return false;
  }
  if (!controller._started) {
    return false;
  }
  if (readableStreamHasDefaultReader(stream) && readableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }
  if (readableStreamHasBYOBReader(stream) && readableStreamGetNumReadIntoRequests(stream) > 0) {
    return true;
  }
  const desiredSize = readableByteStreamControllerGetDesiredSize(controller);
  return desiredSize > 0;
}

function readableByteStreamControllerCallPullIfNeeded(controller) {
  if (!readableByteStreamControllerShouldCallPull(controller)) {
    return;
  }
  if (controller._pulling) {
    controller._pullAgain = true;
    return;
  }
  controller._pulling = true;
  controller._pullAlgorithm().then(
    () => {
      controller._pulling = false;
      if (controller._pullAgain) {
        controller._pullAgain = false;
        readableByteStreamControllerCallPullIfNeeded(controller);
      }
    },
    e => {
      readableByteStreamControllerError(controller, e);
    }
  );
}

function transferArrayBuffer(buffer) {
  if (typeof buffer.transfer === "function") {
    return buffer.transfer();
  }
  // Fallback: copy
  const copy = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(copy).set(new Uint8Array(buffer));
  return copy;
}

function readableByteStreamControllerEnqueue(controller, chunk) {
  const stream = controller._stream;
  if (controller._closeRequested || stream._state !== STATE.READABLE) {
    return;
  }
  const { buffer } = chunk;
  const { byteOffset } = chunk;
  const { byteLength } = chunk;
  if (buffer.byteLength === 0 && typeof buffer.detached === "boolean" ? buffer.detached : false) {
    throw new TypeError("ArrayBuffer is detached.");
  }
  const transferredBuffer = transferArrayBuffer(buffer);

  if (controller._pendingPullIntos.length > 0) {
    const firstPendingPullInto = controller._pendingPullIntos[0];
    if (
      firstPendingPullInto.buffer.byteLength === 0 &&
      typeof firstPendingPullInto.buffer.detached === "boolean" &&
      firstPendingPullInto.buffer.detached
    ) {
      throw new TypeError("BYOB pull-into descriptor's buffer is detached.");
    }
    readableByteStreamControllerInvalidateBYOBRequest(controller);
    firstPendingPullInto.buffer = transferArrayBuffer(firstPendingPullInto.buffer);
    if (firstPendingPullInto.readerType === "none") {
      readableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstPendingPullInto);
    }
  }

  if (readableStreamHasDefaultReader(stream)) {
    readableByteStreamControllerProcessReadRequestsUsingQueue(controller);
    if (readableStreamGetNumReadRequests(stream) === 0) {
      readableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    } else {
      if (controller._pendingPullIntos.length > 0) {
        readableByteStreamControllerShiftPendingPullInto(controller);
      }
      const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
      readableStreamFulfillReadRequest(stream, transferredView, false);
    }
  } else if (readableStreamHasBYOBReader(stream)) {
    readableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    readableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
  } else {
    readableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
  }
  readableByteStreamControllerCallPullIfNeeded(controller);
}

function readableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
  controller._queue.push({ buffer, byteOffset, byteLength });
  controller._queueTotalSize += byteLength;
}

function readableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, pullIntoDescriptor) {
  if (pullIntoDescriptor.bytesFilled > 0) {
    readableByteStreamControllerEnqueueClonedChunkToQueue(
      controller,
      pullIntoDescriptor.buffer,
      pullIntoDescriptor.byteOffset,
      pullIntoDescriptor.bytesFilled
    );
  }
  readableByteStreamControllerShiftPendingPullInto(controller);
}

function readableByteStreamControllerEnqueueClonedChunkToQueue(controller, buffer, byteOffset, byteLength) {
  const cloneResult = buffer.slice(byteOffset, byteOffset + byteLength);
  controller._queue.push({ buffer: cloneResult, byteOffset: 0, byteLength });
  controller._queueTotalSize += byteLength;
}

function readableByteStreamControllerProcessReadRequestsUsingQueue(controller) {
  const reader = controller._stream._reader;
  while (reader._readRequests.length > 0) {
    if (controller._queueTotalSize === 0) {
      return;
    }
    const readRequest = reader._readRequests.shift();
    readableByteStreamControllerFillReadRequestFromQueue(controller, readRequest);
  }
}

function readableByteStreamControllerFillReadRequestFromQueue(controller, readRequest) {
  const entry = controller._queue.shift();
  controller._queueTotalSize -= entry.byteLength;
  readableByteStreamControllerHandleQueueDrain(controller);
  const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
  readRequest.chunkSteps(view);
}

function readableByteStreamControllerShiftPendingPullInto(controller) {
  readableByteStreamControllerInvalidateBYOBRequest(controller);
  return controller._pendingPullIntos.shift();
}

function readableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
  let done = false;
  if (stream._state === STATE.CLOSED) {
    done = true;
  }
  const filledView = readableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
  if (pullIntoDescriptor.readerType === "default") {
    readableStreamFulfillReadRequest(stream, filledView, done);
  } else {
    readableStreamFulfillReadIntoRequest(stream, filledView, done);
  }
}

function readableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
  const { bytesFilled } = pullIntoDescriptor;
  const { elementSize } = pullIntoDescriptor;
  const Ctor = pullIntoDescriptor.viewConstructor;
  return new Ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
}

function readableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
  const maxBytesToCopy = Math.min(
    controller._queueTotalSize,
    pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled
  );
  const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
  const remainder = maxBytesFilled % pullIntoDescriptor.elementSize;
  let totalBytesToCopyRemaining = maxBytesToCopy;
  let ready = false;
  if (maxBytesFilled >= pullIntoDescriptor.minimumFill) {
    totalBytesToCopyRemaining = maxBytesToCopy - remainder;
    ready = true;
  }
  const queue = controller._queue;
  while (totalBytesToCopyRemaining > 0) {
    const headOfQueue = queue[0];
    const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
    const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    const destBuffer = new Uint8Array(pullIntoDescriptor.buffer);
    const sourceView = new Uint8Array(headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
    destBuffer.set(sourceView, destStart);
    if (headOfQueue.byteLength === bytesToCopy) {
      queue.shift();
    } else {
      headOfQueue.byteOffset += bytesToCopy;
      headOfQueue.byteLength -= bytesToCopy;
    }
    controller._queueTotalSize -= bytesToCopy;
    pullIntoDescriptor.bytesFilled += bytesToCopy;
    totalBytesToCopyRemaining -= bytesToCopy;
  }
  return ready;
}

function readableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
  while (controller._pendingPullIntos.length > 0) {
    if (controller._queueTotalSize === 0) {
      return;
    }
    const pullIntoDescriptor = controller._pendingPullIntos[0];
    if (readableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
      readableByteStreamControllerShiftPendingPullInto(controller);
      readableByteStreamControllerCommitPullIntoDescriptor(controller._stream, pullIntoDescriptor);
    }
  }
}

function readableByteStreamControllerPullInto(controller, view, min, readIntoRequest) {
  const stream = controller._stream;
  let elementSize,
    ViewConstructor,
    buffer;
  if (view.constructor === DataView) {
    elementSize = 1;
    ViewConstructor = DataView;
  } else {
    elementSize = view.BYTES_PER_ELEMENT;
    ViewConstructor = view.constructor;
  }
  const minimumFill = min * elementSize;
  // Capture view's dimensions before transferring its buffer (after transfer, the view becomes detached and
  // byteLength/byteOffset both read as 0).
  const originalByteOffset = view.byteOffset;
  const originalByteLength = view.byteLength;
  try {
    buffer = transferArrayBuffer(view.buffer);
  } catch (e) {
    readIntoRequest.errorSteps(e);
    return;
  }
  const pullIntoDescriptor = {
    buffer,
    bufferByteLength: buffer.byteLength,
    byteOffset: originalByteOffset,
    byteLength: originalByteLength,
    bytesFilled: 0,
    minimumFill,
    elementSize,
    viewConstructor: ViewConstructor,
    readerType: "byob"
  };
  if (controller._pendingPullIntos.length > 0) {
    controller._pendingPullIntos.push(pullIntoDescriptor);
    readableStreamAddReadIntoRequest(stream, readIntoRequest);
    return;
  }
  if (stream._state === STATE.CLOSED) {
    const emptyView = new ViewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
    readIntoRequest.closeSteps(emptyView);
    return;
  }
  if (controller._queueTotalSize > 0) {
    if (readableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
      const filledView = readableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
      readableByteStreamControllerHandleQueueDrain(controller);
      readIntoRequest.chunkSteps(filledView);
      return;
    }
    if (controller._closeRequested) {
      const e = new TypeError("Insufficient bytes to fill elements in the given buffer.");
      readableByteStreamControllerError(controller, e);
      readIntoRequest.errorSteps(e);
      return;
    }
  }
  controller._pendingPullIntos.push(pullIntoDescriptor);
  readableStreamAddReadIntoRequest(stream, readIntoRequest);
  readableByteStreamControllerCallPullIfNeeded(controller);
}

function readableByteStreamControllerRespondInternal(controller, bytesWritten) {
  const firstDescriptor = controller._pendingPullIntos[0];
  const state = controller._stream._state;
  if (state === STATE.CLOSED) {
    if (bytesWritten !== 0) {
      throw new TypeError("bytesWritten must be 0 for a closed stream.");
    }
    readableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
  } else {
    readableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
  }
  readableByteStreamControllerCallPullIfNeeded(controller);
}

function readableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
  firstDescriptor.buffer = transferArrayBuffer(firstDescriptor.buffer);
  const stream = controller._stream;
  if (readableStreamHasBYOBReader(stream)) {
    while (readableStreamGetNumReadIntoRequests(stream) > 0) {
      const pullIntoDescriptor = readableByteStreamControllerShiftPendingPullInto(controller);
      readableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
    }
  }
}

function readableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
  if (pullIntoDescriptor.bytesFilled + bytesWritten > pullIntoDescriptor.byteLength) {
    throw new RangeError("bytesWritten exceeds the byte length of the view.");
  }
  readableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
  if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.minimumFill) {
    return;
  }
  readableByteStreamControllerShiftPendingPullInto(controller);
  const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
  if (remainderSize > 0) {
    const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    readableByteStreamControllerEnqueueClonedChunkToQueue(
      controller,
      pullIntoDescriptor.buffer,
      end - remainderSize,
      remainderSize
    );
  }
  pullIntoDescriptor.bytesFilled -= remainderSize;
  readableByteStreamControllerCommitPullIntoDescriptor(controller._stream, pullIntoDescriptor);
  readableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
}

function readableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
  readableByteStreamControllerInvalidateBYOBRequest(controller);
  pullIntoDescriptor.bytesFilled += size;
}

function readableByteStreamControllerRespond(controller, bytesWritten) {
  const firstDescriptor = controller._pendingPullIntos[0];
  const state = controller._stream._state;
  if (state === STATE.CLOSED) {
    if (bytesWritten !== 0) {
      throw new TypeError("bytesWritten must be 0 for a closed stream.");
    }
  } else if (bytesWritten === 0) {
    throw new TypeError("bytesWritten must not be 0 for a readable stream.");
  } else if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
    throw new RangeError("bytesWritten exceeds the byte length of the view.");
  }
  firstDescriptor.buffer = transferArrayBuffer(firstDescriptor.buffer);
  readableByteStreamControllerRespondInternal(controller, bytesWritten);
}

function readableByteStreamControllerRespondWithNewView(controller, view) {
  const firstDescriptor = controller._pendingPullIntos[0];
  const state = controller._stream._state;
  if (state === STATE.CLOSED) {
    if (view.byteLength !== 0) {
      throw new TypeError("view must have a byte length of 0 for a closed stream.");
    }
  } else if (view.byteLength === 0) {
    throw new TypeError("view must not have a byte length of 0 for a readable stream.");
  }
  if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
    throw new RangeError("view's byteOffset does not match the pull-into descriptor.");
  }
  if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
    throw new RangeError("view's buffer byteLength does not match the pull-into descriptor.");
  }
  if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
    throw new RangeError("view.byteLength exceeds the byte length of the descriptor.");
  }
  const viewByteLength = view.byteLength;
  firstDescriptor.buffer = transferArrayBuffer(view.buffer);
  readableByteStreamControllerRespondInternal(controller, viewByteLength);
}

function readableByteStreamControllerGetBYOBRequest(controller) {
  const ReadableStreamBYOBRequest = require("../../../generated/idl/ReadableStreamBYOBRequest");
  if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
    const firstDescriptor = controller._pendingPullIntos[0];
    const view = new Uint8Array(
      firstDescriptor.buffer,
      firstDescriptor.byteOffset + firstDescriptor.bytesFilled,
      firstDescriptor.byteLength - firstDescriptor.bytesFilled
    );
    const byobRequest = ReadableStreamBYOBRequest.createImpl(controller._stream._globalObject, [], {});
    byobRequest._controller = controller;
    byobRequest._view = view;
    controller._byobRequest = byobRequest;
  }
  return controller._byobRequest;
}

function byteControllerPullSteps(controller, readRequest) {
  const stream = controller._stream;
  if (controller._queueTotalSize > 0) {
    readableByteStreamControllerFillReadRequestFromQueue(controller, readRequest);
    return;
  }
  const autoAllocateChunkSize = controller._autoAllocateChunkSize;
  if (autoAllocateChunkSize !== undefined) {
    let buffer;
    try {
      buffer = new ArrayBuffer(autoAllocateChunkSize);
    } catch (e) {
      readRequest.errorSteps(e);
      return;
    }
    const pullIntoDescriptor = {
      buffer,
      bufferByteLength: autoAllocateChunkSize,
      byteOffset: 0,
      byteLength: autoAllocateChunkSize,
      bytesFilled: 0,
      minimumFill: 1,
      elementSize: 1,
      viewConstructor: Uint8Array,
      readerType: "default"
    };
    controller._pendingPullIntos.push(pullIntoDescriptor);
  }
  readableStreamAddReadRequest(stream, readRequest);
  readableByteStreamControllerCallPullIfNeeded(controller);
}

function byteControllerCancelSteps(controller, reason) {
  readableByteStreamControllerClearPendingPullIntos(controller);
  resetQueue(controller);
  const result = controller._cancelAlgorithm(reason);
  readableByteStreamControllerClearAlgorithms(controller);
  return result;
}

function byteControllerReleaseSteps(controller) {
  if (controller._pendingPullIntos.length > 0) {
    const firstPendingPullInto = controller._pendingPullIntos[0];
    firstPendingPullInto.readerType = "none";
    controller._pendingPullIntos = [firstPendingPullInto];
  }
}

function setUpReadableByteStreamController(
  stream,
  controller,
  startAlgorithm,
  pullAlgorithm,
  cancelAlgorithm,
  highWaterMark,
  autoAllocateChunkSize
) {
  controller._stream = stream;
  controller._pullAgain = false;
  controller._pulling = false;
  controller._byobRequest = null;
  controller._pendingPullIntos = [];
  resetQueue(controller);
  controller._closeRequested = false;
  controller._started = false;
  controller._strategyHWM = highWaterMark;
  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;
  controller._autoAllocateChunkSize = autoAllocateChunkSize;
  controller._pullSteps = readRequest => byteControllerPullSteps(controller, readRequest);
  controller._cancelSteps = reason => byteControllerCancelSteps(controller, reason);
  controller._releaseSteps = () => byteControllerReleaseSteps(controller);
  stream._controller = controller;
  const startResult = startAlgorithm();
  Promise.resolve(startResult).then(
    () => {
      controller._started = true;
      readableByteStreamControllerCallPullIfNeeded(controller);
    },
    r => {
      readableByteStreamControllerError(controller, r);
    }
  );
}

function setUpReadableByteStreamControllerFromUnderlyingSource(
  stream,
  underlyingSource,
  underlyingSourceDict,
  highWaterMark,
  globalObject
) {
  const ReadableByteStreamController = require("../../../generated/idl/ReadableByteStreamController");
  const controller = ReadableByteStreamController.createImpl(globalObject, [], {});

  function startAlgorithm() {
    if (underlyingSourceDict.start === undefined) {
      return undefined;
    }
    return underlyingSourceDict.start.call(underlyingSource, getControllerWrapper(controller));
  }
  function pullAlgorithm() {
    if (underlyingSourceDict.pull === undefined) {
      return resolvedPromise(globalObject, undefined);
    }
    try {
      return Promise.resolve(underlyingSourceDict.pull.call(underlyingSource, getControllerWrapper(controller)));
    } catch (e) {
      return rejectedPromise(globalObject, e);
    }
  }
  function cancelAlgorithm(reason) {
    if (underlyingSourceDict.cancel === undefined) {
      return resolvedPromise(globalObject, undefined);
    }
    try {
      return Promise.resolve(underlyingSourceDict.cancel.call(underlyingSource, reason));
    } catch (e) {
      return rejectedPromise(globalObject, e);
    }
  }
  const { autoAllocateChunkSize } = underlyingSourceDict;
  if (autoAllocateChunkSize === 0) {
    throw new TypeError("autoAllocateChunkSize must not be 0.");
  }
  setUpReadableByteStreamController(
    stream,
    controller,
    startAlgorithm,
    pullAlgorithm,
    cancelAlgorithm,
    highWaterMark,
    autoAllocateChunkSize
  );
}

// Underlying source dict normalization
function convertUnderlyingDefaultOrByteSource(underlyingSource) {
  if (underlyingSource === undefined || underlyingSource === null) {
    return {};
  }
  const dict = {};
  if ("start" in underlyingSource) {
    const { start } = underlyingSource;
    if (typeof start !== "function") {
      throw new TypeError("underlyingSource.start must be a function.");
    }
    dict.start = start;
  }
  if ("pull" in underlyingSource) {
    const { pull } = underlyingSource;
    if (typeof pull !== "function") {
      throw new TypeError("underlyingSource.pull must be a function.");
    }
    dict.pull = pull;
  }
  if ("cancel" in underlyingSource) {
    const { cancel } = underlyingSource;
    if (typeof cancel !== "function") {
      throw new TypeError("underlyingSource.cancel must be a function.");
    }
    dict.cancel = cancel;
  }
  if ("type" in underlyingSource && underlyingSource.type !== undefined) {
    const type = String(underlyingSource.type);
    if (type !== "bytes") {
      throw new TypeError(`underlyingSource.type must be "bytes" if specified.`);
    }
    dict.type = "bytes";
  }
  if ("autoAllocateChunkSize" in underlyingSource && underlyingSource.autoAllocateChunkSize !== undefined) {
    const value = Number(underlyingSource.autoAllocateChunkSize);
    if (!Number.isInteger(value) || value <= 0) {
      throw new TypeError("autoAllocateChunkSize must be a positive integer.");
    }
    dict.autoAllocateChunkSize = value;
  }
  return dict;
}

function getControllerWrapper(controllerImpl) {
  const utils = require("../../../generated/idl/utils");
  const wrapper = utils.wrapperForImpl(controllerImpl);
  return wrapper === undefined ? controllerImpl : wrapper;
}

// --- Internal stream/reader creation (used by tee) -------------------------

function createReadableStream(
  globalObject,
  startAlgorithm,
  pullAlgorithm,
  cancelAlgorithm,
  highWaterMark,
  sizeAlgorithm
) {
  const ReadableStream = require("../../../generated/idl/ReadableStream");
  const ReadableStreamDefaultController = require("../../../generated/idl/ReadableStreamDefaultController");
  const streamImpl = ReadableStream.createImpl(globalObject, [
    {
      start: () => {},
      pull: () => {},
      cancel: () => {}
    }, {}
  ], {});
  // Wipe out the controller wired up by the public constructor, then re-wire with our internal algorithms.
  streamImpl._controller = undefined;
  const controller = ReadableStreamDefaultController.createImpl(globalObject, [], {});
  setUpReadableStreamDefaultController(
    streamImpl,
    controller,
    startAlgorithm,
    pullAlgorithm,
    cancelAlgorithm,
    highWaterMark === undefined ? 1 : highWaterMark,
    sizeAlgorithm === undefined ? () => 1 : sizeAlgorithm
  );
  return streamImpl;
}

function createReadableByteStream(globalObject, startAlgorithm, pullAlgorithm, cancelAlgorithm) {
  const ReadableStream = require("../../../generated/idl/ReadableStream");
  const ReadableByteStreamController = require("../../../generated/idl/ReadableByteStreamController");
  const streamImpl = ReadableStream.createImpl(globalObject, [
    {
      type: "bytes",
      start: () => {},
      pull: () => {},
      cancel: () => {}
    }, {}
  ], {});
  streamImpl._controller = undefined;
  const controller = ReadableByteStreamController.createImpl(globalObject, [], {});
  setUpReadableByteStreamController(
    streamImpl,
    controller,
    startAlgorithm,
    pullAlgorithm,
    cancelAlgorithm,
    0,
    undefined
  );
  return streamImpl;
}

function acquireReadableStreamDefaultReader(stream) {
  const ReadableStreamDefaultReader = require("../../../generated/idl/ReadableStreamDefaultReader");
  const utils = require("../../../generated/idl/utils");
  const streamWrapper = utils.wrapperForImpl(stream);
  return ReadableStreamDefaultReader.createImpl(stream._globalObject, [streamWrapper], {});
}

function acquireReadableStreamBYOBReader(stream) {
  const ReadableStreamBYOBReader = require("../../../generated/idl/ReadableStreamBYOBReader");
  const utils = require("../../../generated/idl/utils");
  const streamWrapper = utils.wrapperForImpl(stream);
  return ReadableStreamBYOBReader.createImpl(stream._globalObject, [streamWrapper], {});
}

function cloneAsUint8Array(chunk) {
  const copy = new ArrayBuffer(chunk.byteLength);
  new Uint8Array(copy).set(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
  return new Uint8Array(copy);
}

// --- tee --------------------------------------------------------------------

function readableStreamTee(stream) {
  if (stream._controller._pendingPullIntos !== undefined) {
    return readableByteStreamTee(stream);
  }
  return readableStreamDefaultTee(stream);
}

function readableStreamDefaultTee(stream) {
  const globalObject = stream._globalObject;
  const reader = acquireReadableStreamDefaultReader(stream);

  let reading = false;
  let readAgain = false;
  let canceled1 = false;
  let canceled2 = false;
  let reason1,
    reason2,
    branch1,
    branch2;

  const cancelCapability = newPromiseCapability(globalObject);

  function pullAlgorithm() {
    if (reading) {
      readAgain = true;
      return resolvedPromise(globalObject, undefined);
    }
    reading = true;
    const readRequest = {
      chunkSteps(chunk) {
        queueMicrotask(() => {
          readAgain = false;
          if (!canceled1) {
            readableStreamDefaultControllerEnqueue(branch1._controller, chunk);
          }
          if (!canceled2) {
            readableStreamDefaultControllerEnqueue(branch2._controller, chunk);
          }
          reading = false;
          if (readAgain) {
            pullAlgorithm();
          }
        });
      },
      closeSteps() {
        reading = false;
        if (!canceled1) {
          readableStreamDefaultControllerClose(branch1._controller);
        }
        if (!canceled2) {
          readableStreamDefaultControllerClose(branch2._controller);
        }
        if (!canceled1 || !canceled2) {
          cancelCapability.resolve(undefined);
        }
      },
      errorSteps() {
        reading = false;
      }
    };
    readableStreamDefaultReaderRead(reader, readRequest);
    return resolvedPromise(globalObject, undefined);
  }

  function cancel1Algorithm(reason) {
    canceled1 = true;
    reason1 = reason;
    if (canceled2) {
      const cancelResult = readableStreamCancel(stream, [reason1, reason2]);
      cancelResult.then(() => cancelCapability.resolve(undefined), e => cancelCapability.reject(e));
    }
    return cancelCapability.promise;
  }

  function cancel2Algorithm(reason) {
    canceled2 = true;
    reason2 = reason;
    if (canceled1) {
      const cancelResult = readableStreamCancel(stream, [reason1, reason2]);
      cancelResult.then(() => cancelCapability.resolve(undefined), e => cancelCapability.reject(e));
    }
    return cancelCapability.promise;
  }

  function startAlgorithm() {}

  branch1 = createReadableStream(globalObject, startAlgorithm, pullAlgorithm, cancel1Algorithm);
  branch2 = createReadableStream(globalObject, startAlgorithm, pullAlgorithm, cancel2Algorithm);

  reader._closedPromise.promise.then(undefined, r => {
    readableStreamDefaultControllerError(branch1._controller, r);
    readableStreamDefaultControllerError(branch2._controller, r);
    if (!canceled1 || !canceled2) {
      cancelCapability.resolve(undefined);
    }
  });
  markPromiseHandled(cancelCapability.promise);

  return [branch1, branch2];
}

function readableByteStreamTee(stream) {
  const globalObject = stream._globalObject;
  let reader = acquireReadableStreamDefaultReader(stream);

  let reading = false;
  let readAgainForBranch1 = false;
  let readAgainForBranch2 = false;
  let canceled1 = false;
  let canceled2 = false;
  let reason1,
    reason2,
    branch1,
    branch2;

  const cancelCapability = newPromiseCapability(globalObject);

  function forwardReaderError(thisReader) {
    thisReader._closedPromise.promise.then(undefined, r => {
      if (thisReader !== reader) {
        return;
      }
      readableByteStreamControllerError(branch1._controller, r);
      readableByteStreamControllerError(branch2._controller, r);
      if (!canceled1 || !canceled2) {
        cancelCapability.resolve(undefined);
      }
    });
  }

  function pullWithDefaultReader() {
    if (reader._readerType === READER.BYOB) {
      readableStreamReaderGenericRelease(reader);
      reader = acquireReadableStreamDefaultReader(stream);
      forwardReaderError(reader);
    }
    const readRequest = {
      chunkSteps(chunk) {
        queueMicrotask(() => {
          readAgainForBranch1 = false;
          readAgainForBranch2 = false;
          const chunk1 = chunk;
          let chunk2 = chunk;
          if (!canceled1 && !canceled2) {
            try {
              chunk2 = cloneAsUint8Array(chunk);
            } catch (cloneE) {
              readableByteStreamControllerError(branch1._controller, cloneE);
              readableByteStreamControllerError(branch2._controller, cloneE);
              const cancelResult = readableStreamCancel(stream, cloneE);
              cancelResult.then(() => cancelCapability.resolve(undefined), e => cancelCapability.reject(e));
              return;
            }
          }
          if (!canceled1) {
            readableByteStreamControllerEnqueue(branch1._controller, chunk1);
          }
          if (!canceled2) {
            readableByteStreamControllerEnqueue(branch2._controller, chunk2);
          }
          reading = false;
          if (readAgainForBranch1) {
            pull1Algorithm();
          } else if (readAgainForBranch2) {
            pull2Algorithm();
          }
        });
      },
      closeSteps() {
        reading = false;
        if (!canceled1) {
          readableByteStreamControllerClose(branch1._controller);
        }
        if (!canceled2) {
          readableByteStreamControllerClose(branch2._controller);
        }
        if (branch1._controller._pendingPullIntos.length > 0) {
          readableByteStreamControllerRespond(branch1._controller, 0);
        }
        if (branch2._controller._pendingPullIntos.length > 0) {
          readableByteStreamControllerRespond(branch2._controller, 0);
        }
        if (!canceled1 || !canceled2) {
          cancelCapability.resolve(undefined);
        }
      },
      errorSteps() {
        reading = false;
      }
    };
    readableStreamDefaultReaderRead(reader, readRequest);
  }

  function pullWithBYOBReader(view, forBranch2) {
    if (reader._readerType === READER.DEFAULT) {
      readableStreamReaderGenericRelease(reader);
      reader = acquireReadableStreamBYOBReader(stream);
      forwardReaderError(reader);
    }
    const byobBranch = forBranch2 ? branch2 : branch1;
    const otherBranch = forBranch2 ? branch1 : branch2;
    const readIntoRequest = {
      chunkSteps(chunk) {
        queueMicrotask(() => {
          readAgainForBranch1 = false;
          readAgainForBranch2 = false;
          const byobCanceled = forBranch2 ? canceled2 : canceled1;
          const otherCanceled = forBranch2 ? canceled1 : canceled2;
          if (!otherCanceled) {
            let clonedChunk;
            try {
              clonedChunk = cloneAsUint8Array(chunk);
            } catch (cloneE) {
              readableByteStreamControllerError(byobBranch._controller, cloneE);
              readableByteStreamControllerError(otherBranch._controller, cloneE);
              const cancelResult = readableStreamCancel(stream, cloneE);
              cancelResult.then(() => cancelCapability.resolve(undefined), e => cancelCapability.reject(e));
              return;
            }
            if (!byobCanceled) {
              readableByteStreamControllerRespondWithNewView(byobBranch._controller, chunk);
            }
            readableByteStreamControllerEnqueue(otherBranch._controller, clonedChunk);
          } else if (!byobCanceled) {
            readableByteStreamControllerRespondWithNewView(byobBranch._controller, chunk);
          }
          reading = false;
          if (readAgainForBranch1) {
            pull1Algorithm();
          } else if (readAgainForBranch2) {
            pull2Algorithm();
          }
        });
      },
      closeSteps(chunk) {
        reading = false;
        const byobCanceled = forBranch2 ? canceled2 : canceled1;
        const otherCanceled = forBranch2 ? canceled1 : canceled2;
        if (!byobCanceled) {
          readableByteStreamControllerClose(byobBranch._controller);
        }
        if (!otherCanceled) {
          readableByteStreamControllerClose(otherBranch._controller);
        }
        if (chunk !== undefined) {
          if (!byobCanceled) {
            readableByteStreamControllerRespondWithNewView(byobBranch._controller, chunk);
          }
          if (!otherCanceled && otherBranch._controller._pendingPullIntos.length > 0) {
            readableByteStreamControllerRespond(otherBranch._controller, 0);
          }
        }
        if (!byobCanceled || !otherCanceled) {
          cancelCapability.resolve(undefined);
        }
      },
      errorSteps() {
        reading = false;
      }
    };
    readableStreamBYOBReaderRead(reader, view, 1, readIntoRequest);
  }

  function pull1Algorithm() {
    if (reading) {
      readAgainForBranch1 = true;
      return resolvedPromise(globalObject, undefined);
    }
    reading = true;
    const byobRequest = readableByteStreamControllerGetBYOBRequest(branch1._controller);
    if (byobRequest === null) {
      pullWithDefaultReader();
    } else {
      pullWithBYOBReader(byobRequest._view, false);
    }
    return resolvedPromise(globalObject, undefined);
  }

  function pull2Algorithm() {
    if (reading) {
      readAgainForBranch2 = true;
      return resolvedPromise(globalObject, undefined);
    }
    reading = true;
    const byobRequest = readableByteStreamControllerGetBYOBRequest(branch2._controller);
    if (byobRequest === null) {
      pullWithDefaultReader();
    } else {
      pullWithBYOBReader(byobRequest._view, true);
    }
    return resolvedPromise(globalObject, undefined);
  }

  function cancel1Algorithm(reason) {
    canceled1 = true;
    reason1 = reason;
    if (canceled2) {
      const cancelResult = readableStreamCancel(stream, [reason1, reason2]);
      cancelResult.then(() => cancelCapability.resolve(undefined), e => cancelCapability.reject(e));
    }
    return cancelCapability.promise;
  }

  function cancel2Algorithm(reason) {
    canceled2 = true;
    reason2 = reason;
    if (canceled1) {
      const cancelResult = readableStreamCancel(stream, [reason1, reason2]);
      cancelResult.then(() => cancelCapability.resolve(undefined), e => cancelCapability.reject(e));
    }
    return cancelCapability.promise;
  }

  function startAlgorithm() {}

  branch1 = createReadableByteStream(globalObject, startAlgorithm, pull1Algorithm, cancel1Algorithm);
  branch2 = createReadableByteStream(globalObject, startAlgorithm, pull2Algorithm, cancel2Algorithm);
  forwardReaderError(reader);
  markPromiseHandled(cancelCapability.promise);

  return [branch1, branch2];
}

module.exports = {
  STATE,
  READER,
  newPromiseCapability,
  resolvedPromise,
  rejectedPromise,
  markPromiseHandled,

  extractHighWaterMark,
  extractSizeAlgorithm,
  convertUnderlyingDefaultOrByteSource,

  initializeReadableStream,
  isReadableStreamLocked,
  readableStreamCancel,
  readableStreamClose,
  readableStreamError,

  readableStreamReaderGenericInitialize,
  readableStreamReaderGenericCancel,
  readableStreamReaderGenericRelease,
  readableStreamDefaultReaderRelease,
  readableStreamBYOBReaderRelease,
  readableStreamDefaultReaderRead,
  readableStreamBYOBReaderRead,

  readableStreamDefaultControllerCanCloseOrEnqueue,
  readableStreamDefaultControllerGetDesiredSize,
  readableStreamDefaultControllerClose,
  readableStreamDefaultControllerEnqueue,
  readableStreamDefaultControllerError,
  setUpReadableStreamDefaultControllerFromUnderlyingSource,

  readableByteStreamControllerCanCloseOrEnqueue,
  readableByteStreamControllerGetDesiredSize,
  readableByteStreamControllerClose,
  readableByteStreamControllerEnqueue,
  readableByteStreamControllerError,
  readableByteStreamControllerRespond,
  readableByteStreamControllerRespondWithNewView,
  readableByteStreamControllerGetBYOBRequest,
  setUpReadableByteStreamControllerFromUnderlyingSource,

  readableStreamTee
};
