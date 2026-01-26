"use strict";

const DecoratorHandler = require("undici/lib/handler/decorator-handler");

/**
 * Handler that can intercept requests and return synthetic responses.
 * Follows the pattern from undici's dump.js interceptor.
 */
class SyntheticResponseHandler extends DecoratorHandler {
  #userFn;
  #dispatchOptions;
  #aborted = false;

  constructor(userFn, dispatchOptions, handler) {
    super(handler);
    this.#userFn = userFn;
    this.#dispatchOptions = dispatchOptions;
  }

  onRequestStart(controller, context) {
    // Build Request object for user callback
    const { element, url } = this.#dispatchOptions.opaque || {};
    const requestInit = {
      method: this.#dispatchOptions.method || "GET",
      headers: this.#dispatchOptions.headers,
      signal: this.#dispatchOptions.signal
    };
    if (this.#dispatchOptions.body !== undefined && this.#dispatchOptions.body !== null) {
      requestInit.body = this.#dispatchOptions.body;
      requestInit.duplex = "half";
    }
    if (this.#dispatchOptions.referrer) {
      requestInit.referrer = this.#dispatchOptions.referrer;
    }
    const request = new Request(url, requestInit);

    // Call user function asynchronously
    Promise.resolve(this.#userFn(request, { element }))
      .then(async response => {
        if (response instanceof Response) {
          this.#aborted = true;
          controller.abort();
          await this.#sendSyntheticResponse(controller, response);
        } else if (response !== undefined) {
          throw new TypeError("requestInterceptor callback must return undefined or a Response");
        }
        // If undefined returned, let the real request continue
      })
      .catch(error => {
        this.#aborted = true;
        controller.abort();
        super.onResponseError(controller, error);
      });

    super.onRequestStart(controller, context);
  }

  async #sendSyntheticResponse(controller, response) {
    const { status } = response;
    const statusText = response.statusText || "";

    // Convert Response headers to object format
    const headersObj = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    const body = await response.bytes();

    super.onResponseStart(controller, status, headersObj, statusText);
    super.onResponseData(controller, body);
    super.onResponseEnd(controller, {});
  }

  onResponseStart(controller, statusCode, headers, statusMessage) {
    if (this.#aborted) {
      return; // We're sending a synthetic response, ignore real response
    }
    super.onResponseStart(controller, statusCode, headers, statusMessage);
  }

  onResponseData(controller, chunk) {
    if (this.#aborted) {
      return;
    }
    super.onResponseData(controller, chunk);
  }

  onResponseEnd(controller, trailers) {
    if (this.#aborted) {
      return;
    }
    super.onResponseEnd(controller, trailers);
  }

  onResponseError(controller, error) {
    if (this.#aborted) {
      return; // We aborted intentionally to send a synthetic response, ignore the error
    }
    super.onResponseError(controller, error);
  }
}

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
 */
function requestInterceptor(fn) {
  return dispatch => (options, handler) => {
    const syntheticHandler = new SyntheticResponseHandler(fn, options, handler);
    return dispatch(options, syntheticHandler);
  };
}

module.exports = requestInterceptor;
