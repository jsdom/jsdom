"use strict";
const { Readable } = require("stream");
const { URL } = require("whatwg-url");
const DOMException = require("../generated/DOMException");
const HeaderList = require("../fetch/header-list");

const headerListSeparatorRegexp = /,[ \t]*/;
const simpleMethods = new Set(["GET", "HEAD", "POST"]);
const simpleHeaders = new Set(["accept", "accept-language", "content-language", "content-type"]);

const forbiddenResponseHeaders = new Set([
  "set-cookie",
  "set-cookie2"
]);
const corsSafeResponseHeaders = new Set([
  "cache-control",
  "content-language",
  "content-length",
  "content-type",
  "expires",
  "last-modified",
  "pragma"
]);

exports.READY_STATES = Object.freeze({
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
});

/**
 * A network error response.
 */
function makeNetworkError(error = null) {
  return { type: "error", error };
}

/**
 * Check if a response is a network error.
 */
function isNetworkError(response) {
  return response && response.type === "error";
}

/**
 * Performs a fetch operation for XHR with full CORS handling.
 * Delegates redirect handling and CORS validation to the dispatcher.
 *
 * @param {Object} config - Request configuration
 * @param {AbortSignal} signal - Signal to abort the fetch
 * @returns {Promise<Object>} The response object with filteredResponseHeaders, or a network error response
 */
async function performFetch(config, signal) {
  const {
    url,
    method,
    requestHeaders: userRequestHeaders,
    body,
    origin,
    referrer,
    withCredentials,
    auth,
    uploadListener,
    dispatcher,
    globalObject
  } = config;

  const urlObj = new URL(url);
  const ucMethod = method.toUpperCase();

  let aborted = signal?.aborted || false;
  signal?.addEventListener("abort", () => {
    aborted = true;
  });

  // Build request headers - start with user-set headers
  // Default headers (User-Agent, Accept, etc.) are added by the dispatcher
  const requestHeaders = userRequestHeaders.clone();

  if (referrer) {
    requestHeaders.set("Referer", referrer);
  }

  const crossOrigin = origin !== urlObj.origin;
  if (crossOrigin) {
    requestHeaders.set("Origin", origin);
  }

  // Compute if preflight is needed (but don't execute - dispatcher will)
  const nonSimpleHeaders = userRequestHeaders.headerNamesNotIn(simpleHeaders);
  const needsPreflight = crossOrigin &&
    (!simpleMethods.has(ucMethod) || nonSimpleHeaders.length > 0 || uploadListener);

  // Build opaque options for dispatcher
  const opaque = {
    element: null,
    url,
    origin,
    corsMode: crossOrigin, // Enable CORS handling if cross-origin
    withCredentials,
    auth
  };
  if (needsPreflight) {
    opaque.preflight = { unsafeHeaders: nonSimpleHeaders };
  }

  try {
    // Single dispatch call - dispatcher handles preflight, redirects, CORS
    const response = await dispatchMainRequest(dispatcher, {
      method,
      headers: requestHeaders,
      body,
      signal,
      opaque
    }, signal, globalObject);

    if (isNetworkError(response)) {
      return response;
    }

    // Build filtered response headers (post-processing)
    const filteredResponseHeaders = new Set();
    const { headers } = response;

    // Determine effective origin for filtering (from response URL after redirects)
    const destUrlObj = new URL(response.url);
    const isCrossOriginResponse = origin !== destUrlObj.origin && destUrlObj.protocol !== "data:";

    if (isCrossOriginResponse) {
      // Filter headers not exposed by CORS
      const acehStr = headers.get("access-control-expose-headers");
      const aceh = new Set(acehStr ? acehStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
      for (const [header] of headers) {
        const lcHeader = header.toLowerCase();
        if (!corsSafeResponseHeaders.has(lcHeader) && !aceh.has(lcHeader) && !aceh.has("*")) {
          filteredResponseHeaders.add(lcHeader);
        }
      }
    }

    // Always filter forbidden response headers
    for (const [header] of headers) {
      const lcHeader = header.toLowerCase();
      if (forbiddenResponseHeaders.has(lcHeader)) {
        filteredResponseHeaders.add(lcHeader);
      }
    }

    response.filteredResponseHeaders = filteredResponseHeaders;
    return response;
  } catch (err) {
    if (aborted) {
      return makeNetworkError();
    }
    return makeNetworkError(err);
  }
}

/**
 * Helper to dispatch a request and return a Promise with the response.
 */
function dispatchMainRequest(dispatcher, opts, signal, globalObject) {
  return new Promise((resolve, reject) => {
    let responseHeaders, finalURL;
    let bodyStream = null;
    let dispatchAbort = null;
    let resolved = false;

    const aborted = signal?.aborted || false;

    function onAbort() {
      if (resolved) {
        return;
      }
      resolved = true;
      if (dispatchAbort) {
        try {
          dispatchAbort();
        } catch {
          // Ignore abort errors
        }
      }
      // Suppress errors on body stream when aborting
      bodyStream?.on("error", () => {});
      resolve(makeNetworkError());
    }
    signal?.addEventListener("abort", onAbort, { once: true });

    if (aborted) {
      resolve(makeNetworkError());
      return;
    }

    dispatcher.dispatch(opts, {
      onRequestStart(controller, context) {
        dispatchAbort = reason => controller.abort(reason);
        if (signal?.aborted) {
          controller.abort(DOMException.create(globalObject, ["The operation was aborted.", "AbortError"]));
        }
        // Capture final URL from history
        if (context?.history?.length > 0) {
          finalURL = context.history[context.history.length - 1];
        }
      },
      onResponseStart(controller, statusCode, hdrs, statusText) {
        if (signal?.aborted || resolved) {
          return;
        }

        resolved = true;
        responseHeaders = HeaderList.fromJSON(hdrs);
        bodyStream = new Readable({ read() {} });

        // Prevent unhandled 'error' events from destroy() calls.
        bodyStream.on("error", () => {});

        resolve({
          status: statusCode,
          statusText: statusText || "",
          headers: responseHeaders,
          body: bodyStream,
          url: finalURL || opts.opaque.url
        });
      },
      onResponseData(controller, chunk) {
        if (signal?.aborted) {
          return;
        }
        bodyStream.push(chunk);
      },
      onResponseEnd() {
        signal?.removeEventListener("abort", onAbort);
        bodyStream?.push(null);
      },
      onResponseError(controller, err) {
        signal?.removeEventListener("abort", onAbort);
        if (resolved) {
          bodyStream?.destroy(err);
          return;
        }
        resolved = true;
        bodyStream?.destroy(err);
        reject(err);
      }
    });
  });
}

exports.performFetch = performFetch;
exports.isNetworkError = isNetworkError;
