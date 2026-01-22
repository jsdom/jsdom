"use strict";
const fsPromises = require("fs/promises");
const { fileURLToPath } = require("url");
const { parseURL, URL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const packageVersion = require("../../../../package.json").version;
const delay = require("timers/promises").setTimeout;

const DEFAULT_USER_AGENT = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                           `(KHTML, like Gecko) jsdom/${packageVersion}`;

/**
 * `ResourceLoader` is the public API for fetching resources for jsdom. In particular, its `fetch()` method is designed
 * to be overridden by subclasses.
 */
class ResourceLoader {
  constructor({
    dispatcher = undefined,
    userAgent = DEFAULT_USER_AGENT
  } = {}) {
    this._dispatcher = dispatcher;
    this._userAgent = userAgent;

    // Used by WebSocket and XHR (which don't yet use the new fetch() API)
    this._strictSSL = true;
  }

  /**
   * Fetch a resource. The signature is similar to the global `fetch()` method, with some differences.
   *
   * @param {string} url - The URL to fetch. (Unlike global `fetch()`, this is always called with a `url` argument,
   * never a `Request` object.)
   * @param {object} options - Fetch options. These are similar to the `RequestInit` second argument of global
   * `fetch()`, but only a subset are ever passed by jsdom or processed when calling `super.fetch()` from subclasses,
   * and additional `element` and `cookieJar` options will be passed by jsdom. If you call `super.fetch()`, it's best
   * to pass along those options to preserve the context.
   * @param {string} [options.method] - HTTP method (like global `fetch()`)
   * @param {Headers|object} [options.headers] - Request headers (like global `fetch()`)
   * @param {string|Uint8Array} [options.body] - Request body (like global `fetch()`)
   * @param {string} [options.referrer] - Referrer URL (like global `fetch()`, but always used as-is, instead of
   * modified by referrer policy)
   * @param {AbortSignal} [options.signal] - Abort signal for cancellation (like global `fetch()`). Must be a Node.js
   * global `AbortSignal`, not one from a JSDOM `Window`.
   * @param {CookieJar} [options.cookieJar] - `CookieJar` from the `tough-cookie` package, for cookie handling
   * (jsdom-specific)
   * @param {Element} [options.element] - The DOM element that initiated the fetch, from the jsdom `Document`
   * (jsdom-specific)
   * @returns {Promise<Response>} A promise resolving to a `Response` (from the Node.js global)
   */
  // eslint-disable-next-line no-unused-vars -- element is for subclasses
  async fetch(url, { method, headers, body, referrer, signal, cookieJar, element } = {}) {
    signal?.throwIfAborted();

    const urlRecord = parseURL(url);

    if (!urlRecord) {
      throw new Error(`Tried to fetch invalid URL ${url}`);
    }

    switch (urlRecord.scheme) {
      case "data": {
        return this._readDataURL(urlRecord, signal);
      }

      case "http":
      case "https": {
        return this._fetchHTTP(url, { method, headers, body, referrer, signal, cookieJar });
      }

      case "file": {
        return this._readFile(url, signal);
      }

      default: {
        throw new TypeError(`Tried to fetch URL ${url} with invalid scheme ${urlRecord.scheme}`);
      }
    }
  }

  async _readDataURL(urlRecord, signal) {
    // Add an artificial delay to match the specs, where data: URL processing is done from a full task (not just a
    // microtask).
    await delay(0, { signal });
    signal?.throwIfAborted();

    const dataURL = dataURLFromRecord(urlRecord);
    if (dataURL === null) {
      throw new TypeError("Invalid data: URL");
    }

    const contentType = dataURL.mimeType.toString();
    return new Response(dataURL.body, {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": contentType }
    });
  }

  async _readFile(url, signal) {
    const filePath = fileURLToPath(url);
    const body = await fsPromises.readFile(filePath, { signal });
    signal?.throwIfAborted();

    return new Response(body, {
      status: 200,
      statusText: "OK"
    });
  }

  async _fetchHTTP(url, { method = "GET", headers, body, referrer, signal, cookieJar }) {
    const MAX_REDIRECTS = 20;
    let currentURL = url;
    let currentMethod = method;
    let currentBody = body;

    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
      // Build request headers for this request
      const requestHeaders = new Headers(headers);

      // Set default headers if not already present
      if (!requestHeaders.has("User-Agent")) {
        requestHeaders.set("User-Agent", this._userAgent);
      }
      if (!requestHeaders.has("Accept-Language")) {
        requestHeaders.set("Accept-Language", "en");
      }
      if (!requestHeaders.has("Accept")) {
        requestHeaders.set("Accept", "*/*");
      }
      if (!requestHeaders.has("Accept-Encoding")) {
        requestHeaders.set("Accept-Encoding", "gzip, deflate");
      }
      if (referrer && !requestHeaders.has("Referer")) {
        requestHeaders.set("Referer", referrer);
      }

      // Add cookies from jar for the current URL
      if (cookieJar) {
        const cookieString = await cookieJar.getCookieString(currentURL);
        if (cookieString) {
          requestHeaders.set("Cookie", cookieString);
        }
      }

      const fetchOptions = {
        method: currentMethod,
        headers: requestHeaders,
        signal,
        redirect: "manual" // Handle redirects manually to capture intermediate cookies
      };

      if (currentBody !== undefined) {
        fetchOptions.body = currentBody;
      }

      // Add dispatcher if configured
      if (this._dispatcher) {
        fetchOptions.dispatcher = this._dispatcher;
      }

      const response = await fetch(currentURL, fetchOptions);

      // Store cookies from this response
      if (cookieJar) {
        const setCookieHeaders = response.headers.getSetCookie();
        const cookieURL = currentURL;
        await Promise.all(setCookieHeaders.map(
          cookie => cookieJar.setCookie(cookie, cookieURL, { ignoreError: true }).catch(() => {})
        ));
      }

      // Check if this is a redirect
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          // No Location header, return this response as-is
          return response;
        }

        currentURL = (new URL(location, currentURL)).href;

        // Per HTTP spec: 303 always converts to GET, 301/302 convert POST to GET
        if (response.status === 303 ||
            ((response.status === 301 || response.status === 302) && currentMethod === "POST")) {
          currentMethod = "GET";
          currentBody = undefined;
        }

        // Continue to next iteration to follow the redirect
        continue;
      }

      // Not a redirect - return the final response
      // The response.url will be the URL we fetched (currentURL)
      return response;
    }

    throw new Error(`Too many redirects (max ${MAX_REDIRECTS})`);
  }
}

module.exports = ResourceLoader;
module.exports.DEFAULT_USER_AGENT = DEFAULT_USER_AGENT;
