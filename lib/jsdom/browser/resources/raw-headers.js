"use strict";

// This module fixes two issues with undici's header handling:
//
// 1. Encoding: undici's NEW handler API decodes header values as UTF-8, but HTTP headers must use
//    "isomorphic decode" per RFC 7230 and the Fetch spec (each byte maps to the code point with
//    the same value: byte 0xE2 → U+00E2). See https://github.com/nodejs/undici/issues/4753
//
// 2. Case preservation: Original header name casing must be preserved (first-seen wins for
//    duplicates). HTTP header names are case-insensitive for comparison, but the original
//    casing should be kept.
//
// We fix this by:
// 1. Using a custom dispatcher (RawHeadersDispatcher) that manually composes interceptors
// 2. Placing RawHeadersHandler as the innermost handler (closest to the base dispatcher)
// 3. RawHeadersHandler presents OLD API to undici (preventing UTF-8 UnwrapHandler insertion)
// 4. RawHeadersHandler converts raw header bytes to strings correctly and calls NEW API methods
//
// This allows all jsdom code and user interceptors to use the NEW handler API while seeing
// correctly decoded headers with preserved casing.

const kResume = Symbol("resume");

/**
 * Convert undici's raw headers (array of Buffers) to a string-keyed object.
 *
 * @param {Buffer[]} rawHeaders - Array of Buffers: [name, value, name, value, ...]
 * @returns {Object} Object with original-cased keys and correctly decoded string values
 */
function rawHeadersToObject(rawHeaders) {
  const obj = Object.create(null);
  const keyMap = Object.create(null); // lowercase -> original casing

  for (let i = 0; i < rawHeaders.length; i += 2) {
    // Node's Buffer.toString("latin1") performs isomorphic decode:
    // each byte maps to the code point with the same value.
    // Despite the name "latin1", this is NOT Windows-1252 decoding.
    const key = rawHeaders[i].toString("latin1");
    const keyLower = key.toLowerCase();
    const val = rawHeaders[i + 1].toString("latin1");

    if (keyLower in keyMap) {
      // Use the first-seen casing for duplicate headers
      const originalKey = keyMap[keyLower];
      if (typeof obj[originalKey] === "string") {
        obj[originalKey] = [obj[originalKey]];
      }
      obj[originalKey].push(val);
    } else {
      keyMap[keyLower] = key;
      obj[key] = val;
    }
  }
  return obj;
}

/**
 * Controller matching undici's interface for the NEW handler API.
 * Provides: pause(), resume(), abort(), get aborted(), get reason(), get paused()
 */
class ResponseController {
  #paused = false;
  #aborted = false;
  #reason = null;
  #abort;
  [kResume] = null;

  constructor(abort) {
    this.#abort = abort;
  }

  pause() {
    this.#paused = true;
  }

  resume() {
    if (this.#paused) {
      this.#paused = false;
      this[kResume]?.();
    }
  }

  abort(reason) {
    if (!this.#aborted) {
      this.#aborted = true;
      this.#reason = reason;
      this.#abort(reason);
    }
  }

  get aborted() {
    return this.#aborted;
  }

  get reason() {
    return this.#reason;
  }

  get paused() {
    return this.#paused;
  }
}

/**
 * Handler that bridges undici's OLD API to NEW API with correct header handling.
 *
 * This handler presents the OLD API (onConnect, onHeaders, etc.) to undici's core,
 * preventing undici from inserting its UTF-8-decoding UnwrapHandler. It then calls
 * the NEW API methods (onRequestStart, onResponseStart, etc.) on the wrapped handler
 * with correctly decoded headers that preserve original casing.
 */
class RawHeadersHandler {
  #handler;
  #controller;

  constructor(handler) {
    this.#handler = handler;
  }

  onConnect(abort, context) {
    this.#controller = new ResponseController(abort);
    this.#handler.onRequestStart?.(this.#controller, context);
  }

  onUpgrade(statusCode, rawHeaders, socket) {
    this.#handler.onRequestUpgrade?.(this.#controller, statusCode, rawHeadersToObject(rawHeaders), socket);
  }

  onHeaders(statusCode, rawHeaders, resume, statusMessage) {
    this.#controller[kResume] = resume;
    this.#handler.onResponseStart?.(this.#controller, statusCode, rawHeadersToObject(rawHeaders), statusMessage);
    return !this.#controller.paused;
  }

  onData(data) {
    this.#handler.onResponseData?.(this.#controller, data);
    return !this.#controller.paused;
  }

  onComplete(rawTrailers) {
    this.#handler.onResponseEnd?.(this.#controller, rawHeadersToObject(rawTrailers));
  }

  onError(err) {
    this.#handler.onResponseError?.(this.#controller, err);
  }

  onBodySent(chunkSize, totalBytesSent) {
    this.#handler.onBodySent?.(chunkSize, totalBytesSent);
  }
}

/**
 * Custom dispatcher that manually composes interceptors with correct header handling.
 *
 * Unlike undici's compose(), this ensures RawHeadersHandler is always the innermost
 * handler (closest to the base dispatcher). This prevents undici from inserting its
 * UTF-8-decoding UnwrapHandler, while allowing all interceptors and callers to use the
 * NEW handler API with correctly decoded headers that preserve original casing.
 */
class RawHeadersDispatcher {
  #baseDispatcher;
  #interceptors;

  constructor(baseDispatcher, interceptors = []) {
    this.#baseDispatcher = baseDispatcher;
    this.#interceptors = interceptors;
  }

  dispatch(opts, handler) {
    // Innermost: wrap with RawHeadersHandler before calling base dispatcher
    let innerDispatch = (dispatchOpts, h) => {
      return this.#baseDispatcher.dispatch(dispatchOpts, new RawHeadersHandler(h));
    };

    // Apply interceptors from innermost to outermost
    for (let i = this.#interceptors.length - 1; i >= 0; i--) {
      const interceptor = this.#interceptors[i];
      const nextDispatch = innerDispatch;
      innerDispatch = (dispatchOpts, h) => interceptor(nextDispatch)(dispatchOpts, h);
    }

    return innerDispatch(opts, handler);
  }

  // Dispatcher API methods - forward to base dispatcher

  close(...args) {
    return this.#baseDispatcher.close(...args);
  }

  connect(...args) {
    return this.#baseDispatcher.connect(...args);
  }

  destroy(...args) {
    return this.#baseDispatcher.destroy(...args);
  }

  pipeline(...args) {
    return this.#baseDispatcher.pipeline(...args);
  }

  request(...args) {
    return this.#baseDispatcher.request(...args);
  }

  stream(...args) {
    return this.#baseDispatcher.stream(...args);
  }

  upgrade(...args) {
    return this.#baseDispatcher.upgrade(...args);
  }

  /**
   * Create a new RawHeadersDispatcher with additional interceptors.
   * The new interceptors are added as the outermost (first to see requests, last to see responses).
   */
  compose(...additionalInterceptors) {
    return new RawHeadersDispatcher(
      this.#baseDispatcher,
      [...additionalInterceptors, ...this.#interceptors]
    );
  }

  get closed() {
    return this.#baseDispatcher.closed;
  }

  get destroyed() {
    return this.#baseDispatcher.destroyed;
  }
}

module.exports = {
  RawHeadersDispatcher,
  RawHeadersHandler,
  ResponseController,
  rawHeadersToObject
};
