"use strict";

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
      reject(opts.signal.reason);
      return;
    }

    const onAbort = () => {
      aborted = true;
      if (dispatchAbort) {
        try {
          dispatchAbort(opts.signal.reason);
        } catch {
          // Ignore errors
        }
      } else {
        // Request hasn't started yet, reject immediately
        opts.signal.removeEventListener("abort", onAbort);
        reject(opts.signal.reason);
      }
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
      onRequestStart(controller) {
        dispatchAbort = reason => controller.abort(reason);
        if (aborted) {
          controller.abort(opts.signal.reason);
        }
      },
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
      },
      onResponseData(controller, chunk) {
        if (aborted) {
          return;
        }
        chunks.push(chunk);
      },
      onResponseEnd(controller, trailers) {
        opts.signal?.removeEventListener("abort", onAbort);
        // Body is already decompressed by the decompress interceptor
        const body = Buffer.concat(chunks);
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
  });
}

module.exports = {
  fetchCollected
};
