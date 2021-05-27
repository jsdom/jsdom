// Quick and dirty polyfill for TransformStream.
// Based on the reference implementation:
// https://github.com/whatwg/streams/blob/main/reference-implementation/lib/transform-stream.js

(function() {
'use strict';

if ('TransformStream' in self) {
  return;
}

// Methods on the transform stream controller object

function TransformStreamCloseReadable(transformStream) {
  if (transformStream._errored === true) {
    throw new TypeError('TransformStream is already errored');
  }

  if (transformStream._readableClosed === true) {
    throw new TypeError('Readable side is already closed');
  }

  TransformStreamCloseReadableInternal(transformStream);
}

function TransformStreamEnqueueToReadable(transformStream, chunk) {
  if (transformStream._errored === true) {
    throw new TypeError('TransformStream is already errored');
  }

  if (transformStream._readableClosed === true) {
    throw new TypeError('Readable side is already closed');
  }

  // We throttle transformer.transform invocation based on the backpressure of the ReadableStream, but we still
  // accept TransformStreamEnqueueToReadable() calls.

  const controller = transformStream._readableController;

  try {
    ReadableStreamDefaultControllerEnqueue(controller, chunk);
  } catch (e) {
    // This happens when readableStrategy.size() throws.
    // The ReadableStream has already errored itself.
    transformStream._readableClosed = true;
    TransformStreamErrorIfNeeded(transformStream, e);

    throw transformStream._storedError;
  }

  const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
  const maybeBackpressure = desiredSize <= 0;

  if (maybeBackpressure === true && transformStream._backpressure === false) {
    // This allows pull() again. When desiredSize is 0, it's possible that a pull() will happen immediately (but
    // asynchronously) after this because of pending read()s and set _backpressure back to false.
    //
    // If pull() could be called from inside enqueue(), then this logic would be wrong. This cannot happen
    // because there is always a promise pending from start() or pull() when _backpressure is false.
    TransformStreamSetBackpressure(transformStream, true);
  }
}

function TransformStreamError(transformStream, e) {
  if (transformStream._errored === true) {
    throw new TypeError('TransformStream is already errored');
  }

  TransformStreamErrorInternal(transformStream, e);
}

// Abstract operations.

function TransformStreamCloseReadableInternal(transformStream) {
  ReadableStreamDefaultControllerClose(transformStream._readableController);

  transformStream._readableClosed = true;
}

function TransformStreamErrorIfNeeded(transformStream, e) {
  if (transformStream._errored === false) {
    TransformStreamErrorInternal(transformStream, e);
  }
}

function TransformStreamErrorInternal(transformStream, e) {
  transformStream._errored = true;
  transformStream._storedError = e;

  if (transformStream._writableDone === false) {
    WritableStreamDefaultControllerError(transformStream._writableController, e);
  }
  if (transformStream._readableClosed === false) {
    ReadableStreamDefaultControllerError(transformStream._readableController, e);
  }
}

// Used for preventing the next write() call on TransformStreamSink until there
// is no longer backpressure.
function TransformStreamReadableReadyPromise(transformStream) {
  if (transformStream._backpressure === false) {
    return Promise.resolve();
  }

  return transformStream._backpressureChangePromise;
}

function TransformStreamSetBackpressure(transformStream, backpressure) {
  // Passes also when called during construction.

  if (transformStream._backpressureChangePromise !== undefined) {
    // The fulfillment value is just for a sanity check.
    transformStream._backpressureChangePromise_resolve(backpressure);
  }

  transformStream._backpressureChangePromise = new Promise(resolve => {
    transformStream._backpressureChangePromise_resolve = resolve;
  });

  transformStream._backpressureChangePromise.then(resolution => {
  });

  transformStream._backpressure = backpressure;
}

function TransformStreamDefaultTransform(chunk, transformStreamController) {
  const transformStream = transformStreamController._controlledTransformStream;
  TransformStreamEnqueueToReadable(transformStream, chunk);
  return Promise.resolve();
}

function TransformStreamTransform(transformStream, chunk) {
  transformStream._transforming = true;

  const transformer = transformStream._transformer;
  const controller = transformStream._transformStreamController;

  const transformPromise = PromiseInvokeOrPerformFallback(transformer, 'transform', [chunk, controller],
                             TransformStreamDefaultTransform, [chunk, controller]);

  return transformPromise.then(
    () => {
      transformStream._transforming = false;

      return TransformStreamReadableReadyPromise(transformStream);
    },
    e => {
      TransformStreamErrorIfNeeded(transformStream, e);
      return Promise.reject(e);
    });
}

function IsTransformStreamDefaultController(x) {
  if (!typeIsObject(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_controlledTransformStream')) {
    return false;
  }

  return true;
}

function IsTransformStream(x) {
  if (!typeIsObject(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_transformStreamController')) {
    return false;
  }

  return true;
}

class TransformStreamSink {
  constructor(transformStream, startPromise) {
    this._transformStream = transformStream;
    this._startPromise = startPromise;
  }

  start(c) {
    const transformStream = this._transformStream;

    transformStream._writableController = c;

    return this._startPromise.then(() => TransformStreamReadableReadyPromise(transformStream));
  }

  write(chunk) {
    const transformStream = this._transformStream;

    return TransformStreamTransform(transformStream, chunk);
  }

  abort() {
    const transformStream = this._transformStream;
    transformStream._writableDone = true;
    TransformStreamErrorInternal(transformStream, new TypeError('Writable side aborted'));
  }

  close() {
    const transformStream = this._transformStream;

    transformStream._writableDone = true;

    const flushPromise = PromiseInvokeOrNoop(transformStream._transformer,
                         'flush', [transformStream._transformStreamController]);
    // Return a promise that is fulfilled with undefined on success.
    return flushPromise.then(() => {
      if (transformStream._errored === true) {
        return Promise.reject(transformStream._storedError);
      }
      if (transformStream._readableClosed === false) {
        TransformStreamCloseReadableInternal(transformStream);
      }
      return Promise.resolve();
    }).catch(r => {
      TransformStreamErrorIfNeeded(transformStream, r);
      return Promise.reject(transformStream._storedError);
    });
  }
}

class TransformStreamSource {
  constructor(transformStream, startPromise) {
    this._transformStream = transformStream;
    this._startPromise = startPromise;
  }

  start(c) {
    const transformStream = this._transformStream;

    transformStream._readableController = c;

    return this._startPromise.then(() => {
      // Prevent the first pull() call until there is backpressure.

      if (transformStream._backpressure === true) {
        return Promise.resolve();
      }

      return transformStream._backpressureChangePromise;
    });
  }

  pull() {
    const transformStream = this._transformStream;

    // Invariant. Enforced by the promises returned by start() and pull().

    TransformStreamSetBackpressure(transformStream, false);

    // Prevent the next pull() call until there is backpressure.
    return transformStream._backpressureChangePromise;
  }

  cancel() {
    const transformStream = this._transformStream;
    transformStream._readableClosed = true;
    TransformStreamErrorInternal(transformStream, new TypeError('Readable side canceled'));
  }
}

class TransformStreamDefaultController {
  constructor(transformStream) {
    if (IsTransformStream(transformStream) === false) {
      throw new TypeError('TransformStreamDefaultController can only be ' +
                          'constructed with a TransformStream instance');
    }

    if (transformStream._transformStreamController !== undefined) {
      throw new TypeError('TransformStreamDefaultController instances can ' +
                          'only be created by the TransformStream constructor');
    }

    this._controlledTransformStream = transformStream;
  }

  get desiredSize() {
    if (IsTransformStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException('desiredSize');
    }

    const transformStream = this._controlledTransformStream;
    const readableController = transformStream._readableController;

    return ReadableStreamDefaultControllerGetDesiredSize(readableController);
  }

  enqueue(chunk) {
    if (IsTransformStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException('enqueue');
    }

    TransformStreamEnqueueToReadable(this._controlledTransformStream, chunk);
  }

  close() {
    if (IsTransformStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException('close');
    }

    TransformStreamCloseReadable(this._controlledTransformStream);
  }

  error(reason) {
    if (IsTransformStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException('error');
    }

    TransformStreamError(this._controlledTransformStream, reason);
  }
}

class TransformStream {
  constructor(transformer = {}) {
    this._transformer = transformer;
    const { readableStrategy, writableStrategy } = transformer;

    this._transforming = false;
    this._errored = false;
    this._storedError = undefined;

    this._writableController = undefined;
    this._readableController = undefined;
    this._transformStreamController = undefined;

    this._writableDone = false;
    this._readableClosed = false;

    this._backpressure = undefined;
    this._backpressureChangePromise = undefined;
    this._backpressureChangePromise_resolve = undefined;

    this._transformStreamController = new TransformStreamDefaultController(this);

    let startPromise_resolve;
    const startPromise = new Promise(resolve => {
      startPromise_resolve = resolve;
    });

    const source = new TransformStreamSource(this, startPromise);

    this._readable = new ReadableStream(source, readableStrategy);

    const sink = new TransformStreamSink(this, startPromise);

    this._writable = new WritableStream(sink, writableStrategy);

    const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(this._readableController);
    // Set _backpressure based on desiredSize. As there is no read() at this point, we can just interpret
    // desiredSize being non-positive as backpressure.
    TransformStreamSetBackpressure(this, desiredSize <= 0);

    const transformStream = this;
    const startResult = InvokeOrNoop(transformer, 'start',
                          [transformStream._transformStreamController]);
    startPromise_resolve(startResult);
    startPromise.catch(e => {
      // The underlyingSink and underlyingSource will error the readable and writable ends on their own.
      if (transformStream._errored === false) {
        transformStream._errored = true;
        transformStream._storedError = e;
      }
    });
  }

  get readable() {
    if (IsTransformStream(this) === false) {
      throw streamBrandCheckException('readable');
    }

    return this._readable;
  }

  get writable() {
    if (IsTransformStream(this) === false) {
      throw streamBrandCheckException('writable');
    }

    return this._writable;
  }
}

// Helper functions for the TransformStreamDefaultController.

function defaultControllerBrandCheckException(name) {
  return new TypeError(
    `TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
}

// Stubs for abstract operations used from ReadableStream and WritableStream.

function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
  controller.enqueue(chunk);
}

function ReadableStreamDefaultControllerGetDesiredSize(controller) {
  return controller.desiredSize;
}

function ReadableStreamDefaultControllerClose(controller) {
  controller.close();
}

function ReadableStreamDefaultControllerError(controller, e) {
  controller.error(e);
}

function WritableStreamDefaultControllerError(controller, e) {
  controller.error(e);
}

// Helper functions for the TransformStream.

function streamBrandCheckException(name) {
  return new TypeError(
    `TransformStream.prototype.${name} can only be used on a TransformStream`);
}

// Copied from helpers.js.
function IsPropertyKey(argument) {
  return typeof argument === 'string' || typeof argument === 'symbol';
}

function typeIsObject(x) {
  return (typeof x === 'object' && x !== null) || typeof x === 'function';
}

function Call(F, V, args) {
  if (typeof F !== 'function') {
    throw new TypeError('Argument is not a function');
  }

  return Function.prototype.apply.call(F, V, args);
}

function InvokeOrNoop(O, P, args) {
  const method = O[P];
  if (method === undefined) {
    return undefined;
  }

  return Call(method, O, args);
};

function PromiseInvokeOrNoop(O, P, args) {
  try {
    return Promise.resolve(InvokeOrNoop(O, P, args));
  } catch (returnValueE) {
    return Promise.reject(returnValueE);
  }
};

function PromiseInvokeOrPerformFallback(O, P, args, F, argsF) {
  let method;
  try {
    method = O[P];
  } catch (methodE) {
    return Promise.reject(methodE);
  }

  if (method === undefined) {
    return F(...argsF);
  }

  try {
    return Promise.resolve(Call(method, O, args));
  } catch (e) {
    return Promise.reject(e);
  }
};

// DIY assert() implementation
function assert(predicate, s) {
  class TransformStreamInternalLogicError extends Error {
    constructor(s) {
      super(s);
    }
  }
  if (!predicate) {
    console.log(`TransformStream internal logic error: assertion failed: s`);
    throw new TransformStreamInternalLogicError(s);
  }
}

self['TransformStream'] = TransformStream;
})();
