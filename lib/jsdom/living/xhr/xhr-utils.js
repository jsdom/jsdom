"use strict";
const { Readable } = require("stream");
const { parseURL, serializeURL, serializeURLOrigin } = require("whatwg-url");
const HeaderList = require("../fetch/header-list");
const { isForbiddenResponseHeaderName, isNoCORSSafelistedRequestHeaderName } = require("../fetch/header-types");

const headerListSeparatorRegexp = /,[ \t]*/;
const simpleMethods = new Set(["GET", "HEAD", "POST"]);

const corsSafeResponseHeaders = new Set([
  "cache-control",
  "content-language",
  "content-length",
  "content-type",
  "expires",
  "last-modified",
  "pragma"
]);

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
 * @param {JSDOMDispatcher} dispatcher - The dispatcher to use for sending the request
 * @param {Object} config - Request configuration
 * @param {AbortSignal} signal - Signal to abort the fetch
 * @returns {Promise<Object>} The response object with filteredResponseHeaders, or a network error response
 */
async function performFetch(dispatcher, config, signal) {
  const {
    url,
    method,
    requestHeaders: userRequestHeaders,
    body,
    origin,
    referrer,
    withCredentials,
    auth,
    uploadListener
  } = config;

  const urlRecord = parseURL(url);
  const ucMethod = method.toUpperCase();

  // Build request headers - start with user-set headers
  // Default headers (User-Agent, Accept, etc.) are added by the dispatcher
  const requestHeaders = userRequestHeaders.clone();

  if (referrer) {
    requestHeaders.set("Referer", referrer);
  }

  const crossOrigin = origin !== serializeURLOrigin(urlRecord);
  if (crossOrigin) {
    requestHeaders.set("Origin", origin);
  }

  // Compute if preflight is needed (but don't execute - dispatcher will)
  const nonSimpleHeaders = [];
  for (const name of userRequestHeaders.names()) {
    if (!isNoCORSSafelistedRequestHeaderName(name)) {
      nonSimpleHeaders.push(name);
    }
  }
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
      opaque
    }, signal);

    if (isNetworkError(response)) {
      return response;
    }

    // Build filtered response headers (post-processing)
    const filteredResponseHeaders = new Set();
    const { headers } = response;

    // Determine effective origin for filtering (from response URL after redirects)
    const destUrlRecord = parseURL(response.url);
    const isCrossOriginResponse = origin !== serializeURLOrigin(destUrlRecord) && destUrlRecord.scheme !== "data";

    if (isCrossOriginResponse) {
      // Filter headers not exposed by CORS
      const acehStr = headers.get("access-control-expose-headers");
      const aceh = new Set(acehStr ? acehStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
      for (const [header] of headers) {
        if (!corsSafeResponseHeaders.has(header) && !aceh.has(header) && !aceh.has("*")) {
          filteredResponseHeaders.add(header);
        }
      }
    }

    // Always filter forbidden response headers
    for (const [header] of headers) {
      if (isForbiddenResponseHeaderName(header)) {
        filteredResponseHeaders.add(header);
      }
    }

    response.filteredResponseHeaders = filteredResponseHeaders;
    return response;
  } catch (err) {
    if (signal.aborted) {
      return makeNetworkError();
    }
    return makeNetworkError(err);
  }
}

/**
 * Helper to dispatch a request and return a Promise with the response.
 */
function dispatchMainRequest(dispatcher, opts, signal) {
  if (signal.aborted) {
    return Promise.resolve(makeNetworkError());
  }

  return new Promise((resolve, reject) => {
    let context, bodyStream, sendAbortToUndiciController;
    let promiseSettled = false;

    function onAbort() {
      if (promiseSettled) {
        return;
      }
      promiseSettled = true;
      sendAbortToUndiciController?.();
      resolve(makeNetworkError());
    }
    signal.addEventListener("abort", onAbort, { once: true });

    dispatcher.dispatch(opts, {
      onRequestStart(controller, ctx) {
        context = ctx;
        sendAbortToUndiciController = reason => controller.abort(reason);
        if (signal.aborted) {
          controller.abort(signal.reason);
        }
      },
      onResponseStart(controller, statusCode, headers, statusText) {
        if (signal.aborted || promiseSettled) {
          return;
        }

        // Prevent unhandled "error" events from `destroy()` calls.
        bodyStream = new Readable({ read() {} });
        bodyStream.on("error", () => {});

        // Get final URL from context (set by dispatcher after handling redirects)
        const finalURL = serializeURL(context.finalURL);

        promiseSettled = true;
        resolve({
          status: statusCode,
          statusText: statusText || "",
          headers: HeaderList.fromJSON(headers),
          body: bodyStream,
          url: finalURL
        });
      },
      onResponseData(controller, chunk) {
        if (signal.aborted) {
          return;
        }
        bodyStream.push(chunk);
      },
      onResponseEnd() {
        signal.removeEventListener("abort", onAbort);
        bodyStream?.push(null);
      },
      onResponseError(controller, err) {
        signal.removeEventListener("abort", onAbort);
        bodyStream?.destroy(err);
        promiseSettled = true;
        reject(err);
      }
    });
  });
}

exports.performFetch = performFetch;
exports.isNetworkError = isNetworkError;
