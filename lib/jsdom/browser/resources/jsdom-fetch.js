"use strict";

/**
 * High-level fetch that collects the full response body.
 * Used by PerDocumentResourceLoader for scripts, stylesheets, images, frames.
 *
 * @param {Dispatcher} dispatcher - The undici dispatcher to use
 * @param {object} opts - Request options
 * @param {string} opts.url - The URL to fetch
 * @param {string} [opts.method] - HTTP method (default: GET)
 * @param {object} [opts.headers] - Request headers (include Referer if needed)
 * @param {Buffer|string} [opts.body] - Request body
 * @param {AbortSignal} [opts.signal] - Abort signal
 * @param {object} [opts.opaque] - Opaque data to pass through (element, document)
 * @returns {Promise<{status: number, headers: object, body: Uint8Array, url: string, ok: boolean}>}
 */
async function fetchCollected(dispatcher, opts) {
  const parsedURL = new URL(opts.url);

  const response = await dispatcher.request({
    origin: parsedURL.origin,
    path: parsedURL.pathname + parsedURL.search,
    method: opts.method || "GET",
    headers: opts.headers,
    body: opts.body,
    signal: opts.signal,
    opaque: { ...opts.opaque, url: opts.url }
  });

  const body = await response.body.bytes();

  // Get final URL from context history (last entry), fallback to original URL
  const finalURL = response.context?.history?.[response.context.history.length - 1] || opts.url;

  return {
    status: response.statusCode,
    headers: response.headers,
    body,
    url: finalURL,
    ok: response.statusCode >= 200 && response.statusCode < 300
  };
}

module.exports = {
  fetchCollected
};
