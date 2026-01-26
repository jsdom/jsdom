"use strict";

// This module provides JSDOMDispatcher, a full undici Dispatcher that handles:
// - data: URLs (decode and return)
// - file: URLs (read from filesystem)
// - HTTP(S): manually follows redirects, capturing cookies at each hop
// - WebSocket: passes through to base dispatcher with cookie handling
//
// It also fixes two issues with undici's header handling:
// 1. Encoding: undici decodes header values as UTF-8, but HTTP headers must use
//    "isomorphic decode" per RFC 7230 and the Fetch spec
// 2. Case preservation: Original header name casing must be preserved

const fsPromises = require("fs/promises");
const { fileURLToPath } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const HeaderList = require("../../living/fetch/header-list");

const packageVersion = require("../../../../package.json").version;

const DEFAULT_USER_AGENT = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                           `(KHTML, like Gecko) jsdom/${packageVersion}`;
const MAX_REDIRECTS = 20;

const kResume = Symbol("resume");

/**
 * Convert undici's raw headers (array of Buffers) to a string-keyed object.
 *
 * @param {Buffer[]} rawHeaders - Array of Buffers: [name, value, name, value, ...]
 * @returns {Object} Object with original-cased keys and correctly decoded string values
 */
function rawHeadersToObject(rawHeaders) {
  const obj = Object.create(null);
  const keyMap = Object.create(null); // lowercase -> original casing

  for (let i = 0; i < rawHeaders.length; i += 2) {
    // Node's Buffer.toString("latin1") performs isomorphic decode:
    // each byte maps to the code point with the same value.
    const key = rawHeaders[i].toString("latin1");
    const keyLower = key.toLowerCase();
    const val = rawHeaders[i + 1].toString("latin1");

    if (keyLower in keyMap) {
      const originalKey = keyMap[keyLower];
      if (typeof obj[originalKey] === "string") {
        obj[originalKey] = [obj[originalKey]];
      }
      obj[originalKey].push(val);
    } else {
      keyMap[keyLower] = key;
      obj[key] = val;
    }
  }
  return obj;
}

/**
 * Controller matching undici's interface for the NEW handler API.
 */
class ResponseController {
  #paused = false;
  #aborted = false;
  #reason = null;
  #abort;
  [kResume] = null;

  constructor(abort) {
    this.#abort = abort;
  }

  pause() {
    this.#paused = true;
  }

  resume() {
    if (this.#paused) {
      this.#paused = false;
      this[kResume]?.();
    }
  }

  abort(reason) {
    if (!this.#aborted) {
      this.#aborted = true;
      this.#reason = reason;
      this.#abort(reason);
    }
  }

  get aborted() {
    return this.#aborted;
  }

  get reason() {
    return this.#reason;
  }

  get paused() {
    return this.#paused;
  }
}

/**
 * Handler that bridges undici's OLD API to NEW API with correct header handling.
 */
class RawHeadersHandler {
  #handler;
  #controller;

  constructor(handler) {
    this.#handler = handler;
  }

  onConnect(abort, context) {
    this.#controller = new ResponseController(abort);
    this.#handler.onRequestStart?.(this.#controller, context);
  }

  onUpgrade(statusCode, rawHeaders, socket) {
    this.#handler.onRequestUpgrade?.(this.#controller, statusCode, rawHeadersToObject(rawHeaders), socket);
  }

  onHeaders(statusCode, rawHeaders, resume, statusMessage) {
    this.#controller[kResume] = resume;
    this.#handler.onResponseStart?.(this.#controller, statusCode, rawHeadersToObject(rawHeaders), statusMessage);
    return !this.#controller.paused;
  }

  onData(data) {
    this.#handler.onResponseData?.(this.#controller, data);
    return !this.#controller.paused;
  }

  onComplete(rawTrailers) {
    this.#handler.onResponseEnd?.(this.#controller, rawHeadersToObject(rawTrailers));
  }

  onError(err) {
    this.#handler.onResponseError?.(this.#controller, err);
  }

