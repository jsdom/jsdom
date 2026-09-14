"use strict";
const { Readable } = require("stream");
const { sendStreamResponse } = require("./stream-handler");

/**
 * Creates an Undici interceptor whose callback receives a `Request` and can asynchronously return a `Response`
 * to supply a synthetic response, or `undefined` to pass through.
 *
 * @param {function} fn - Callback receiving `(request, { element })`
 * @returns {function} An Undici interceptor
 *
 * @example
 * const dom = new JSDOM(html, {
 *   resources: {
 *     interceptors: [
 *       requestInterceptor(async (request, { element }) => {
 *         console.log(`${element?.localName || "XHR"} requested ${request.url}`);
 *         if (request.url.endsWith("/test.js")) {
 *           return new Response("window.mocked = true;", {
 *             headers: { "Content-Type": "application/javascript" }
 *           });
 *         }
 *         // Return `undefined` to let the request pass through.
 *       })
 *     ]
 *   }
 * });
 *
 * ## Why this creates its own controller
 *
 * Undici's `DecoratorHandler` pattern wraps callbacks using a controller supplied by the downstream dispatcher.
 * Here, cancellation must be available before invoking a callback that can remain pending indefinitely. The callback
 * can also supply a synthetic response without calling downstream `dispatch()` at all, so we cannot rely on that
 * dispatcher to supply our initial controller.
 *
 * We expose our own controller immediately, with cancellation state held by an `AbortController`. A temporary abort
 * listener reports cancellation until an inner controller arrives from either the downstream dispatcher or
 * `sendStreamResponse()`. We then remove the listener and delegate transport operations and completion to that
 * controller and its handler callbacks. If cancellation happened before handoff, we abort the late controller without
 * adopting it or reporting cancellation again.
 *
 * For synthetic responses, `sendStreamResponse()` owns the Node.js `Readable`; this helper delegates to its controller,
 * not directly to the stream.
 */
module.exports = function requestInterceptor(fn) {
  return dispatch => (options, handler) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const { undiciController, wrappedHandler } = createSignalHandler(handler, abortController);

    async function intercept() {
      // Expose cancellation before invoking the callback or starting a transport.
      handler.onRequestStart?.(undiciController, {});
      if (signal.aborted) {
        return;
      }

      const { element = null, url } = options.opaque || {};
      const requestInit = {
        method: options.method || "GET",
        headers: options.headers,
        signal
      };
      if (options.body !== undefined && options.body !== null) {
        requestInit.body = options.body;
        requestInit.duplex = "half";
      }
      if (options.referrer) {
        requestInit.referrer = options.referrer;
      }
      const request = new Request(url, requestInit);

      const response = await fn(request, { element });
      if (signal.aborted) {
        if (response instanceof Response && response.body !== null) {
          await response.body.cancel(signal.reason);
        }
        return;
      }

      if (response instanceof Response) {
        const stream = response.body ? Readable.fromWeb(response.body) : Readable.from([]);
        sendStreamResponse(wrappedHandler, stream, {
          status: response.status,
          statusText: response.statusText,
          headers: headersToUndici(response.headers)
        });
      } else if (response === undefined) {
        dispatch(options, wrappedHandler);
      } else {
        throw new TypeError("requestInterceptor callback must return undefined or a Response");
      }
    }

    intercept().catch(error => {
      if (!signal.aborted) {
        wrappedHandler.onResponseError(undiciController, error);
      }
    });

    return true;
  };
};

/**
 * Bridges a request's abort signal to its transport controller. Until a transport takes over, an abort listener
 * reports cancellation to the caller.
 */
function createSignalHandler(handler, abortController) {
  const { signal } = abortController;
  let innerUndiciController = null;

  const undiciController = {
    abort(reason) {
      if (signal.aborted) {
        return;
      }
      abortController.abort(reason);
      innerUndiciController?.abort(signal.reason);
    },
    pause() {
      innerUndiciController?.pause();
    },
    resume() {
      innerUndiciController?.resume();
    },
    get paused() {
      return innerUndiciController?.paused ?? false;
    },
    get aborted() {
      return signal.aborted;
    },
    get reason() {
      return signal.reason;
    },
    get rawHeaders() {
      return innerUndiciController?.rawHeaders;
    },
    get rawTrailers() {
      return innerUndiciController?.rawTrailers;
    }
  };

  function onPendingAbort() {
    handler.onResponseError?.(undiciController, signal.reason);
  }
  signal.addEventListener("abort", onPendingAbort, { once: true });

  const wrappedHandler = {
    onRequestStart(controller) {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        innerUndiciController = controller;
        signal.removeEventListener("abort", onPendingAbort);
      }
    },
    onRequestUpgrade(controller, ...args) {
      handler.onRequestUpgrade?.(undiciController, ...args);
    },
    onResponseStart(controller, ...args) {
      handler.onResponseStart?.(undiciController, ...args);
    },
    onResponseData(controller, ...args) {
      handler.onResponseData?.(undiciController, ...args);
    },
    onResponseEnd(controller, ...args) {
      handler.onResponseEnd?.(undiciController, ...args);
    },
    onResponseError(controller, error) {
      signal.removeEventListener("abort", onPendingAbort);
      // If canceled before handoff, the abort listener has already reported the error.
      if (innerUndiciController !== null || !signal.aborted) {
        handler.onResponseError?.(undiciController, error);
      }
    }
  };

  return { undiciController, wrappedHandler };
}

/**
 * Converts a Headers object to the format undici expects.
 * Handles multiple Set-Cookie headers via getSetCookie().
 */
function headersToUndici(headers) {
  const result = {};
  for (const [key, value] of headers) {
    result[key] = value;
  }
  const cookies = headers.getSetCookie();
  if (cookies.length > 0) {
    result["set-cookie"] = cookies;
  }
  return result;
}
