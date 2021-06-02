'use strict';
const assert = require('assert');
const verbose = require('debug')('streams:transform-stream:verbose');

const { promiseResolvedWith, promiseRejectedWith, newPromise, resolvePromise, transformPromiseWith } =
  require('../helpers/webidl.js');
const { CreateReadableStream, ReadableStreamDefaultControllerClose, ReadableStreamDefaultControllerEnqueue,
        ReadableStreamDefaultControllerError, ReadableStreamDefaultControllerHasBackpressure,
        ReadableStreamDefaultControllerCanCloseOrEnqueue } = require('./readable-streams.js');
const { CreateWritableStream, WritableStreamDefaultControllerErrorIfNeeded } = require('./writable-streams.js');

const TransformStream = require('../../../../generated/TransformStream.js');
const TransformStreamDefaultController = require('../../../../generated/TransformStreamDefaultController.js');

Object.assign(exports, {
  InitializeTransformStream,
  SetUpTransformStreamDefaultControllerFromTransformer,
  TransformStreamDefaultControllerEnqueue,
  TransformStreamDefaultControllerError,
  TransformStreamDefaultControllerTerminate
});

// Working with transform streams

// CreateTransformStream is not implemented since it is only meant for external specs.

function InitializeTransformStream(
  globalObject,
  stream,
  startPromise,
  writableHighWaterMark,
  writableSizeAlgorithm,
  readableHighWaterMark,
  readableSizeAlgorithm
) {
  function startAlgorithm() {
    return startPromise;
  }

  function writeAlgorithm(chunk) {
    return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
  }

  function abortAlgorithm(reason) {
    return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
  }

  function closeAlgorithm() {
    return TransformStreamDefaultSinkCloseAlgorithm(stream);
  }

  stream._writable = CreateWritableStream(
    globalObject,
    startAlgorithm,
    writeAlgorithm,
    closeAlgorithm,
    abortAlgorithm,
    writableHighWaterMark,
    writableSizeAlgorithm
  );

  function pullAlgorithm() {
    return TransformStreamDefaultSourcePullAlgorithm(stream);
  }

  function cancelAlgorithm(reason) {
    TransformStreamErrorWritableAndUnblockWrite(stream, reason);
    return promiseResolvedWith(undefined);
  }

  stream._readable = CreateReadableStream(
    globalObject, startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm
  );

  // The [[backpressure]] slot is set to undefined so that it can be initialised by TransformStreamSetBackpressure.
  stream._backpressure = undefined;
  stream._backpressureChangePromise = undefined;
  TransformStreamSetBackpressure(stream, true);

  stream._controller = undefined;
}

function TransformStreamError(stream, e) {
  verbose('TransformStreamError()');

  ReadableStreamDefaultControllerError(stream._readable._controller, e);
  TransformStreamErrorWritableAndUnblockWrite(stream, e);
}

function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
  TransformStreamDefaultControllerClearAlgorithms(stream._controller);
  WritableStreamDefaultControllerErrorIfNeeded(stream._writable._controller, e);
  if (stream._backpressure === true) {
    // Pretend that pull() was called to permit any pending write() calls to complete. TransformStreamSetBackpressure()
    // cannot be called from enqueue() or pull() once the ReadableStream is errored, so this will will be the final time
    // _backpressure is set.
    TransformStreamSetBackpressure(stream, false);
  }
}

function TransformStreamSetBackpressure(stream, backpressure) {
  verbose(`TransformStreamSetBackpressure() [backpressure = ${backpressure}]`);

  // Passes also when called during construction.
  assert(stream._backpressure !== backpressure);

  if (stream._backpressureChangePromise !== undefined) {
    resolvePromise(stream._backpressureChangePromise, undefined);
  }

  stream._backpressureChangePromise = newPromise();

  stream._backpressure = backpressure;
}

// Default controllers

function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
  assert(TransformStream.isImpl(stream));
  assert(stream._controller === undefined);

  controller._stream = stream;
  stream._controller = controller;

  controller._transformAlgorithm = transformAlgorithm;
  controller._flushAlgorithm = flushAlgorithm;
}

