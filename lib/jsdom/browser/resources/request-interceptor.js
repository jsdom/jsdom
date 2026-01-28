"use strict";
const { Readable } = require("stream");

/**
 * Creates a user-friendly request interceptor for jsdom.
 *
 * This helper allows users to intercept requests using a simple async callback that
 * receives a Request object and can return a Response to provide a synthetic response.
 *
 * @param {function} fn - Async callback function that receives (request, context) and can return a Response
 * @returns {function} An undici interceptor
 *
 * @example
 * const dom = new JSDOM(html, {
 *   interceptors: [
 *     requestInterceptor(async (request, { element }) => {
 *       console.log(`${element?.localName || 'XHR'} requested ${request.url}`);
 *       if (request.url.endsWith('/test.js')) {
 *         return new Response('window.mocked = true;', {
 *           headers: { 'Content-Type': 'application/javascript' }
 *         });
 *       }
 *       // Return undefined to let the request pass through
 *     })
 *   ]
 * });
 *
 * ## Why this doesn't use undici's DecoratorHandler pattern
 *
 * The standard undici interceptor pattern (see e.g. undici/lib/interceptor/dump.js) uses DecoratorHandler
 * to wrap handler callbacks. That pattern calls `dispatch()` synchronously, then observes/modifies the
 * request and response as they flow through the handler callbacks.
 *
 * This interceptor needs to support async user functions that can BLOCK the request and potentially
 * REPLACE it with a synthetic response. This requires:
 *
 * 1. Waiting for the async user function BEFORE deciding whether to dispatch
 * 2. For synthetic responses, NEVER calling dispatch() at all
 *
 * Since synthetic responses bypass the normal undici dispatch flow entirely, there's no underlying
 * dispatcher (Agent/Pool) to create a real controller for us. We provide our own controller object
 * that delegates to a Node.js Readable stream for pause/resume/abort support, following the pattern
 * from undici/lib/interceptor/cache.js.
 */
module.exports = function requestInterceptor(fn) {
  return dispatch => (options, handler) => {
    // Build Request object for user callback
    // Normalize element to null if undefined (e.g. for WebSocket requests)
    const { element = null, url } = options.opaque || {};
    const requestInit = {
      method: options.method || "GET",
      headers: options.headers,
      signal: options.signal
    };
    if (options.body !== undefined && options.body !== null) {
      requestInit.body = options.body;
      requestInit.duplex = "half";
    }
    if (options.referrer) {
      requestInit.referrer = options.referrer;
    }
    const request = new Request(url, requestInit);

    new Promise(resolve => {
      resolve(fn(request, { element }));
    })
      .then(response => {
        if (response instanceof Response) {
          // Send synthetic response without ever starting real request
          sendSyntheticResponse(handler, response);
        } else if (response !== undefined) {
          throw new TypeError("requestInterceptor callback must return undefined or a Response");
        } else {
          // undefined returned - NOW start the real request
          dispatch(options, handler);
        }
      })
      .catch(error => {
        handler.onResponseError?.(null, error);
      });

    // Return true to indicate request is being handled
    return true;
  };
};

/**
 * Send a synthetic response by streaming the Response body through handler callbacks.
 *
 * Uses a Node.js Readable stream (converted from the web ReadableStream) to enable
 * pause/resume/abort support. The controller object delegates to the stream's methods,
 * following the pattern from undici/lib/interceptor/cache.js.
 */
function sendSyntheticResponse(handler, response) {
  const stream = Readable.fromWeb(response.body);
  const controller = {
    resume() {
      stream.resume();
    },
    pause() {
      stream.pause();
    },
    get paused() {
      return stream.isPaused();
    },
    get aborted() {
      return stream.destroyed;
    },
    get reason() {
      return stream.errored;
    },
    abort(reason) {
      stream.destroy(reason);
    }
  };

  stream
    .on("error", err => {
      if (!stream.readableEnded) {
        handler.onResponseError?.(controller, err);
      }
    })
    .on("close", () => {
      if (!stream.errored) {
        handler.onResponseEnd?.(controller, {});
      }
    })
    .on("data", chunk => {
      handler.onResponseData?.(controller, chunk);
    });

  handler.onRequestStart?.(controller, {});

  if (stream.destroyed) {
    return;
  }

  const headersObj = {};
  for (const [key, value] of response.headers) {
    headersObj[key] = value;
  }

  handler.onResponseStart?.(controller, response.status, headersObj, response.statusText);
}
