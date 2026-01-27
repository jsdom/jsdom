"use strict";

// This module provides JSDOMDispatcher, a full undici Dispatcher that handles:
// - data: URLs (decode and return)
// - file: URLs (read from filesystem)
// - HTTP(S): manually follows redirects, capturing cookies at each hop, with optional CORS handling
// - WebSocket: passes through to base dispatcher with cookie handling

const fsPromises = require("fs/promises");
const { fileURLToPath } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const { Dispatcher } = require("undici");
const WrapHandler = require("undici/lib/handler/wrap-handler.js");
const { toBase64 } = require("@exodus/bytes/base64.js");
const { utf8Encode } = require("../../living/helpers/encoding");

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
 * Callers should provide the expected opaque fields when possible, to ensure that various parts of the jsdom pipeline
 * have enough information. See the `dispatch()` JSDoc for details.
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

  /**
   * Dispatch a request through the jsdom resource loading pipeline.
   *
   * Vaguely corresponds to:
   * - https://fetch.spec.whatwg.org/#concept-fetch: in theory, all jsdom fetches should go through here, like all web
   *   platform fetches go through #concept-fetch.
   * - https://fetch.spec.whatwg.org/#concept-scheme-fetch: the code is more like skipping straight to scheme fetch.
   *
   * @param {object} opts - undici dispatch options
   * @param {object} [opts.opaque] - jsdom-specific request context (may be undefined for WebSocket upgrades)
   * @param {Element|null} opts.opaque.element - DOM element that triggered the request
   * @param {string} opts.opaque.url - Full request URL (since we cannot reconstruct it from `opts.origin + opts.path`
   * for `file:` URLs)
   * @param {string} [opts.opaque.origin] - Request origin for CORS (used by XHR)
   * @param {boolean} [opts.opaque.corsMode] - Enable CORS validation during redirects (used by XHR)
   * @param {boolean} [opts.opaque.withCredentials] - Include cookies cross-origin (used by XHR)
   * @param {Object} [opts.opaque.auth] - Auth credentials {user, pass} for 401 Basic auth handling
   * @param {Object} [opts.opaque.preflight] - If present, do CORS preflight before main request
   * @param {string[]} [opts.opaque.preflight.unsafeHeaders] - Non-simple headers that need to be allowed
   * @param {object} handler - undici handler
   */
  dispatch(opts, handler) {
    // Wrap handler to normalize OLD API (onConnect/onHeaders/onData/onComplete/onError)
    // to NEW API (onRequestStart/onResponseStart/onResponseData/onResponseEnd/onResponseError)
    const wrappedHandler = WrapHandler.wrap(handler);

    // Get URL from opaque if present (required for file: URLs since they have origin "null"),
    // otherwise reconstruct from opts.origin + opts.path (works for http/https/ws/wss)
    const url = opts.opaque?.url || (opts.origin + opts.path);

    // Route by URL scheme
    if (url.startsWith("data:")) {
      return this.#dispatchDataURL(url, wrappedHandler);
    }

    if (url.startsWith("file:")) {
      return this.#dispatchFileURL(url, wrappedHandler, opts.signal);
    }

    // HTTP(S) and WebSocket
    if (opts.upgrade === "websocket") {
      // TODO: Migrate WebSocket to use #httpNetworkOrCacheFetch() after XHR is stable
      return this.#dispatchWebSocket(opts, wrappedHandler, url);
    }

    // Regular HTTP (handles redirects, CORS, preflight)
    this.#dispatchHTTP(opts, wrappedHandler, url);
    return true;
  }

  /**
   * Handle `data:` URLs by decoding them and returning the body.
   *
   * Corresponds fairly directly to https://fetch.spec.whatwg.org/#concept-scheme-fetch's "data" scheme case.
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
   * Handle `file:` URLs by reading from the filesystem.
   *
   * Corresponds fairly directly to https://fetch.spec.whatwg.org/#concept-scheme-fetch's "file" scheme case.
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
   * Handle WebSocket upgrades.
   * TODO: Migrate to use #httpNetworkOrCacheFetch() after XHR is stable.
   */
  async #dispatchWebSocket(opts, handler, url) {
    const { origin: requestOrigin, withCredentials } = opts.opaque || {};
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
      this.#hasRequestHeader(requestHeaders, "Access-Control-Request-Method");
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
      ...opts,
      origin: parsedURL.origin,
      path: parsedURL.pathname + parsedURL.search,
      method: currentMethod,
      headers: requestHeaders,
      opaque: { ...opts.opaque, url }
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
   * High-level HTTP(S) fetch with redirect handling, CORS validation, and preflight.
   *
   * Corresponds roughly to https://fetch.spec.whatwg.org/#concept-http-fetch, although some parts of
   * https://fetch.spec.whatwg.org/#concept-fetch also live here.
   */
  async #dispatchHTTP(opts, handler, url) {
    const { corsMode, origin, withCredentials, auth, preflight } = opts.opaque || {};
    let currentURL = url;
    let currentMethod = opts.method || "GET";
    let currentBody = opts.body;
    const currentHeaders = { ...this.#normalizeHeadersToObject(opts.headers) };
    let effectiveOrigin = origin; // CORS tracking - may become "null" after cross-origin redirects
    let receivedAuthChallenge = false;
    const history = [];

    // Handle CORS preflight if needed
    if (preflight) {
      const preflightHeaders = {
        Origin: origin
      };
      preflightHeaders["Access-Control-Request-Method"] = currentMethod;
      if (preflight.unsafeHeaders?.length > 0) {
        preflightHeaders["Access-Control-Request-Headers"] = preflight.unsafeHeaders.join(", ");
      }

      const preflightResult = await this.#doSingleRequest(
        currentURL,
        "OPTIONS",
        preflightHeaders,
        null,
        { ...opts.opaque, origin, withCredentials },
        opts.signal
      );

      if (preflightResult.error) {
        handler.onResponseError?.(null, preflightResult.error);
        return;
      }

      // Validate preflight response status
      if (preflightResult.status < 200 || preflightResult.status > 299) {
        handler.onResponseError?.(null, new Error(
          "Response for preflight has invalid HTTP status code " + preflightResult.status
        ));
        return;
      }

      // CORS validation on preflight response
      const acao = preflightResult.headers["access-control-allow-origin"];
      if (acao !== "*" && acao !== origin) {
        handler.onResponseError?.(null, new Error("Cross origin " + origin + " forbidden"));
        return;
      }
      if (withCredentials) {
        const acac = preflightResult.headers["access-control-allow-credentials"];
        if (acac !== "true") {
          handler.onResponseError?.(null, new Error("Credentials forbidden"));
          return;
        }
      }

      // Validate allowed headers
      const acahStr = preflightResult.headers["access-control-allow-headers"];
      const acah = new Set(acahStr ? acahStr.toLowerCase().split(/,\s*/) : []);
      if (!acah.has("*")) {
        for (const unsafeHeader of preflight.unsafeHeaders || []) {
          if (!acah.has(unsafeHeader.toLowerCase())) {
            handler.onResponseError?.(null, new Error("Header " + unsafeHeader + " forbidden"));
            return;
          }
        }
      }
    }

    // Redirect loop
    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
      history.push(currentURL);

      // Clone headers for this request
      const requestHeaders = { ...currentHeaders };

      // Add auth header if needed
      if (receivedAuthChallenge && auth) {
        const authString = `${auth.user || ""}:${auth.pass || ""}`;
        requestHeaders.Authorization = "Basic " + toBase64(utf8Encode(authString));
      }

      const result = await this.#doSingleRequest(
        currentURL,
        currentMethod,
        requestHeaders,
        currentBody,
        { ...opts.opaque, origin, withCredentials },
        opts.signal
      );

      if (result.error) {
        handler.onResponseError?.(null, result.error);
        return;
      }

      // Handle 401 auth challenge
      if (result.status === 401 && auth && !receivedAuthChallenge) {
        const wwwAuth = result.headers["www-authenticate"] || "";
        if (/^Basic /i.test(wwwAuth)) {
          receivedAuthChallenge = true;
          continue;
        }
      }

      // Handle redirect
      const { location } = result.headers;
      if (result.status >= 300 && result.status < 400 && location) {
        const sourceURL = currentURL;
        const sourceOrigin = new URL(sourceURL).origin;
        const targetURL = new URL(location, sourceURL);
        const targetOrigin = targetURL.origin;
        currentURL = targetURL.href;

        // Method change per fetch spec "HTTP-redirect fetch"
        // 301/302 + POST → GET, 303 + non-GET/HEAD → GET
        if (((result.status === 301 || result.status === 302) && currentMethod === "POST") ||
            (result.status === 303 && !["GET", "HEAD"].includes(currentMethod))) {
          currentMethod = "GET";
          currentBody = undefined;
          this.#deleteRequestHeader(currentHeaders, "content-encoding");
          this.#deleteRequestHeader(currentHeaders, "content-language");
          this.#deleteRequestHeader(currentHeaders, "content-location");
          this.#deleteRequestHeader(currentHeaders, "content-type");
        }

        // Authorization header removal on cross-origin redirect
        if (sourceOrigin !== targetOrigin) {
          this.#deleteRequestHeader(currentHeaders, "authorization");
        }

        // CORS handling for cross-origin redirects (only if origin is set, indicating XHR/fetch)
        const targetIsCrossOrigin = origin !== undefined && origin !== targetOrigin;
        if (corsMode || targetIsCrossOrigin) {
          // CORS validation on redirect response (if source was cross-origin)
          if (origin !== sourceOrigin && !sourceURL.startsWith("data:")) {
            const acao = result.headers["access-control-allow-origin"];
            if (acao !== "*" && acao !== origin) {
              handler.onResponseError?.(null, new Error("Cross origin " + origin + " forbidden"));
              return;
            }
            if (withCredentials) {
              const acac = result.headers["access-control-allow-credentials"];
              if (acac !== "true") {
                handler.onResponseError?.(null, new Error("Credentials forbidden"));
                return;
              }
            }
            // Userinfo check - forbid redirects to URLs with username/password
            if (targetURL.username || targetURL.password) {
              handler.onResponseError?.(null, new Error("Userinfo forbidden in cors redirect"));
              return;
            }
            // Update effective origin - becomes "null" after cross-origin→cross-origin redirect
            if (sourceOrigin !== targetOrigin && sourceOrigin !== origin) {
              effectiveOrigin = "null";
            }
          }

          // Add Origin header for cross-origin target
          if (targetIsCrossOrigin) {
            currentHeaders.Origin = effectiveOrigin;
          }
        }

        continue;
      }

      // Final response - CORS validation (if origin is set and destination is cross-origin)
      if (origin !== undefined) {
        const destOrigin = new URL(currentURL).origin;
        const destIsCrossOrigin = origin !== destOrigin && !currentURL.startsWith("data:");
        if (destIsCrossOrigin) {
          const acao = result.headers["access-control-allow-origin"];
          if (acao !== "*" && acao !== effectiveOrigin) {
            handler.onResponseError?.(null, new Error("Cross origin " + effectiveOrigin + " forbidden"));
            return;
          }
          if (withCredentials) {
            const acac = result.headers["access-control-allow-credentials"];
            if (acac !== "true") {
              handler.onResponseError?.(null, new Error("Credentials forbidden"));
              return;
            }
          }
        }
      }

      // Stream response to handler - use the controller from the inner dispatch
      handler.onRequestStart?.(result.controller, { history });
      handler.onResponseStart?.(result.controller, result.status, result.headers, result.statusText);

      // Forward body chunks to handler
      result.forwardBodyTo(handler);
      return;
    }

    handler.onResponseError?.(null, new Error(`Too many redirects (max ${MAX_REDIRECTS})`));
  }

  /**
   * Perform a single HTTP request (no redirects).
   * Handles cookies based on cross-origin/credentials settings.
   * Returns response metadata immediately, with a forwardBodyTo() method to stream the body later.
   *
   * Mostly corresponds to https://fetch.spec.whatwg.org/#concept-http-network-fetch.
   */
  async #doSingleRequest(url, method, headers, body, opaque, signal) {
    const parsedURL = new URL(url);
    const { origin: requestOrigin, withCredentials } = opaque || {};

    // Build headers with defaults
    const requestHeaders = { ...headers };
    this.#setDefaultHeaders(requestHeaders);

    // Determine if this is cross-origin (for cookie handling)
    const crossOrigin = requestOrigin !== undefined && requestOrigin !== parsedURL.origin;

    // Only handle cookies for same-origin requests, or cross-origin with credentials
    // Don't send cookies for preflight requests
    const isPreflight = method === "OPTIONS" &&
      this.#hasRequestHeader(headers, "Access-Control-Request-Method");
    const shouldHandleCookies = (!crossOrigin || withCredentials) && !isPreflight;

    if (shouldHandleCookies) {
      const cookieString = await this.#cookieJar.getCookieString(url);
      if (cookieString) {
        requestHeaders.Cookie = cookieString;
      }
    } else {
      // Yield to allow synchronous abort (e.g., window.close()) to take effect
      await Promise.resolve();
    }

    // Check if aborted after async operations
    if (signal?.aborted) {
      return { error: signal.reason };
    }

    const dispatchOpts = {
      origin: parsedURL.origin,
      path: parsedURL.pathname + parsedURL.search,
      method,
      headers: requestHeaders,
      body,
      signal,
      opaque: { ...opaque, url }
    };

    const innerDispatch = this.#buildDispatchChain();
    const cookieJar = this.#cookieJar;

    return new Promise(resolve => {
      let responseHeaders, responseController, streamError;
      let bodyHandler = null;
      let pendingChunks = [];
      let ended = false;
      let responseStarted = false;

      innerDispatch(dispatchOpts, {
        onRequestStart(controller) {
          responseController = controller;
        },
        onResponseStart(controller, statusCode, headersObj, statusText) {
          responseHeaders = headersObj;
          responseController = controller;
          responseStarted = true;

          // Create a mechanism to forward body to handler later
          function forwardBodyTo(fwdHandler) {
            bodyHandler = fwdHandler;
            // Forward any chunks that arrived before forwardBodyTo was called
            for (const chunk of pendingChunks) {
              fwdHandler.onResponseData?.(responseController, chunk);
            }
            pendingChunks = null;
            if (streamError) {
              fwdHandler.onResponseError?.(responseController, streamError);
            } else if (ended) {
              fwdHandler.onResponseEnd?.(responseController, {});
            }
          }

          resolve({
            status: statusCode,
            statusText: statusText || "",
            headers: responseHeaders,
            url,
            controller: responseController,
            forwardBodyTo
          });
        },
        onResponseData(controller, chunk) {
          if (bodyHandler) {
            bodyHandler.onResponseData?.(controller, chunk);
          } else {
            pendingChunks.push(chunk);
          }
        },
        onResponseEnd(controller, trailers) {
          if (shouldHandleCookies) {
            storeCookiesFromHeaders(cookieJar, responseHeaders, url);
          }
          if (bodyHandler) {
            bodyHandler.onResponseEnd?.(controller, trailers);
          } else {
            ended = true;
          }
        },
        onResponseError(controller, err) {
          if (responseStarted) {
            // Error occurred mid-stream - forward to body handler
            if (bodyHandler) {
              bodyHandler.onResponseError?.(controller, err);
            } else {
              streamError = err;
            }
          } else {
            resolve({ error: err });
          }
        }
      });
    });
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
   * Check if a request header exists (case-insensitive).
   * Request headers may have user-controlled casing.
   */
  #hasRequestHeader(requestHeaders, name) {
    const lowerName = name.toLowerCase();
    return Object.keys(requestHeaders).some(key => key.toLowerCase() === lowerName);
  }

  /**
   * Delete a request header (case-insensitive).
   * Request headers may have user-controlled casing. Mutates the object in place.
   */
  #deleteRequestHeader(requestHeaders, name) {
    const lowerName = name.toLowerCase();
    for (const key of Object.keys(requestHeaders)) {
      if (key.toLowerCase() === lowerName) {
        delete requestHeaders[key];
      }
    }
  }

  /**
   * Set default request headers if not already present.
   * Mutates the headers object in place.
   */
  #setDefaultHeaders(requestHeaders) {
    if (!this.#hasRequestHeader(requestHeaders, "User-Agent")) {
      requestHeaders["User-Agent"] = this.#userAgent;
    }
    if (!this.#hasRequestHeader(requestHeaders, "Accept-Language")) {
      requestHeaders["Accept-Language"] = "en";
    }
    if (!this.#hasRequestHeader(requestHeaders, "Accept")) {
      requestHeaders.Accept = "*/*";
    }
    if (!this.#hasRequestHeader(requestHeaders, "Accept-Encoding")) {
      requestHeaders["Accept-Encoding"] = "gzip, deflate";
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
