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
 *
 * @param {Object} config - Request configuration
 * @param {AbortSignal} signal - Signal to abort the fetch
 * @returns {Promise<Object>} The response object with filteredResponseHeaders, or a network error response
 */
async function performFetch(config, signal) {
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
    uploadListener,
    dispatcher,
    globalObject
  } = config;

  // Track effective origin for CORS (may change during cross-origin redirects)
  let effectiveOrigin = origin;

  const urlObj = new URL(url);
  const ucMethod = initialMethod.toUpperCase();

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

      dispatcher.dispatch({
        origin: requestURL.origin,
        path: requestURL.pathname + requestURL.search,
        method: fetchMethod,
        headers,
        body: bodyData,
        signal,
        opaque: {
          element: null,
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
          responseHeaders = HeaderList.fromJSON(hdrs);
          bodyStream = new Readable({ read() {} });

          // Prevent unhandled 'error' events from destroy() calls.
          // Errors will still surface via for-await-of iteration.
          bodyStream.on("error", () => {});

          resolve({
            status: statusCode,
            statusText: statusText || "",
            headers: responseHeaders,
            body: bodyStream,
            url: fetchUrl
          });
        },
        onResponseData(controller, chunk) {
          if (aborted) {
            return;
          }
          bodyStream.push(chunk);
        },
        onResponseEnd() {
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
          new Error("Response for preflight has invalid HTTP status code " + preflightResponse.status)
        );
      }

      // CORS preflight validation
      const acaoStr = preflightResponse.headers.get("access-control-allow-origin");
      const acao = acaoStr ? acaoStr.trim() : null;
      if (acao !== "*" && acao !== effectiveOrigin) {
        return makeNetworkError(new Error("Cross origin " + effectiveOrigin + " forbidden"));
      }
      if (withCredentials) {
        const acacStr = preflightResponse.headers.get("access-control-allow-credentials");
        const acac = acacStr ? acacStr.trim() : null;
        if (acac !== "true") {
          return makeNetworkError(new Error("Credentials forbidden"));
        }
      }
      // Check allowed headers
      const acahStr = preflightResponse.headers.get("access-control-allow-headers");
      const acah = new Set(acahStr ? acahStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
      const forbiddenHeaders = acah.has("*") ?
        [] :
        userRequestHeaders.headerNamesNotIn(new Set([...simpleHeaders, ...acah]));
      if (forbiddenHeaders.length > 0) {
        return makeNetworkError(new Error("Headers " + forbiddenHeaders + " forbidden"));
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
          const sourceURL = currentURL;
          const sourceUrlObj = new URL(sourceURL);
          const targetUrlObj = new URL(location, sourceURL);
          currentURL = targetUrlObj.href;
          redirectCount++;

          // Handle method change for 301/302/303
          const { status } = response;
          const methodWillChange = ((status === 301 || status === 302) && currentMethod === "POST") ||
                                   (status === 303 && !["GET", "HEAD"].includes(currentMethod));
          if (methodWillChange) {
            currentMethod = "GET";
            requestHeaders.delete("Content-Type");
            requestHeaders.delete("Content-Length");
            requestHeaders.delete("Content-Encoding");
            requestHeaders.delete("Content-Language");
            requestHeaders.delete("Content-Location");
          }

          const isCrossOriginRedirect = sourceUrlObj.origin !== targetUrlObj.origin;

          // Update effective origin for CORS tracking
          if (isCrossOriginRedirect && sourceUrlObj.origin !== origin) {
            effectiveOrigin = "null";
          }
          requestHeaders.set("Origin", effectiveOrigin);

          // Remove Authorization header on cross-origin redirect
          if (isCrossOriginRedirect) {
            requestHeaders.delete("Authorization");
          }

          // If the redirect source was cross-origin, validate CORS headers
          if (origin !== sourceUrlObj.origin &&
              sourceUrlObj.protocol !== "data:") {
            const acaoStr = response.headers.get("access-control-allow-origin");
            const acao = acaoStr ? acaoStr.trim() : null;
            if (acao !== "*" && acao !== origin) {
              response.body?.destroy();
              return makeNetworkError(new Error("Cross origin " + origin + " forbidden"));
            }
            if (withCredentials) {
              const acacStr = response.headers.get("access-control-allow-credentials");
              const acac = acacStr ? acacStr.trim() : null;
              if (acac !== "true") {
                response.body?.destroy();
                return makeNetworkError(new Error("Credentials forbidden"));
              }
            }
            if (targetUrlObj.username || targetUrlObj.password) {
              response.body?.destroy();
              return makeNetworkError(new Error("Userinfo forbidden in cors redirect"));
            }
          }

          response.body?.destroy();
          continue;
        }
      }

      // Final response - set URL to the final location after redirects
      response.url = currentURL;

      // Build filtered response headers
      const filteredResponseHeaders = new Set();
      const { headers } = response;

      const destUrlObj = new URL(currentURL);
      if (effectiveOrigin !== destUrlObj.origin &&
          destUrlObj.protocol !== "data:") {
        // CORS validation for final response
        const acaoStr = headers.get("access-control-allow-origin");
        const acao = acaoStr ? acaoStr.trim() : null;
        if (acao !== "*" && acao !== effectiveOrigin) {
          response.body?.destroy();
          return makeNetworkError(new Error("Cross origin " + effectiveOrigin + " forbidden"));
        }
        if (withCredentials) {
          const acacStr = headers.get("access-control-allow-credentials");
          const acac = acacStr ? acacStr.trim() : null;
          if (acac !== "true") {
            response.body?.destroy();
            return makeNetworkError(new Error("Credentials forbidden"));
          }
        }
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
    }

    return makeNetworkError(new Error("Maximum number of redirects exceeded"));
  } catch (err) {
    if (aborted) {
      return makeNetworkError();
    }
    return makeNetworkError(err);
  }
}

exports.performFetch = performFetch;
exports.isNetworkError = isNetworkError;
