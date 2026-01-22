"use strict";

/**
 * Creates a user-friendly request interceptor for jsdom.
 *
 * This helper allows users to intercept requests using a simple async callback that
 * receives a Request-like object and can return a Response to mock the request.
 *
 * @param {function} fn - Async callback function that receives (request, context) and can return a Response to mock
 * @param {Request} fn.request - A Request object with url, method, headers, body, signal, referrer
 * @param {object} fn.context - Context object with element, cookieJar, document
 * @returns {function} An undici interceptor
 *
 * @example
 * const dom = new JSDOM(html, {
 *   interceptors: [
 *     JSDOM.RequestInterceptor(async (request, { element }) => {
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
function RequestInterceptor(fn) {
  return dispatch => (opts, handler) => {
    const { element, cookieJar, document, url: opaqueURL } = opts.opaque || {};
    // Use URL from opaque if available (set by jsdom-fetch), otherwise reconstruct
    const url = opaqueURL || reconstructURL(opts.origin, opts.path);

    // Build a Request object for the user callback
    const requestInit = {
      method: opts.method || "GET",
      headers: normalizeHeaders(opts.headers),
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
    const status = response.status;
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
      const resume = () => {};
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

/**
 * Normalize headers from various formats to a Headers object or plain object.
 */
function normalizeHeaders(headers) {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return headers;
  }

  if (Array.isArray(headers)) {
    // Convert [key, value, key, value, ...] to object
    const obj = {};
    for (let i = 0; i < headers.length; i += 2) {
      obj[headers[i]] = headers[i + 1];
    }
    return obj;
  }

  if (typeof headers === "object") {
    return { ...headers };
  }

  return {};
}

/**
 * Reconstruct URL from origin and path.
 * Handles special cases for data: and file: URLs where origin is "null".
 */
function reconstructURL(origin, path) {
  if (origin === "null" || origin === null) {
    // For data: and file: URLs, origin is the string "null"
    // Distinguish by path: file: URLs have paths starting with "/"
    if (path && path.startsWith("/")) {
      return "file://" + path;
    }
    // Otherwise assume data: URL (path is media-type,data)
    return "data:" + path;
  }
  return origin + path;
}

module.exports = RequestInterceptor;