  onBodySent(chunkSize, totalBytesSent) {
    this.#handler.onBodySent?.(chunkSize, totalBytesSent);
  }
}

/**
 * JSDOMDispatcher - Full undici Dispatcher implementation for jsdom.
 *
 * Handles:
 * - data: URLs (decode and return)
 * - file: URLs (read from filesystem)
 * - HTTP(S): follows redirects manually, capturing cookies at each hop
 * - WebSocket: passes through with cookie handling
 *
 * Callers no longer need to set cookieJar or url in opaque - the dispatcher:
 * - Owns the cookie jar (passed at construction)
 * - Reconstructs URL from opts.origin + opts.path
 * - Injects cookieJar into opaque so user interceptors can access it
 */
class JSDOMDispatcher {
  #baseDispatcher;
  #cookieJar;
  #userAgent;
  #userInterceptors;

  constructor({ baseDispatcher, cookieJar, userAgent, userInterceptors = [] }) {
    this.#baseDispatcher = baseDispatcher;
    this.#cookieJar = cookieJar;
    this.#userAgent = userAgent || DEFAULT_USER_AGENT;
    this.#userInterceptors = userInterceptors;
  }

  dispatch(opts, handler) {
    // Get URL from opaque if present (required for file: URLs since they have origin "null"),
    // otherwise reconstruct from opts.origin + opts.path (works for http/https/ws/wss)
    const url = opts.opaque?.url || (opts.origin + opts.path);

    // Enrich opaque with cookieJar and url for user interceptors
    const enrichedOpaque = {
      cookieJar: this.#cookieJar,
      url,
      ...opts.opaque
    };

    // Route by URL scheme
    if (url.startsWith("data:")) {
      return this.#handleDataURL(url, handler);
    }

    if (url.startsWith("file:")) {
      return this.#handleFileURL(url, handler, opts.signal);
    }

    // HTTP(S) and WebSocket
    const { noRedirectFollow } = opts.opaque || {};

    // WebSocket upgrade requests - detect by opts.upgrade property
    // WebSocket requests come in as http/https URLs with upgrade: 'websocket'
    if (opts.upgrade === "websocket") {
      return this.#handleWebSocket({ ...opts, opaque: enrichedOpaque }, handler, url);
    }

    // HTTP(S) - follow redirects unless caller handles them (like XHR)
    const followRedirects = !noRedirectFollow;
    return this.#dispatchHTTP({ ...opts, opaque: enrichedOpaque }, handler, { followRedirects });
  }

