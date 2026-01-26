"use strict";

// This module provides JSDOMDispatcher, a full undici Dispatcher that handles:
// - data: URLs (decode and return)
// - file: URLs (read from filesystem)
// - HTTP(S): manually follows redirects, capturing cookies at each hop
// - WebSocket: passes through to base dispatcher with cookie handling

const fsPromises = require("fs/promises");
const { fileURLToPath } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const WrapHandler = require("undici/lib/handler/wrap-handler");

const packageVersion = require("../../../../package.json").version;

const DEFAULT_USER_AGENT = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                           `(KHTML, like Gecko) jsdom/${packageVersion}`;
const MAX_REDIRECTS = 20;

/**
 * Extract and store cookies from response headers.
 */
function storeCookiesFromHeaders(cookieJar, headers, url) {
  if (!headers["set-cookie"]) {
    return;
  }
  const cookies = Array.isArray(headers["set-cookie"]) ?
    headers["set-cookie"] :
    [headers["set-cookie"]];
  for (const cookie of cookies) {
    cookieJar.setCookieSync(cookie, url, { ignoreError: true });
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

    // HTTP(S) and WebSocket - all go through #dispatchHTTP
    // Don't follow redirects for XHR (noRedirectFollow) or WebSocket (upgrade)
    const { noRedirectFollow } = opts.opaque || {};
    const followRedirects = !noRedirectFollow && opts.upgrade !== "websocket";
    return this.#dispatchHTTP({ ...opts, opaque: enrichedOpaque }, handler, { followRedirects });
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
    const shouldHandleCookies = !crossOrigin || withCredentials;

    // Build request headers with defaults
    const requestHeaders = { ...originalHeaders };
    this.#setDefaultHeaders(requestHeaders);

    // Add cookies from jar for the current URL (but not for CORS preflight OPTIONS requests)
    const isPreflightRequest = currentMethod === "OPTIONS" &&
      this.#hasHeaderCaseInsensitive(requestHeaders, "Access-Control-Request-Method");
    if (shouldHandleCookies && !isPreflightRequest) {
      const cookieString = await this.#cookieJar.getCookieString(url);
      if (cookieString) {
        requestHeaders.Cookie = cookieString;
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
      upgrade: opts.upgrade,
      opaque: opts.opaque
    };

    // Dispatch and stream response, storing cookies from response
    this.#dispatchWithCookieHandling(dispatchOpts, handler, url, shouldHandleCookies);
  }

  /**
   * Dispatch and stream response, handling cookies but not redirects.
   * Returns a Promise that resolves when the response is complete.
   */
  #dispatchWithCookieHandling(opts, handler, currentURL, shouldStoreCookies) {
    const cookieJar = this.#cookieJar;

    return new Promise(resolve => {
      let responseHeaders;

      // Build inner dispatch chain
      let innerDispatch = (dispatchOpts, h) => {
        return this.#baseDispatcher.dispatch(dispatchOpts, h);
      };

      // Apply user interceptors from innermost to outermost
      for (let i = this.#userInterceptors.length - 1; i >= 0; i--) {
        const interceptor = this.#userInterceptors[i];
        const nextDispatch = innerDispatch;
        innerDispatch = (dispatchOpts, h) => interceptor(nextDispatch)(dispatchOpts, h);
      }

      // Wrap handler to normalize old API → new API
      // Workaround for https://github.com/nodejs/undici/issues/4771
      // (undici's WebSocket uses old handler API)
      const wrappedHandler = WrapHandler.wrap(handler);

      innerDispatch(opts, {
        onRequestStart(controller, context) {
          wrappedHandler.onRequestStart?.(controller, { ...context, history: [currentURL] });
        },
        onRequestUpgrade(controller, statusCode, headersObj, socket) {
          if (shouldStoreCookies) {
            storeCookiesFromHeaders(cookieJar, headersObj, currentURL);
          }
          wrappedHandler.onRequestUpgrade?.(controller, statusCode, headersObj, socket);
        },
        onResponseStart(controller, statusCode, headersObj, statusText) {
          responseHeaders = headersObj;
          wrappedHandler.onResponseStart?.(controller, statusCode, headersObj, statusText);
        },
        onResponseData(controller, chunk) {
          wrappedHandler.onResponseData?.(controller, chunk);
        },
        onResponseEnd(controller, trailers) {
          if (shouldStoreCookies) {
            storeCookiesFromHeaders(cookieJar, responseHeaders, currentURL);
          }
          wrappedHandler.onResponseEnd?.(controller, trailers);
          resolve(true);
        },
        onResponseError(controller, err) {
          wrappedHandler.onResponseError?.(controller, err);
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
      // Build request headers with defaults
      const requestHeaders = { ...originalHeaders };
      this.#setDefaultHeaders(requestHeaders);

      // Add cookies from jar for the current URL (but not for CORS preflight OPTIONS requests)
      const isPreflightRequest = currentMethod === "OPTIONS" &&
        this.#hasHeaderCaseInsensitive(requestHeaders, "Access-Control-Request-Method");
      if (!isPreflightRequest) {
        const cookieString = await this.#cookieJar.getCookieString(currentURL);
        if (cookieString) {
          requestHeaders.Cookie = cookieString;
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
      let statusCode, responseHeaders;
      let isRedirect = false;

      // Build inner dispatch chain
      let innerDispatch = (dispatchOpts, h) => {
        return this.#baseDispatcher.dispatch(dispatchOpts, h);
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
          responseHeaders = headersObj;

          // Check if this is a redirect
          isRedirect = status >= 300 && status < 400 && headersObj.location;

          if (!isRedirect) {
            // Not a redirect - stream directly to handler
            handler.onRequestStart?.(controller, { history });
            handler.onResponseStart?.(controller, statusCode, headersObj, statusText);
          }
        },
        onResponseData(controller, chunk) {
          if (!isRedirect) {
            handler.onResponseData?.(controller, chunk);
          }
        },
        onResponseEnd(controller, trailers) {
          storeCookiesFromHeaders(cookieJar, responseHeaders, currentURL);

          if (isRedirect) {
            const { location } = responseHeaders;
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
   * Callers pass either HeaderList (iterable) or plain objects.
   */
  #normalizeHeadersToObject(headers) {
    if (!headers) {
      return {};
    }

    // HeaderList has Symbol.iterator; plain objects don't
    if (typeof headers[Symbol.iterator] === "function") {
      const obj = {};
      for (const [name, value] of headers) {
        obj[name] = value;
      }
      return obj;
    }

    return { ...headers };
  }

  /**
   * Check if a header exists (case-insensitive).
   */
  #hasHeaderCaseInsensitive(headers, name) {
    const lowerName = name.toLowerCase();
    return Object.keys(headers).some(key => key.toLowerCase() === lowerName);
  }

  /**
   * Set default headers if not already present.
   * Mutates the headers object in place.
   */
  #setDefaultHeaders(headers) {
    if (!this.#hasHeaderCaseInsensitive(headers, "User-Agent")) {
      headers["User-Agent"] = this.#userAgent;
    }
    if (!this.#hasHeaderCaseInsensitive(headers, "Accept-Language")) {
      headers["Accept-Language"] = "en";
    }
    if (!this.#hasHeaderCaseInsensitive(headers, "Accept")) {
      headers.Accept = "*/*";
    }
    if (!this.#hasHeaderCaseInsensitive(headers, "Accept-Encoding")) {
      headers["Accept-Encoding"] = "gzip, deflate";
    }
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

module.exports = {
  JSDOMDispatcher,
  DEFAULT_USER_AGENT
};
