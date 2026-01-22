"use strict";

const { Readable } = require("stream");
const zlib = require("zlib");

/**
 * High-level fetch that collects the full response body.
 * Used by PerDocumentResourceLoader for scripts, stylesheets, images, frames.
 *
 * @param {Dispatcher} dispatcher - The undici dispatcher to use
 * @param {object} opts - Request options
 * @param {string} opts.url - The URL to fetch
 * @param {string} [opts.method] - HTTP method (default: GET)
 * @param {object} [opts.headers] - Request headers
 * @param {Buffer|string} [opts.body] - Request body
 * @param {AbortSignal} [opts.signal] - Abort signal
 * @param {string} [opts.referrer] - Referrer URL
 * @param {object} [opts.opaque] - Opaque data to pass through (element, cookieJar, document)
 * @returns {Promise<{status: number, statusText: string, headers: object, body: Uint8Array, url: string}>}
 */
async function fetchCollected(dispatcher, opts) {
  const parsedURL = new URL(opts.url);

  return new Promise((resolve, reject) => {
    const chunks = [];
    let status, statusText, headers;
    let finalURL = opts.url;
    let aborted = false;
    let dispatchAbort = null;

    if (opts.signal?.aborted) {
      reject(opts.signal.reason ?? new DOMException("The operation was aborted.", "AbortError"));
      return;
    }

    const onAbort = () => {
      aborted = true;
      if (dispatchAbort) {
        try {
          dispatchAbort(new DOMException("The operation was aborted.", "AbortError"));
        } catch {
          // Ignore errors
        }
      } else {
        // Request hasn't started yet, reject immediately
        opts.signal?.removeEventListener("abort", onAbort);
        reject(opts.signal?.reason ?? new DOMException("The operation was aborted.", "AbortError"));
      }
    };
    opts.signal?.addEventListener("abort", onAbort, { once: true });

    // Defer dispatch to next microtask to allow synchronous abort to take effect
    queueMicrotask(() => {
      if (aborted) {
        return; // Already rejected in onAbort
      }

      dispatcher.dispatch({
        origin: parsedURL.origin,
        path: parsedURL.pathname + parsedURL.search,
        method: opts.method || "GET",
        headers: opts.headers,
        body: opts.body,
        signal: opts.signal,
        referrer: opts.referrer,
        opaque: { ...opts.opaque, url: opts.url }
      }, {
        onConnect(abort) {
          dispatchAbort = abort;
          if (aborted) {
            abort(new DOMException("The operation was aborted.", "AbortError"));
          }
        },
        onHeaders(statusCode, rawHeaders, resume, text) {
          if (aborted) {
            return false;
          }
          status = statusCode;
          statusText = text || "";
          headers = rawHeadersToObject(rawHeaders);

          // Check for final URL from jsdom interceptor
          if (headers["x-final-url"]) {
            finalURL = headers["x-final-url"];
            delete headers["x-final-url"];
          }

          return true;
        },
        onData(chunk) {
          if (aborted) {
            return false;
          }
          chunks.push(chunk);
          return true;
        },
        onComplete() {
          opts.signal?.removeEventListener("abort", onAbort);
          const rawBody = Buffer.concat(chunks);
          const contentEncoding = headers["content-encoding"];
          const body = decompressBody(rawBody, contentEncoding);
          resolve({
            status,
            statusText,
            headers,
            body: new Uint8Array(body),
            url: finalURL,
            ok: status >= 200 && status < 300
          });
        },
        onError(err) {
          opts.signal?.removeEventListener("abort", onAbort);
          reject(err);
        },
        // New handler API (undici >= 7)
        onResponseStart(controller, statusCode, hdrs, text) {
          dispatchAbort = () => {}; // Mark as started
          if (aborted) {
            return;
          }
          status = statusCode;
          statusText = text || "";
          headers = { ...hdrs };

          // Check for final URL from jsdom interceptor
          if (headers["x-final-url"]) {
            finalURL = headers["x-final-url"];
            delete headers["x-final-url"];
          }
        },
        onResponseData(controller, chunk) {
          if (aborted) {
            return;
          }
          chunks.push(chunk);
        },
        onResponseEnd(controller, trailers) {
          opts.signal?.removeEventListener("abort", onAbort);
          const rawBody = Buffer.concat(chunks);
          const contentEncoding = headers["content-encoding"];
          const body = decompressBody(rawBody, contentEncoding);
          resolve({
            status,
            statusText,
            headers,
            body: new Uint8Array(body),
            url: finalURL,
            ok: status >= 200 && status < 300
          });
        },
        onResponseError(controller, err) {
          opts.signal?.removeEventListener("abort", onAbort);
          reject(err);
        }
      });
    }); // end queueMicrotask
  });
}

/**
 * Low-level fetch that gives the caller control over the handler.
 * Used by XHR for streaming responses and progress events.
 *
 * @param {Dispatcher} dispatcher - The undici dispatcher to use
 * @param {object} opts - Request options (same as fetchCollected)
 * @param {object} handler - The undici handler to use
 * @returns {boolean} Whether the request was dispatched
 */
function fetchStreaming(dispatcher, opts, handler) {
  const parsedURL = new URL(opts.url);

  return dispatcher.dispatch({
    origin: parsedURL.origin,
    path: parsedURL.pathname + parsedURL.search,
    method: opts.method || "GET",
    headers: opts.headers,
    body: opts.body,
    signal: opts.signal,
    referrer: opts.referrer,
    opaque: { ...opts.opaque, url: opts.url }
  }, handler);
}

