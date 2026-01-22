"use strict";
const { Readable } = require("stream");
const { URL } = require("whatwg-url");
const DOMException = require("../generated/DOMException");
const HeaderList = require("../fetch/header-list");

const { utf8Encode } = require("../helpers/encoding");
const { toBase64 } = require("@exodus/bytes/base64.js");

const headerListSeparatorRegexp = /,[ \t]*/;
const simpleMethods = new Set(["GET", "HEAD", "POST"]);
const simpleHeaders = new Set(["accept", "accept-language", "content-language", "content-type"]);

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
 * Performs a fetch operation for XHR.
 *
 * @param {Object} config - Request configuration
 * @param {AbortSignal} signal - Signal to abort the fetch
 * @param {Object} hooks - Optional callback hooks for redirect/preflight validation
 * @returns {Promise<Object>} The response object, or a network error response
 */
async function performFetch(config, signal, hooks = {}) {
  const {
    url,
    method: initialMethod,
    requestHeaders: userRequestHeaders,
    body,
    origin,
    referrer,
    userAgent,
    withCredentials,
    auth,
    cookieJar,
    uploadListener,
    dispatcher,
    globalObject
  } = config;

  const urlObj = new URL(url);
  const ucMethod = initialMethod.toUpperCase();

  let aborted = signal?.aborted || false;
  signal?.addEventListener("abort", () => {
    aborted = true;
  });

  // Build request headers - start with user-set headers, then add defaults
  const requestHeaders = userRequestHeaders.clone();

  if (!userRequestHeaders.contains("referer")) {
    requestHeaders.set("Referer", referrer);
  }
  if (!userRequestHeaders.contains("user-agent")) {
    requestHeaders.set("User-Agent", userAgent);
  }
  if (!userRequestHeaders.contains("accept-language")) {
    requestHeaders.set("Accept-Language", "en");
  }
  if (!userRequestHeaders.contains("accept")) {
    requestHeaders.set("Accept", "*/*");
  }
  requestHeaders.set("Accept-Encoding", "gzip, deflate");

  const crossOrigin = origin !== urlObj.origin;
  if (crossOrigin) {
    requestHeaders.set("Origin", origin);
  }

  const hasBody = body !== undefined &&
                  body !== null &&
                  body !== "" &&
                  !(ucMethod === "HEAD" || ucMethod === "GET");

  if (hasBody && !userRequestHeaders.contains("content-type")) {
    requestHeaders.set("Content-Type", "text/plain;charset=UTF-8");
  }

  if (hasBody) {
    requestHeaders.set("Content-Length", String(body.byteLength));
  }

  const nonSimpleHeaders = userRequestHeaders.headerNamesNotIn(simpleHeaders);

  const needsPreflight = crossOrigin &&
    (!simpleMethods.has(ucMethod) || nonSimpleHeaders.length > 0 || uploadListener);

  // Helper to perform a single HTTP request using undici's dispatch API
  function dispatchRequest(fetchUrl, fetchMethod, headers, bodyData) {
    return new Promise((resolve, reject) => {
      const requestURL = new URL(fetchUrl);

      let responseHeaders;
      let bodyStream = null;

      if (aborted) {
        resolve(makeNetworkError());
        return;
      }

      let dispatchAbort = null;
      let resolved = false;

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

      // Convert HeaderList to flat array format for undici
      const headersArray = [];
      for (const [name, value] of headers) {
        headersArray.push(name, value);
      }

      dispatcher.dispatch({
        origin: requestURL.origin,
        path: requestURL.pathname + requestURL.search,
        method: fetchMethod,
        headers: headersArray,
        body: bodyData,
        opaque: {
          cookieJar,
          element: null,
          document: null,
          url: fetchUrl,
          noRedirectFollow: true,
          origin,
          withCredentials
        }
      }, {
        onRequestStart(controller) {
          dispatchAbort = reason => controller.abort(reason);
          if (aborted) {
            controller.abort(DOMException.create(globalObject, ["The operation was aborted.", "AbortError"]));
          }
        },
        onResponseStart(controller, statusCode, hdrs, statusText) {
          if (aborted || resolved) {
            return;
          }

          resolved = true;
          // Convert headers object to HeaderList
          responseHeaders = new HeaderList();
          for (const [key, value] of Object.entries(hdrs)) {
            if (Array.isArray(value)) {
              for (const v of value) {
                responseHeaders.append(key, v);
              }
            } else {
              responseHeaders.append(key, value);
            }
          }
          bodyStream = new Readable({ read() {} });

          // Prevent unhandled 'error' events from destroy() calls.
          // Errors will still surface via for-await-of iteration.
          bodyStream.on("error", () => {});

          // Check for final URL from jsdom interceptor (in case redirects were followed)
          let finalURL = fetchUrl;
          const xFinalUrl = responseHeaders.get("x-final-url");
          if (xFinalUrl) {
            finalURL = xFinalUrl;
            responseHeaders.delete("x-final-url");
          }

          resolve({
            status: statusCode,
            statusText: statusText || "",
            headers: responseHeaders,
            body: bodyStream,
            url: finalURL
          });
        },
        onResponseData(controller, chunk) {
          if (aborted) {
            return;
          }
          bodyStream.push(chunk);
        },
        onResponseEnd(controller, trailers) {
          signal?.removeEventListener("abort", onAbort);
          bodyStream.push(null);
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

  // Mutable method that can change on redirects
  let currentMethod = initialMethod;

  try {
    // Handle CORS preflight if needed
    if (needsPreflight) {
      const preflightRequestHeaders = new HeaderList();
      preflightRequestHeaders.set("Origin", requestHeaders.get("Origin"));
      preflightRequestHeaders.set("Access-Control-Request-Method", currentMethod);
      preflightRequestHeaders.set("User-Agent", userAgent);

      if (nonSimpleHeaders.length > 0) {
        preflightRequestHeaders.set("Access-Control-Request-Headers", nonSimpleHeaders.join(", "));
      }

      const preflightResponse = await dispatchRequest(url, "OPTIONS", preflightRequestHeaders, null);

      if (isNetworkError(preflightResponse)) {
        return preflightResponse;
      }

      preflightResponse.body?.destroy();

      if (preflightResponse.status < 200 || preflightResponse.status > 299) {
        return makeNetworkError(
          false,
          new Error("Response for preflight has invalid HTTP status code " + preflightResponse.status)
        );
      }

      // Call processPreflightResponse hook for CORS validation
      // Hook returns true on success, or an error message string on failure
      const preflightResult = hooks.processPreflightResponse?.({
        status: preflightResponse.status,
        statusText: preflightResponse.statusText,
        headers: preflightResponse.headers
      });
      if (preflightResult !== true && preflightResult !== undefined) {
        const errorMsg = typeof preflightResult === "string" ? preflightResult : "CORS preflight failed";
        return makeNetworkError(new Error(errorMsg));
      }
    }

    // Perform the actual request with redirect handling
    let currentURL = url;
    const MAX_REDIRECTS = 21;
    let redirectCount = 0;
    let authSent = false;

    while (redirectCount < MAX_REDIRECTS) {
      const currentHeaders = requestHeaders.clone();

      const currentURLObj = new URL(currentURL);
      const isCurrentCrossOrigin = origin !== currentURLObj.origin;
      if (isCurrentCrossOrigin && !currentHeaders.contains("Origin")) {
        currentHeaders.set("Origin", origin);
      }

      if (authSent && auth) {
        const authString = `${auth.user || ""}:${auth.pass || ""}`;
        currentHeaders.set("Authorization", "Basic " + toBase64(utf8Encode(authString)));
      }

      let requestMethod = currentMethod;
      let requestBody = null;
      if (redirectCount === 0) {
        requestBody = hasBody ? body : null;
      } else if (currentMethod === "POST") {
        requestMethod = "GET";
      }

      const response = await dispatchRequest(currentURL, requestMethod, currentHeaders, requestBody);

      if (isNetworkError(response)) {
        return response;
      }

      // Handle 401 authentication challenge
      if (response.status === 401 &&
          /^Basic /i.test(response.headers.get("www-authenticate") || "") &&
          auth && auth.user && !authSent) {
        authSent = true;
        redirectCount++;
        response.body?.destroy();
        continue;
      }

      // Check for redirect
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (location) {
          const prevURL = currentURL;
          const nextURLObj = new URL(location, currentURL);
          currentURL = nextURLObj.href;
          redirectCount++;

          // Call processRedirect hook - it can modify requestHeaders and abort
          // Hook returns true on success, or an error message string on failure
          const redirectResult = hooks.processRedirect?.({
            response: {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            },
            requestHeaders,
            sourceURL: prevURL,
            targetURL: currentURL
          });

          if (redirectResult !== true && redirectResult !== undefined) {
            response.body?.destroy();
            const errorMsg = typeof redirectResult === "string" ? redirectResult : "Redirect blocked";
            return makeNetworkError(new Error(errorMsg));
          }

          // Handle method change for 301/302/303
          if ((response.status === 301 || response.status === 302) && currentMethod === "POST") {
            currentMethod = "GET";
          } else if (response.status === 303 && !["GET", "HEAD"].includes(currentMethod)) {
            currentMethod = "GET";
          }

          response.body?.destroy();
          continue;
        }
      }

      // Final response - use URL from response if set (by x-final-url), otherwise use currentURL
      if (!response.url) {
        response.url = currentURL;
      }
      return response;
    }

    return makeNetworkError(new Error("Maximum number of redirects exceeded"));
  } catch (err) {
    if (aborted) {
      return makeNetworkError();
    }
    return makeNetworkError(err);
  }
}

exports.headerListSeparatorRegexp = headerListSeparatorRegexp;
exports.simpleHeaders = simpleHeaders;
exports.performFetch = performFetch;
exports.isNetworkError = isNetworkError;
