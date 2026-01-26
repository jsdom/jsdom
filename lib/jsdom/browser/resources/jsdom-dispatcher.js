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
const { Dispatcher } = require("undici");
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
class JSDOMDispatcher extends Dispatcher {
  #baseDispatcher;
  #cookieJar;
  #userAgent;
  #userInterceptors;

  constructor({ baseDispatcher, cookieJar, userAgent, userInterceptors = [] }) {
    super();
    this.#baseDispatcher = baseDispatcher;
    this.#cookieJar = cookieJar;
    this.#userAgent = userAgent || DEFAULT_USER_AGENT;
    this.#userInterceptors = userInterceptors;
  }

  dispatch(opts, handler) {
    // Wrap handler to normalize OLD API (onConnect/onHeaders/onData/onComplete/onError)
    // to NEW API (onRequestStart/onResponseStart/onResponseData/onResponseEnd/onResponseError)
    const wrappedHandler = WrapHandler.wrap(handler);

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
      return this.#dispatchDataURL(url, wrappedHandler);
    }

    if (url.startsWith("file:")) {
      return this.#dispatchFileURL(url, wrappedHandler, opts.signal);
    }

    // HTTP(S) and WebSocket - all go through #dispatchHTTP
    // Don't follow redirects for XHR (noRedirectFollow) or WebSocket (upgrade)
    const { noRedirectFollow } = opts.opaque || {};
    const followRedirects = !noRedirectFollow && opts.upgrade !== "websocket";
    return this.#dispatchHTTP({ ...opts, opaque: enrichedOpaque }, wrappedHandler, { followRedirects });
  }

  /**
   * Handle data: URLs by decoding them and returning the body.
   */
  #dispatchDataURL(url, handler) {
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
  async #dispatchFileURL(url, handler, signal) {
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
      this.#dispatchHTTPWithRedirects(opts, handler);
    } else {
      this.#dispatchHTTPWithoutRedirects(opts, handler);
    }
    return true;
  }

  /**
   * Handle HTTP(S) requests without following redirects.
   * Used for WebSocket and when caller handles redirects (like XHR).
   */
  async #dispatchHTTPWithoutRedirects(opts, handler) {
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

    const innerDispatch = this.#buildDispatchChain();
    const cookieJar = this.#cookieJar;
    let responseHeaders;

    innerDispatch(dispatchOpts, {
      onRequestStart(controller, context) {
        handler.onRequestStart?.(controller, { ...context, history: [url] });
      },
      onRequestUpgrade(controller, statusCode, headersObj, socket) {
        if (shouldHandleCookies) {
          storeCookiesFromHeaders(cookieJar, headersObj, url);
        }
        handler.onRequestUpgrade?.(controller, statusCode, headersObj, socket);
      },
      onResponseStart(controller, statusCode, headersObj, statusText) {
        responseHeaders = headersObj;
        handler.onResponseStart?.(controller, statusCode, headersObj, statusText);
      },
      onResponseData(controller, chunk) {
        handler.onResponseData?.(controller, chunk);
      },
      onResponseEnd(controller, trailers) {
        if (shouldHandleCookies) {
          storeCookiesFromHeaders(cookieJar, responseHeaders, url);
        }
        handler.onResponseEnd?.(controller, trailers);
      },
      onResponseError(controller, err) {
        handler.onResponseError?.(controller, err);
      }
    });
  }

  /**
   * Handle HTTP(S) requests with manual redirect following and cookie capture.
   */
  async #dispatchHTTPWithRedirects(opts, handler) {
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

      // Dispatch with streaming support - for redirects we capture the info,
      // for non-redirects we stream directly to handler
      const urlForThisRequest = currentURL;
      const innerDispatch = this.#buildDispatchChain();
      const cookieJar = this.#cookieJar;

      const result = await new Promise(resolve => {
        let statusCode, responseHeaders;
        let isRedirect = false;

        innerDispatch(dispatchOpts, {
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
            storeCookiesFromHeaders(cookieJar, responseHeaders, urlForThisRequest);

            if (isRedirect) {
              const { location } = responseHeaders;
              const newURL = (new URL(location, urlForThisRequest)).href;
              const methodChange = statusCode === 303 ||
                ((statusCode === 301 || statusCode === 302) && dispatchOpts.method === "POST");

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
   * Build the dispatch chain with user interceptors applied.
   */
  #buildDispatchChain() {
    let innerDispatch = (opts, h) => {
      return this.#baseDispatcher.dispatch(opts, h);
    };

    // Apply user interceptors from innermost to outermost
    for (let i = this.#userInterceptors.length - 1; i >= 0; i--) {
      const interceptor = this.#userInterceptors[i];
      const nextDispatch = innerDispatch;
      innerDispatch = (opts, h) => interceptor(nextDispatch)(opts, h);
    }

    return innerDispatch;
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

  // Dispatcher API methods - forward close/destroy to base dispatcher

  close(...args) {
    return this.#baseDispatcher.close(...args);
  }

  destroy(...args) {
    return this.#baseDispatcher.destroy(...args);
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