/**
 * Create a streaming fetch that returns a readable body.
 * Used by XHR for streaming responses.
 *
 * @param {Dispatcher} dispatcher - The undici dispatcher to use
 * @param {object} opts - Request options
 * @returns {Promise<{status: number, statusText: string, headers: object, body: Readable, url: string}>}
 */
function fetchWithStreamingBody(dispatcher, opts) {
  const parsedURL = new URL(opts.url);

  return new Promise((resolve, reject) => {
    let status, statusText, headers, bodyStream;
    let finalURL = opts.url;
    let aborted = false;
    let dispatchAbort = null;

    if (opts.signal?.aborted) {
      reject(opts.signal.reason ?? new DOMException("The operation was aborted.", "AbortError"));
      return;
    }

    const onAbort = () => {
      aborted = true;
      if (dispatchAbort) {
        try {
          dispatchAbort(new DOMException("The operation was aborted.", "AbortError"));
        } catch {
          // Ignore abort errors
        }
      }
      bodyStream?.destroy();
    };
    opts.signal?.addEventListener("abort", onAbort, { once: true });

    dispatcher.dispatch({
      origin: parsedURL.origin,
      path: parsedURL.pathname + parsedURL.search,
      method: opts.method || "GET",
      headers: opts.headers,
      body: opts.body,
      signal: opts.signal,
      referrer: opts.referrer,
      opaque: { ...opts.opaque, url: opts.url }
    }, {
      onConnect(abort) {
        dispatchAbort = abort;
        if (aborted) {
          abort(new DOMException("The operation was aborted.", "AbortError"));
        }
      },
      onHeaders(statusCode, rawHeaders, resume, text) {
        if (aborted) {
          return false;
        }
        status = statusCode;
        statusText = text || "";
        headers = rawHeadersToObject(rawHeaders);

        // Check for final URL from jsdom interceptor
        if (headers["x-final-url"]) {
          finalURL = headers["x-final-url"];
          delete headers["x-final-url"];
        }

        bodyStream = new Readable({ read: resume });

        resolve({
          status,
          statusText,
          headers,
          body: bodyStream,
          url: finalURL,
          ok: status >= 200 && status < 300
        });

        return true;
      },
      onData(chunk) {
        if (aborted) {
          return false;
        }
        bodyStream.push(chunk);
        return true;
      },
      onComplete() {
        opts.signal?.removeEventListener("abort", onAbort);
        bodyStream.push(null);
      },
      onError(err) {
        opts.signal?.removeEventListener("abort", onAbort);
        if (bodyStream) {
          bodyStream.destroy(err);
        } else {
          reject(err);
        }
      },
      // New handler API (undici >= 7)
      onResponseStart(controller, statusCode, hdrs, text) {
        if (aborted) {
          return;
        }
        status = statusCode;
        statusText = text || "";
        headers = { ...hdrs };

        // Check for final URL from jsdom interceptor
        if (headers["x-final-url"]) {
          finalURL = headers["x-final-url"];
          delete headers["x-final-url"];
        }

        bodyStream = new Readable({
          read() {
            // Resume is handled automatically
          }
        });

        resolve({
          status,
          statusText,
          headers,
          body: bodyStream,
          url: finalURL,
          ok: status >= 200 && status < 300
        });
      },
      onResponseData(controller, chunk) {
        if (aborted) {
          return;
        }
        bodyStream.push(chunk);
      },
      onResponseEnd(controller, trailers) {
        opts.signal?.removeEventListener("abort", onAbort);
        bodyStream.push(null);
      },
      onResponseError(controller, err) {
        opts.signal?.removeEventListener("abort", onAbort);
        if (bodyStream) {
          bodyStream.destroy(err);
        } else {
          reject(err);
        }
      }
    });
  });
}

/**
 * Convert raw headers array or object to normalized object.
 */
function rawHeadersToObject(rawHeaders) {
  const headers = {};

  // Handle object format (from new handler API)
  if (!Array.isArray(rawHeaders)) {
    for (const [key, value] of Object.entries(rawHeaders)) {
      headers[key.toLowerCase()] = value;
    }
    return headers;
  }

  // Handle array format (from old handler API)
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const key = rawHeaders[i].toLowerCase();
    const value = rawHeaders[i + 1];
    if (headers[key]) {
      // Handle multiple values for the same header (like Set-Cookie)
      if (Array.isArray(headers[key])) {
        headers[key].push(value);
      } else {
        headers[key] = [headers[key], value];
      }
    } else {
      headers[key] = value;
    }
  }
  return headers;
}

/**
 * Decompress a body buffer based on Content-Encoding header.
 */
function decompressBody(body, contentEncoding) {
  if (!contentEncoding) {
    return body;
  }

  const encoding = contentEncoding.toLowerCase().trim();

  try {
    if (encoding === "gzip" || encoding === "x-gzip") {
      return zlib.gunzipSync(body);
    } else if (encoding === "deflate") {
      return zlib.inflateSync(body);
    } else if (encoding === "br") {
      return zlib.brotliDecompressSync(body);
    }
  } catch {
    // If decompression fails, return the original body
  }

  return body;
}

module.exports = {
  fetchCollected,
  fetchStreaming,
  fetchWithStreamingBody
};
