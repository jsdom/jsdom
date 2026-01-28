"use strict";

/**
 * High-level GET fetch that collects the full response body.
 * Used by PerDocumentResourceLoader for scripts, stylesheets, images, frames.
 *
 * @param {Dispatcher} dispatcher - The undici dispatcher to use
 * @param {object} opts - Request options
 * @param {string} opts.url - The URL to fetch
 * @param {object} [opts.headers] - Request headers (include Referer if needed)
 * @param {AbortSignal} [opts.signal] - Abort signal
 * @param {Element} [opts.element] - The element initiating the request (default: null)
 * @returns {Promise<{status: number, headers: object, body: Uint8Array, url: string, ok: boolean}>}
 */
async function fetchCollected(dispatcher, { url, headers, signal, element = null }) {
  const parsedURL = new URL(url);

  const response = await dispatcher.request({
    origin: parsedURL.origin,
    path: parsedURL.pathname + parsedURL.search,
    method: "GET",
    headers,
    signal,
    opaque: { element, url }
  });

  const body = await response.body.bytes();

  // Get final URL from context history (last entry), fallback to original URL
  const finalURL = response.context?.history?.[response.context.history.length - 1] || url;

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
