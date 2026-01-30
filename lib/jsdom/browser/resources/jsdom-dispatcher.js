"use strict";
const fs = require("fs");
const { Readable } = require("stream");
const { fileURLToPath } = require("url");
const { parseURL, serializeURL, serializeURLOrigin, serializePath } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const { Dispatcher } = require("undici");
const WrapHandler = require("undici/lib/handler/wrap-handler.js");
const { toBase64 } = require("@exodus/bytes/base64.js");
const { utf8Encode } = require("../../living/helpers/encoding");
const { sendStreamResponse } = require("./stream-handler");

const packageVersion = require("../../../../package.json").version;

const DEFAULT_USER_AGENT = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                           `(KHTML, like Gecko) jsdom/${packageVersion}`;
const MAX_REDIRECTS = 20;

/**
 * JSDOMDispatcher - Full undici Dispatcher implementation for jsdom.
 *
 * Handles:
 * - data: URLs (decode and return)
 * - file: URLs (read from filesystem)
 * - HTTP(S) and web sockets: follows redirects manually, capturing cookies at each hop
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
   * for `file:` URLs). If given, `opts.origin`, `opts.path`, and `opts.query` are ignored.
   * @param {string} [opts.opaque.origin] - Request origin for CORS (used by XHR)
   * @param {boolean} [opts.opaque.corsMode] - Enable CORS validation during redirects (used by XHR)
   * @param {boolean} [opts.opaque.withCredentials] - Include cookies cross-origin (used by XHR)
   * @param {Object} [opts.opaque.auth] - Auth credentials {user, pass} for 401 Basic auth handling
   * @param {Object} [opts.opaque.preflight] - If present, do CORS preflight before main request
   * @param {string[]} [opts.opaque.preflight.unsafeHeaders] - Non-simple headers that need to be allowed
   * @param {object} handler - undici handler
   */
  dispatch(opts, handler) {
    // Wrap handler to normalize OLD API (onConnect/onHeaders/onData/onComplete/onError) to NEW API
    // (onRequestStart/onResponseStart/onResponseData/onResponseEnd/onResponseError). This is necessary because undici's
    // internals call the old API a lot, despite it being undocumented:
    // * https://github.com/nodejs/undici/issues/4771
    // * https://github.com/nodejs/undici/issues/4780
    const wrappedHandler = WrapHandler.wrap(handler);

    // Get URL from opaque if present (required for file: URLs since they have origin "null"),
    // otherwise reconstruct from opts.origin + opts.path (works for http/https/ws/wss)
    const urlString = opts.opaque?.url || (opts.origin + opts.path);
    const urlRecord = parseURL(urlString);

    if (urlRecord === null) {
      wrappedHandler.onResponseError?.(null, new TypeError(`Invalid URL: ${urlString}`));
      return false;
    }

    if (urlRecord.scheme === "data") {
      return this.#dispatchDataURL(urlRecord, wrappedHandler);
    }

    if (urlRecord.scheme === "file") {
      return this.#dispatchFileURL(urlRecord, wrappedHandler);
    }

    // HTTP(S) - handles redirects, CORS, preflight, and WebSocket upgrades
    this.#dispatchHTTP(urlRecord, wrappedHandler, opts);
    return true;
  }

  /**
   * Handle `data:` URLs by decoding them and returning the body.
   *
   * Corresponds fairly directly to https://fetch.spec.whatwg.org/#concept-scheme-fetch's "data" scheme case.
   */
  #dispatchDataURL(urlRecord, handler) {
    const dataURL = dataURLFromRecord(urlRecord);
    if (dataURL === null) {
      const error = new TypeError("Invalid data: URL");
      handler.onResponseError?.(null, error);
      return false;
    }

    const stream = Readable.from([dataURL.body]);

    sendStreamResponse(handler, stream, {
      status: 200,
      statusText: "OK",
      headers: { "content-type": dataURL.mimeType.toString() },
      context: { finalURL: urlRecord }
    });

    return true;
  }

  /**
   * Handle `file:` URLs by reading from the filesystem.
   *
   * Corresponds fairly directly to https://fetch.spec.whatwg.org/#concept-scheme-fetch's "file" scheme case.
   */
  #dispatchFileURL(urlRecord, handler) {
    const filePath = fileURLToPath(serializeURL(urlRecord));
    const stream = fs.createReadStream(filePath);

    sendStreamResponse(handler, stream, {
      status: 200,
      statusText: "OK",
      context: { finalURL: urlRecord }
    });

    return true;
  }

  /**
   * High-level HTTP(S) fetch with redirect handling, CORS validation, and preflight.
   *
   * Corresponds roughly to https://fetch.spec.whatwg.org/#concept-http-fetch, although some parts of
   * https://fetch.spec.whatwg.org/#concept-fetch also live here.
   */
  async #dispatchHTTP(urlRecord, handler, opts) {
    const { corsMode, origin, withCredentials, auth, preflight } = opts.opaque || {};
    const requestFragment = urlRecord.fragment;
    let currentURL = urlRecord;
    let currentMethod = opts.method || "GET";
    let currentBody = opts.body ?? null;
    const currentHeaders = { ...this.#normalizeHeadersToObject(opts.headers) };
    let effectiveOrigin = origin; // CORS tracking - may become "null" after cross-origin redirects
    let receivedAuthChallenge = false;
    const ctx = { finalURL: null };

    // Create a proxy controller that forwards to the current underlying controller.
    // This provides a stable reference across redirect hops.
    let currentController;
    let onRequestStartCalled = false;
    const proxyController = {
      abort(reason) {
        currentController.abort(reason);
      },
      pause() {
        currentController.pause();
      },
      resume() {
        currentController.resume();
      },
      get paused() {
        return currentController.paused;
      },
      get aborted() {
        return currentController.aborted;
      },
      get reason() {
        return currentController.reason;
      }
    };

    // Callback for #doSingleRequest to invoke when a controller becomes available
    function onControllerReady(controller) {
      currentController = controller;
      if (!onRequestStartCalled) {
        onRequestStartCalled = true;
        handler.onRequestStart?.(proxyController, ctx);
      }
    }

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
        undefined, // no upgrade for preflight
        opts,
        onControllerReady
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
      ctx.finalURL = currentURL;
      const currentOrigin = serializeURLOrigin(currentURL);

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
        opts.upgrade,
        opts,
        onControllerReady
      );

      // WebSocket upgrade
      if (result.upgraded) {
        handler.onRequestUpgrade?.(proxyController, result.statusCode, result.headers, result.socket);
        return;
      }

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
        const targetURL = parseURL(location, { baseURL: currentURL });
        if (!targetURL) {
          handler.onResponseError?.(null, new TypeError("Invalid redirect URL"));
          return;
        }

        // Per fetch spec: if location's fragment is null, inherit from request
        if (targetURL.fragment === null) {
          targetURL.fragment = requestFragment;
        }

        // Per fetch spec: if locationURL's scheme is not HTTP(S), return a network error
        if (targetURL.scheme !== "http" && targetURL.scheme !== "https") {
          handler.onResponseError?.(null, new Error("Cannot redirect to non-HTTP(S) URL"));
          return;
        }

        // Method change per fetch spec "HTTP-redirect fetch"
        // 301/302 + POST → GET, 303 + non-GET/HEAD → GET
        if (((result.status === 301 || result.status === 302) && currentMethod === "POST") ||
            (result.status === 303 && !["GET", "HEAD"].includes(currentMethod))) {
          currentMethod = "GET";
          currentBody = null;
          this.#deleteRequestHeader(currentHeaders, "content-encoding");
          this.#deleteRequestHeader(currentHeaders, "content-language");
          this.#deleteRequestHeader(currentHeaders, "content-location");
          this.#deleteRequestHeader(currentHeaders, "content-type");
        }

        const targetOrigin = serializeURLOrigin(targetURL);

        // Authorization header removal on cross-origin redirect
        if (currentOrigin !== targetOrigin) {
          this.#deleteRequestHeader(currentHeaders, "authorization");
        }

        // CORS handling for cross-origin redirects (only if origin is set, indicating XHR/fetch)
        const targetIsCrossOrigin = origin !== undefined && origin !== targetOrigin;
        if (corsMode || targetIsCrossOrigin) {
          // CORS validation on redirect response (if source was cross-origin)
          if (origin !== currentOrigin) {
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
            if (currentOrigin !== targetOrigin) {
              effectiveOrigin = "null";
            }
          }

          // Add Origin header for cross-origin target or if effective origin became "null"
          if (targetIsCrossOrigin || effectiveOrigin === "null") {
            currentHeaders.Origin = effectiveOrigin;
          }
        }

        currentURL = targetURL;
        continue;
      }

      // Final response - CORS validation (if destination is cross-origin or effective origin is "null")
      if (origin !== undefined && (origin !== currentOrigin || effectiveOrigin === "null")) {
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

      // Stream response to handler
      handler.onResponseStart?.(proxyController, result.status, result.headers, result.statusText);

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
   * For WebSocket upgrades, returns { upgraded: true, controller, statusCode, headers, socket }.
   *
   * Mostly corresponds to https://fetch.spec.whatwg.org/#concept-http-network-fetch.
   *
   * @param {object} url - URL record to request
   * @param {string} method - HTTP method
   * @param {object} headers - Request headers
   * @param {*} body - Request body
   * @param {object} opaque - jsdom opaque options
   * @param {string} upgrade - Upgrade protocol (e.g., "websocket")
   * @param {object} originalOpts - Original dispatch options to preserve extra undici options
   * @param {function} onControllerReady - Callback invoked when controller is available
   */
  async #doSingleRequest(url, method, headers, body, opaque, upgrade, originalOpts, onControllerReady) {
    const { origin: requestOrigin, withCredentials } = opaque || {};

    // Build headers with defaults
    const requestHeaders = { ...headers };
    this.#setDefaultHeaders(requestHeaders);

    if (body === null && (method === "POST" || method === "PUT")) {
      requestHeaders["Content-Length"] = "0";
    } else if (body !== null && body.byteLength !== undefined) {
      // The `body.byteLength !== undefined` check is equivalent to the spec case where httpRequest's body's length is
      // null, because body is a stream.
      requestHeaders["Content-Length"] = String(body.byteLength);
    }

    // Determine if this is cross-origin (for cookie handling)
    const urlOrigin = serializeURLOrigin(url);
    const crossOrigin = requestOrigin !== undefined && requestOrigin !== urlOrigin;

    // Only handle cookies for same-origin requests, or cross-origin with credentials
    // Don't send cookies for preflight requests
    const isPreflight = method === "OPTIONS" &&
      this.#hasRequestHeader(headers, "Access-Control-Request-Method");
    const shouldHandleCookies = (!crossOrigin || withCredentials) && !isPreflight;

    const urlSerialized = serializeURL(url);

    if (shouldHandleCookies) {
      const cookieString = this.#cookieJar.getCookieStringSync(urlSerialized);
      if (cookieString) {
        requestHeaders.Cookie = cookieString;
      }
    }

    // Spread original opts to preserve extra undici options (e.g., idempotent, bodyTimeout),
    // then override with our specific values.
    // If opaque.url was provided, derive origin/path from it and null out query.
    // Otherwise, pass through origin/path/query unchanged.
    const hasOpaqueURL = opaque?.url !== undefined;
    const dispatchOpts = {
      ...originalOpts,
      origin: hasOpaqueURL ? urlOrigin : originalOpts.origin,
      path: hasOpaqueURL ? serializePathForUndici(url) : originalOpts.path,
      query: hasOpaqueURL ? null : originalOpts.query,
      method,
      headers: requestHeaders,
      body,
      upgrade,
      opaque: { ...opaque, url: urlSerialized }
    };

    const innerDispatch = this.#buildDispatchChain();

    return new Promise(resolve => {
      let responseHeaders, streamError;
      let bodyHandler = null;
      let pendingChunks = [];
      let ended = false;
      let responseStarted = false;

      innerDispatch(dispatchOpts, {
        onRequestStart: controller => {
          onControllerReady(controller);
        },
        onRequestUpgrade: (controller, statusCode, headersObj, socket) => {
          if (controller.aborted) {
            resolve({ error: controller.reason });
            return;
          }
          if (shouldHandleCookies) {
            this.#storeCookiesFromHeaders(headersObj, urlSerialized);
          }
          resolve({ upgraded: true, controller, statusCode, headers: headersObj, socket });
        },
        onResponseStart: (controller, statusCode, headersObj, statusText) => {
          if (controller.aborted) {
            resolve({ error: controller.reason });
            return;
          }

          responseHeaders = headersObj;
          responseStarted = true;

          // Create a mechanism to forward body to handler later
          function forwardBodyTo(fwdHandler) {
            bodyHandler = fwdHandler;
            // Forward any chunks that arrived before forwardBodyTo was called
            for (const chunk of pendingChunks) {
              fwdHandler.onResponseData?.(controller, chunk);
            }
            pendingChunks = null;
            if (streamError) {
              fwdHandler.onResponseError?.(controller, streamError);
            } else if (ended) {
              fwdHandler.onResponseEnd?.(controller, {});
            }
          }

          resolve({
            status: statusCode,
            statusText: statusText || "",
            headers: responseHeaders,
            url,
            forwardBodyTo
          });
        },
        onResponseData: (controller, chunk) => {
          if (controller.aborted) {
            return;
          }
          if (bodyHandler) {
            bodyHandler.onResponseData?.(controller, chunk);
          } else {
            pendingChunks.push(chunk);
          }
        },
        onResponseEnd: (controller, trailers) => {
          if (controller.aborted) {
            if (bodyHandler) {
              bodyHandler.onResponseError?.(controller, controller.reason);
            } else {
              streamError = controller.reason;
            }
            return;
          }
          if (shouldHandleCookies) {
            this.#storeCookiesFromHeaders(responseHeaders, urlSerialized);
          }
          if (bodyHandler) {
            bodyHandler.onResponseEnd?.(controller, trailers);
          } else {
            ended = true;
          }
        },
        onResponseError: (controller, err) => {
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

  /**
   * Extract and store cookies from response headers.
   */
  #storeCookiesFromHeaders(headers, url) {
    if (!headers["set-cookie"]) {
      return;
    }
    const cookies = Array.isArray(headers["set-cookie"]) ?
      headers["set-cookie"] :
      [headers["set-cookie"]];
    for (const cookie of cookies) {
      this.#cookieJar.setCookieSync(cookie, url, { ignoreError: true });
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

/**
 * High-level GET fetch that collects the full response body. Used for subresources and `JSDOM.fromURL()`.
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
  const urlRecord = parseURL(url);
  if (!urlRecord) {
    throw new TypeError(`Invalid URL: ${url}`);
  }

  const response = await dispatcher.request({
    origin: serializeURLOrigin(urlRecord),
    path: serializePathForUndici(urlRecord),
    method: "GET",
    headers,
    signal,
    opaque: { element, url }
  });

  const body = await response.body.bytes();

  // Get final URL from context (set by dispatcher after handling redirects)
  const finalURL = serializeURL(response.context.finalURL);

  return {
    status: response.statusCode,
    headers: response.headers,
    body,
    url: finalURL,
    ok: response.statusCode >= 200 && response.statusCode < 300
  };
}

/**
 * Serialize a URL record's path and query for undici's `path` option.
 */
function serializePathForUndici(urlRecord) {
  return serializePath(urlRecord) + (urlRecord.query ? "?" + urlRecord.query : "");
}

module.exports = {
  JSDOMDispatcher,
  DEFAULT_USER_AGENT,
  fetchCollected
};