function SetUpTransformStreamDefaultControllerFromTransformer(globalObject, stream, transformer, transformerDict) {
  const controller = TransformStreamDefaultController.new(globalObject);

  let transformAlgorithm = chunk => {
    try {
      TransformStreamDefaultControllerEnqueue(controller, chunk);
      return promiseResolvedWith(undefined);
    } catch (transformResultE) {
      return promiseRejectedWith(transformResultE);
    }
  };

  let flushAlgorithm = () => promiseResolvedWith(undefined);

  if ('transform' in transformerDict) {
    transformAlgorithm = chunk => transformerDict.transform.call(transformer, chunk, controller);
  }
  if ('flush' in transformerDict) {
    flushAlgorithm = () => transformerDict.flush.call(transformer, controller);
  }

  SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
}

function TransformStreamDefaultControllerClearAlgorithms(controller) {
  controller._transformAlgorithm = undefined;
  controller._flushAlgorithm = undefined;
}

function TransformStreamDefaultControllerEnqueue(controller, chunk) {
  verbose('TransformStreamDefaultControllerEnqueue()');

  const stream = controller._stream;
  const readableController = stream._readable._controller;
  if (ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController) === false) {
    throw new TypeError('Readable side is not in a state that permits enqueue');
  }

  // We throttle transform invocations based on the backpressure of the ReadableStream, but we still
  // accept TransformStreamDefaultControllerEnqueue() calls.

  try {
    ReadableStreamDefaultControllerEnqueue(readableController, chunk);
  } catch (e) {
    // This happens when readableStrategy.size() throws.
    TransformStreamErrorWritableAndUnblockWrite(stream, e);

    throw stream._readable._storedError;
  }

  const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
  if (backpressure !== stream._backpressure) {
    assert(backpressure === true);
    TransformStreamSetBackpressure(stream, true);
  }
}

function TransformStreamDefaultControllerError(controller, e) {
  TransformStreamError(controller._stream, e);
}

function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
  const transformPromise = controller._transformAlgorithm(chunk);
  return transformPromiseWith(transformPromise, undefined, r => {
    TransformStreamError(controller._stream, r);
    throw r;
  });
}

function TransformStreamDefaultControllerTerminate(controller) {
  verbose('TransformStreamDefaultControllerTerminate()');

  const stream = controller._stream;
  const readableController = stream._readable._controller;

  ReadableStreamDefaultControllerClose(readableController);

  const error = new TypeError('TransformStream terminated');
  TransformStreamErrorWritableAndUnblockWrite(stream, error);
}

// Default sinks

function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
  verbose('TransformStreamDefaultSinkWriteAlgorithm()');

  assert(stream._writable._state === 'writable');

  const controller = stream._controller;

  if (stream._backpressure === true) {
    const backpressureChangePromise = stream._backpressureChangePromise;
    assert(backpressureChangePromise !== undefined);
    return transformPromiseWith(backpressureChangePromise, () => {
      const writable = stream._writable;
      const state = writable._state;
      if (state === 'erroring') {
        throw writable._storedError;
      }
      assert(state === 'writable');
      return TransformStreamDefaultControllerPerformTransform(controller, chunk);
    });
  }

  return TransformStreamDefaultControllerPerformTransform(controller, chunk);
}

function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
  // abort() is not called synchronously, so it is possible for abort() to be called when the stream is already
  // errored.
  TransformStreamError(stream, reason);
  return promiseResolvedWith(undefined);
}

function TransformStreamDefaultSinkCloseAlgorithm(stream) {
  verbose('TransformStreamDefaultSinkCloseAlgorithm()');

  // stream._readable cannot change after construction, so caching it across a call to user code is safe.
  const readable = stream._readable;

  const controller = stream._controller;
  const flushPromise = controller._flushAlgorithm();
  TransformStreamDefaultControllerClearAlgorithms(controller);

  // Return a promise that is fulfilled with undefined on success.
  return transformPromiseWith(flushPromise, () => {
    if (readable._state === 'errored') {
      throw readable._storedError;
    }
    ReadableStreamDefaultControllerClose(readable._controller);
  }, r => {
    TransformStreamError(stream, r);
    throw readable._storedError;
  });
}

// Default sources

function TransformStreamDefaultSourcePullAlgorithm(stream) {
  verbose('TransformStreamDefaultSourcePullAlgorithm()');

  // Invariant. Enforced by the promises returned by start() and pull().
  assert(stream._backpressure === true);

  assert(stream._backpressureChangePromise !== undefined);

  TransformStreamSetBackpressure(stream, false);

  // Prevent the next pull() call until there is backpressure.
  return stream._backpressureChangePromise;
}