  /**
   * Handle WebSocket requests - pass through with cookie handling but preserve undici options.
   */
  #handleWebSocket(opts, handler, url) {
    // For WebSocket, we need to handle cookies but preserve all other opts unchanged
    // The upgrade mechanics are handled by undici internally
    this.#dispatchWebSocketWithCookies(opts, handler, url);
    return true;
  }

  /**
   * Dispatch WebSocket with cookie handling.
   * Preserves all original opts and passes handler through directly.
   * WebSocket handler needs to receive all calls unchanged for proper socket communication.
   */
  async #dispatchWebSocketWithCookies(opts, handler, currentURL) {
    const cookieJar = this.#cookieJar;

    // Get cookies for the WebSocket URL
    let cookieHeader = null;
    if (cookieJar) {
      try {
        cookieHeader = await cookieJar.getCookieString(currentURL);
      } catch {
        // Ignore cookie errors
      }
    }

    // If we have cookies, add them to headers (preserving original format)
    let headers = opts.headers;
    if (cookieHeader) {
      if (Array.isArray(headers)) {
        headers = [...headers, "Cookie", cookieHeader];
      } else if (headers && typeof headers === "object") {
        headers = { ...headers, Cookie: cookieHeader };
      } else {
        headers = { Cookie: cookieHeader };
      }
    }

    // For WebSocket, pass through to base dispatcher with the original handler unchanged
    // WebSocket communication requires the handler to receive callbacks directly
    return this.#baseDispatcher.dispatch({ ...opts, headers }, handler);
  }

  /**
   * Handle data: URLs by decoding them and returning the body.
   */
  #handleDataURL(url, handler) {
    const urlRecord = parseURL(url);
    if (!urlRecord) {
      const error = new Error(`Invalid URL: ${url}`);
      handler.onResponseError?.(null, error);
      return false;
    }

    const dataURL = dataURLFromRecord(urlRecord);
    if (dataURL === null) {
      const error = new TypeError("Invalid data: URL");
      handler.onResponseError?.(null, error);
      return false;
    }

    const contentType = dataURL.mimeType.toString();
    const { body } = dataURL;

    handler.onRequestStart?.(null, { history: [url] });
    handler.onResponseStart?.(null, 200, { "content-type": contentType }, "OK");
    handler.onResponseData?.(null, body);
    handler.onResponseEnd?.(null, {});

    return true;
  }

  /**
   * Handle file: URLs by reading from the filesystem.
   */
  async #handleFileURL(url, handler, signal) {
    try {
      const filePath = fileURLToPath(url);
      const body = await fsPromises.readFile(filePath, { signal });

      handler.onRequestStart?.(null, { history: [url] });
      handler.onResponseStart?.(null, 200, {}, "OK");
      handler.onResponseData?.(null, body);
      handler.onResponseEnd?.(null, {});

      return true;
    } catch (error) {
      handler.onResponseError?.(null, error);
      return false;
    }
  }

  /**
   * Handle HTTP(S) requests with or without redirect following.
   */
  #dispatchHTTP(opts, handler, { followRedirects }) {
    if (followRedirects) {
      this.#handleHTTPWithRedirects(opts, handler);
    } else {
      this.#handleHTTPWithoutRedirects(opts, handler);
    }
    return true;
  }

  /**
   * Handle HTTP(S) requests without following redirects.
   * Used for WebSocket and when caller handles redirects (like XHR).
   */
  async #handleHTTPWithoutRedirects(opts, handler) {
    const { url, origin: requestOrigin, withCredentials } = opts.opaque;
    const currentMethod = opts.method || "GET";
    const originalHeaders = this.#normalizeHeadersToObject(opts.headers);

    // Determine if this is a cross-origin request (for cookie handling)
    const parsedURL = new URL(url);
    const crossOrigin = requestOrigin !== undefined && requestOrigin !== parsedURL.origin;

    // Only handle cookies for same-origin requests, or cross-origin with credentials
    const shouldHandleCookies = this.#cookieJar && (!crossOrigin || withCredentials);

    // Build request headers
    const requestHeaders = { ...originalHeaders };

    // Set default headers if not already present
    if (!this.#hasHeaderCaseInsensitive(requestHeaders, "User-Agent")) {
      requestHeaders["User-Agent"] = this.#userAgent;
    }
    if (!this.#hasHeaderCaseInsensitive(requestHeaders, "Accept-Language")) {
      requestHeaders["Accept-Language"] = "en";
    }
    if (!this.#hasHeaderCaseInsensitive(requestHeaders, "Accept")) {
      requestHeaders.Accept = "*/*";
    }
    if (!this.#hasHeaderCaseInsensitive(requestHeaders, "Accept-Encoding")) {
      requestHeaders["Accept-Encoding"] = "gzip, deflate";
    }
    if (opts.referrer && !this.#hasHeaderCaseInsensitive(requestHeaders, "Referer")) {
      requestHeaders.Referer = opts.referrer;
    }

    // Add cookies from jar for the current URL (but not for CORS preflight OPTIONS requests)
    const isPreflightRequest = currentMethod === "OPTIONS" &&
      this.#hasHeaderCaseInsensitive(requestHeaders, "Access-Control-Request-Method");
    if (shouldHandleCookies && !isPreflightRequest) {
      try {
        const cookieString = await this.#cookieJar.getCookieString(url);
        if (cookieString) {
          requestHeaders.Cookie = cookieString;
        }
      } catch {
        // Ignore cookie errors
      }
    } else {
      // Yield to allow synchronous abort (e.g., window.close()) to take effect
      await Promise.resolve();
    }

    // Check if aborted after async operations
    if (opts.signal?.aborted) {
      handler.onResponseError?.(null, opts.signal.reason);
      return;
    }

    const dispatchOpts = {
      origin: parsedURL.origin,
      path: parsedURL.pathname + parsedURL.search,
      method: currentMethod,
      headers: requestHeaders,
      body: opts.body,
      signal: opts.signal,
      opaque: opts.opaque
    };

    // Dispatch and stream response, storing cookies from response
    const jar = shouldHandleCookies ? this.#cookieJar : null;
    return this.#dispatchWithCookieHandling(dispatchOpts, handler, url, jar);
  }

  /**
   * Dispatch and stream response, handling cookies but not redirects.
   * Returns a Promise that resolves when the response is complete.
   */
  #dispatchWithCookieHandling(opts, handler, currentURL, cookieJar) {
    return new Promise(resolve => {
      let headers;

      // Build inner dispatch chain with RawHeadersHandler at the innermost layer
      let innerDispatch = (dispatchOpts, h) => {
        return this.#baseDispatcher.dispatch(dispatchOpts, new RawHeadersHandler(h));
      };

      // Apply user interceptors from innermost to outermost
      for (let i = this.#userInterceptors.length - 1; i >= 0; i--) {
        const interceptor = this.#userInterceptors[i];
        const nextDispatch = innerDispatch;
        innerDispatch = (dispatchOpts, h) => interceptor(nextDispatch)(dispatchOpts, h);
      }

      innerDispatch(opts, {
        onRequestStart(controller, context) {
          handler.onRequestStart?.(controller, { ...context, history: [currentURL] });
        },
        onRequestUpgrade(controller, statusCode, headersObj, socket) {
          // Store cookies from upgrade response
          if (cookieJar && headersObj["set-cookie"]) {
            const cookies = Array.isArray(headersObj["set-cookie"]) ?
              headersObj["set-cookie"] :
              [headersObj["set-cookie"]];
            for (const cookie of cookies) {
              cookieJar.setCookieSync(cookie, currentURL, { http: true, ignoreError: true });
            }
          }
          handler.onRequestUpgrade?.(controller, statusCode, headersObj, socket);
        },
        onResponseStart(controller, statusCode, headersObj, statusText) {
          // Convert to HeaderList for cookie extraction
          headers = new HeaderList();
          for (const [key, value] of Object.entries(headersObj)) {
            if (Array.isArray(value)) {
              for (const v of value) {
                headers.append(key, v);
              }
            } else {
              headers.append(key, value);
            }
          }

          const outputHeaders = headerListToObject(headers);
          handler.onResponseStart?.(controller, statusCode, outputHeaders, statusText);
        },
        onResponseData(controller, chunk) {
          handler.onResponseData?.(controller, chunk);
        },
        onResponseEnd(controller, trailers) {
          // Store cookies from this response synchronously
          if (cookieJar) {
            const setCookieHeaders = headers.getAll("set-cookie") || [];
            for (const cookie of setCookieHeaders) {
              try {
                cookieJar.setCookieSync(cookie, currentURL, { ignoreError: true });
              } catch {
                // Ignore cookie errors
              }
            }
          }

          handler.onResponseEnd?.(controller, trailers);
          resolve(true);
        },
        onResponseError(controller, err) {
          handler.onResponseError?.(controller, err);
          resolve(false);
        }
      });
    });
  }

  /**
   * Handle HTTP(S) requests with manual redirect following and cookie capture.
   */
  async #handleHTTPWithRedirects(opts, handler) {
    let currentURL = opts.opaque.url;
    let currentMethod = opts.method || "GET";
    let currentBody = opts.body;
    const originalHeaders = this.#normalizeHeadersToObject(opts.headers);
    const history = [];

    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
      // Build request headers for this request
      const requestHeaders = { ...originalHeaders };

      // Set default headers if not already present
      if (!this.#hasHeaderCaseInsensitive(requestHeaders, "User-Agent")) {
        requestHeaders["User-Agent"] = this.#userAgent;
      }
      if (!this.#hasHeaderCaseInsensitive(requestHeaders, "Accept-Language")) {
        requestHeaders["Accept-Language"] = "en";
      }
      if (!this.#hasHeaderCaseInsensitive(requestHeaders, "Accept")) {
        requestHeaders.Accept = "*/*";
      }
      if (!this.#hasHeaderCaseInsensitive(requestHeaders, "Accept-Encoding")) {
        requestHeaders["Accept-Encoding"] = "gzip, deflate";
      }
      if (opts.referrer && !this.#hasHeaderCaseInsensitive(requestHeaders, "Referer")) {
        requestHeaders.Referer = opts.referrer;
      }

      // Add cookies from jar for the current URL (but not for CORS preflight OPTIONS requests)
      const isPreflightRequest = currentMethod === "OPTIONS" &&
        this.#hasHeaderCaseInsensitive(requestHeaders, "Access-Control-Request-Method");
      if (this.#cookieJar && !isPreflightRequest) {
        try {
          const cookieString = await this.#cookieJar.getCookieString(currentURL);
          if (cookieString) {
            requestHeaders.Cookie = cookieString;
          }
        } catch {
          // Ignore cookie errors
        }
      } else {
        // Yield to allow synchronous abort
        await Promise.resolve();
      }

      // Check if aborted after async operations
      if (opts.signal?.aborted) {
        handler.onResponseError?.(null, opts.signal.reason);
        return;
      }

      const parsedURL = new URL(currentURL);
      const dispatchOpts = {
        origin: parsedURL.origin,
        path: parsedURL.pathname + parsedURL.search,
        method: currentMethod,
        headers: requestHeaders,
        body: currentBody,
        signal: opts.signal,
        opaque: opts.opaque
      };

      // Track current URL in history
      history.push(currentURL);

      // Use streaming dispatch - it will tell us if we need to redirect or can stream
      const result = await this.#dispatchWithStreamingSupport(dispatchOpts, handler, currentURL, history);

      if (result.error) {
        handler.onResponseError?.(null, result.error);
        return;
      }

      if (result.streamed) {
        // Response was streamed directly to handler, we're done
        return;
      }

      if (result.redirect) {
        // Need to follow redirect
        currentURL = result.redirect.url;
        if (result.redirect.methodChange) {
          currentMethod = "GET";
          currentBody = undefined;
        }
        continue;
      }

      // Shouldn't reach here
      return;
    }

    const error = new Error(`Too many redirects (max ${MAX_REDIRECTS})`);
    handler.onResponseError?.(null, error);
  }

  /**
   * Dispatch a request with streaming support.
   * - For redirects: buffers body, stores cookies, returns redirect info
   * - For non-redirects: streams response directly to handler
   */
  #dispatchWithStreamingSupport(opts, handler, currentURL, history) {
    return new Promise(resolve => {
      let statusCode, headers;
      let isRedirect = false;

      // Build inner dispatch chain with RawHeadersHandler at the innermost layer
      let innerDispatch = (dispatchOpts, h) => {
        return this.#baseDispatcher.dispatch(dispatchOpts, new RawHeadersHandler(h));
      };

      // Apply user interceptors from innermost to outermost
      for (let i = this.#userInterceptors.length - 1; i >= 0; i--) {
        const interceptor = this.#userInterceptors[i];
        const nextDispatch = innerDispatch;
        innerDispatch = (dispatchOpts, h) => interceptor(nextDispatch)(dispatchOpts, h);
      }

      const cookieJar = this.#cookieJar;

      innerDispatch(opts, {
        onRequestStart() {},
        onResponseStart(controller, status, headersObj, statusText) {
          statusCode = status;

          // Convert to HeaderList for cookie extraction and redirect detection
          headers = new HeaderList();
          for (const [key, value] of Object.entries(headersObj)) {
            if (Array.isArray(value)) {
              for (const v of value) {
                headers.append(key, v);
              }
            } else {
              headers.append(key, value);
            }
          }

          // Check if this is a redirect
          isRedirect = status >= 300 && status < 400 && headers.get("location");

          if (!isRedirect) {
            // Not a redirect - stream directly to handler
            handler.onRequestStart?.(controller, { history });
            const outputHeaders = headerListToObject(headers);
            handler.onResponseStart?.(controller, statusCode, outputHeaders, statusText);
          }
        },
        onResponseData(controller, chunk) {
          if (!isRedirect) {
            handler.onResponseData?.(controller, chunk);
          }
        },
        async onResponseEnd(controller, trailers) {
          // Store cookies from this response
          if (cookieJar) {
            const setCookieHeaders = headers.getAll("set-cookie") || [];
            await Promise.all(setCookieHeaders.map(
              cookie => cookieJar.setCookie(cookie, currentURL, { ignoreError: true }).catch(() => {})
            ));
          }

          if (isRedirect) {
            const location = headers.get("location");
            const newURL = (new URL(location, currentURL)).href;
            const methodChange = statusCode === 303 ||
              ((statusCode === 301 || statusCode === 302) && opts.method === "POST");

            resolve({ redirect: { url: newURL, methodChange } });
          } else {
            handler.onResponseEnd?.(controller, trailers);
            resolve({ streamed: true });
          }
        },
        onResponseError(controller, err) {
          resolve({ error: err });
        }
      });
    });
  }

  /**
   * Normalize headers to an object format.
   */
  #normalizeHeadersToObject(headers) {
    if (!headers) {
      return {};
    }

    if (Array.isArray(headers)) {
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
   * Check if a header exists (case-insensitive).
   */
  #hasHeaderCaseInsensitive(headers, name) {
    const lowerName = name.toLowerCase();
    return Object.keys(headers).some(key => key.toLowerCase() === lowerName);
  }

  // Dispatcher API methods - forward to base dispatcher

  close(...args) {
    return this.#baseDispatcher.close(...args);
  }

  connect(...args) {
    return this.#baseDispatcher.connect(...args);
  }

  destroy(...args) {
    return this.#baseDispatcher.destroy(...args);
  }

  pipeline(...args) {
    return this.#baseDispatcher.pipeline(...args);
  }

  request(...args) {
    return this.#baseDispatcher.request(...args);
  }

  stream(...args) {
    return this.#baseDispatcher.stream(...args);
  }

  upgrade(...args) {
    return this.#baseDispatcher.upgrade(...args);
  }

  /**
   * Create a new JSDOMDispatcher with additional interceptors.
   * The new interceptors are added as the outermost (first to see requests, last to see responses).
   */
  compose(...additionalInterceptors) {
    return new JSDOMDispatcher({
      baseDispatcher: this.#baseDispatcher,
      cookieJar: this.#cookieJar,
      userAgent: this.#userAgent,
      userInterceptors: [...additionalInterceptors, ...this.#userInterceptors]
    });
  }

  get closed() {
    return this.#baseDispatcher.closed;
  }

  get destroyed() {
    return this.#baseDispatcher.destroyed;
  }
}

/**
 * Convert a HeaderList to an object with lowercase keys.
 */
function headerListToObject(headers) {
  const obj = {};
  for (const [name, value] of headers) {
    const lowerName = name.toLowerCase();
    if (obj[lowerName]) {
      if (Array.isArray(obj[lowerName])) {
        obj[lowerName].push(value);
      } else {
        obj[lowerName] = [obj[lowerName], value];
      }
    } else {
      obj[lowerName] = value;
    }
  }
  return obj;
}

module.exports = {
  JSDOMDispatcher,
  RawHeadersHandler,
  ResponseController,
  rawHeadersToObject,
  DEFAULT_USER_AGENT
};
