"use strict";

/**
 * Creates a user-friendly request interceptor for jsdom.
 *
 * This helper allows users to intercept requests using a simple async callback that
 * receives a Request object and can return a Response to mock the request.
 *
 * @param {function} fn - Async callback function that receives (request, context) and can return a Response to mock
 * @param {Request} fn.request - A Request object with url, method, headers, body, signal, referrer
 * @param {object} fn.context - Context object with element, cookieJar, document
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
  return dispatch => (opts, handler) => {
    // All jsdom requests set opts.opaque with the URL and other metadata
    const { element, cookieJar, document, url } = opts.opaque;

    // Build a Request object for the user callback
    const requestInit = {
      method: opts.method || "GET",
      headers: opts.headers,
      signal: opts.signal
    };

    // Add body if present (need duplex: 'half' for streaming bodies in Node.js)
    if (opts.body !== undefined && opts.body !== null) {
      requestInit.body = opts.body;
      requestInit.duplex = "half";
    }

    // Add referrer if present
    if (opts.referrer) {
      requestInit.referrer = opts.referrer;
    }

    const request = new Request(url, requestInit);

    // Call the user's function asynchronously
    Promise.resolve().then(async () => {
      try {
        const response = await fn(request, { element, cookieJar, document });

        if (response instanceof Response) {
          // User returned a mock Response - send it to the handler
          await sendMockResponse(response, handler);
        } else {
          // User didn't return a Response - pass through to dispatcher
          dispatch(opts, handler);
        }
      } catch (error) {
        // User's function threw an error
        if (handler.onError) {
          handler.onError(error);
        } else if (handler.onResponseError) {
          handler.onResponseError(null, error);
        }
      }
    });

    // Return true to indicate we're handling the request
    return true;
  };
}

/**
 * Send a mock Response to the handler.
 */
async function sendMockResponse(response, handler) {
  try {
    const { status } = response;
    const statusText = response.statusText || "";

    // Convert Response headers to the format expected by the handler
    const headersObj = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    // Get the response body
    const arrayBuffer = await response.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    // Call onConnect if present (expected by undici's compose)
    if (handler.onConnect) {
      handler.onConnect(() => {});
    }

    // Always use old handler API for compatibility with undici's compose
    if (handler.onHeaders) {
      // Convert headers object to raw headers array
      const rawHeaders = [];
      for (const [key, value] of Object.entries(headersObj)) {
        rawHeaders.push(key, value);
      }
      function resume() {}
      handler.onHeaders(status, rawHeaders, resume, statusText);
      handler.onData(body);
      handler.onComplete({});
    } else if (handler.onResponseStart) {
      // Fallback to new handler API
      handler.onResponseStart(null, status, headersObj, statusText);
      handler.onResponseData(null, body);
      handler.onResponseEnd(null, {});
    }

    return true;
  } catch (error) {
    if (handler.onError) {
      handler.onError(error);
    } else if (handler.onResponseError) {
      handler.onResponseError(null, error);
    }
    return false;
  }
}

module.exports = requestInterceptor;
