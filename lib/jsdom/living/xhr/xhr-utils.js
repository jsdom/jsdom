"use strict";
const { Readable, pipeline } = require("stream");
const zlib = require("zlib");
const { URL } = require("whatwg-url");
const { getGlobalDispatcher } = require("undici");
const DOMException = require("../generated/DOMException");
const ResourceLoader = require("../../browser/resources/resource-loader");
const HeaderList = require("../fetch/header-list");

const { utf8Encode } = require("../helpers/encoding");
const { toBase64 } = require("@exodus/bytes/base64.js");

// Default ResourceLoader instance for when none is configured
let defaultResourceLoader = null;
function getDefaultResourceLoader() {
  if (!defaultResourceLoader) {
    defaultResourceLoader = new ResourceLoader();
  }
  return defaultResourceLoader;
}

const headerListSeparatorRegexp = /,[ \t]*/;
const simpleMethods = new Set(["GET", "HEAD", "POST"]);
const simpleHeaders = new Set(["accept", "accept-language", "content-language", "content-type"]);
const preflightHeaders = new Set([
  "access-control-expose-headers",
  "access-control-allow-headers",
  "access-control-allow-credentials",
  "access-control-allow-origin"
]);

exports.READY_STATES = Object.freeze({
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
});

/**
 * Performs a fetch operation for XHR with the given configuration and hooks.
 *
 * @param {Object} config - Request configuration
 * @param {Object} hooks - Callback hooks
 * @returns {{ abort: function }} - Controller with abort method
 */
function performFetch(config, hooks) {
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
    resourceLoader: configResourceLoader,
    requestManager,
    globalObject
  } = config;

  const resourceLoader = configResourceLoader || getDefaultResourceLoader();
  const urlObj = new URL(url);
  const ucMethod = initialMethod.toUpperCase();

  // Mutable method that can change on redirects
  let currentMethod = initialMethod;

  const abortController = new AbortController();
  let aborted = false;

  // For data: and file: URLs, use ResourceLoader.fetch() directly
  if (urlObj.protocol === "data:" || urlObj.protocol === "file:") {
    (async () => {
      try {
        const response = await resourceLoader.fetch(url);

        if (aborted) {
          return;
        }

        const responseHeaders = HeaderList.fromJSON(response.headers);

        hooks.processUploadComplete?.();
        hooks.processResponse({
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          url: response.url || url
        });

        // Stream the response body
        if (response.body) {
          const reader = response.body.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done || aborted) {
              break;
            }
            // For data:/file: URLs, raw and decompressed are the same
            hooks.processRawBodyChunk?.(value);
            hooks.processBodyChunk?.(value);
          }
        }

        if (!aborted) {
          hooks.processEndOfBody?.();
        }
      } catch (err) {
        if (!aborted) {
          hooks.processBodyError?.(err);
        }
      }
    })();

    const controller = {
      abort() {
        aborted = true;
        abortController.abort();
      }
    };
    return controller;
  }

  // HTTP/HTTPS requests

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

  // Helper to perform the actual request using undici's dispatch API directly
  function doFetch(fetchUrl, fetchMethod, headers, bodyData) {
    return new Promise((resolve, reject) => {
      const requestURL = new URL(fetchUrl);
      const dispatcher = resourceLoader._dispatcher || getGlobalDispatcher();

      let responseHeaders;
      let bodyStream = null;

      if (abortController.signal.aborted) {
        reject(DOMException.create(globalObject, ["The operation was aborted.", "AbortError"]));
        return;
      }

      let dispatchAbort = null;

      function onAbort() {
        const error = DOMException.create(globalObject, ["The operation was aborted.", "AbortError"]);
        if (dispatchAbort) {
          dispatchAbort(error);
        }
        reject(error);
      }
      abortController.signal.addEventListener("abort", onAbort, { once: true });

      dispatcher.dispatch({
        origin: requestURL.origin,
        path: requestURL.pathname + requestURL.search,
        method: fetchMethod,
        headers,
        body: bodyData
      }, {
        onConnect(abort) {
          dispatchAbort = abort;
          if (abortController.signal.aborted) {
            abort(DOMException.create(globalObject, ["The operation was aborted.", "AbortError"]));
          }
        },
        onHeaders(statusCode, rawHeaders, resume, statusText) {
          if (abortController.signal.aborted) {
            return false;
          }

          responseHeaders = HeaderList.fromUndiciRawHeaders(rawHeaders);
          bodyStream = new Readable({ read: resume });

          resolve({
            status: statusCode,
            statusText: statusText || "",
            headers: responseHeaders,
            body: bodyStream,
            cleanup() {
              if (bodyStream) {
                bodyStream.on("error", () => {});
              }
              bodyStream = null;
            }
          });

          return true;
        },
        onData(chunk) {
          if (abortController.signal.aborted) {
            return false;
          }
          bodyStream.push(chunk);
          return true;
        },
        onComplete() {
          abortController.signal.removeEventListener("abort", onAbort);
          bodyStream.push(null);
        },
        onError(err) {
          abortController.signal.removeEventListener("abort", onAbort);
          bodyStream?.destroy(err);
          reject(err);
        }
      });
    });
  }

  // Helper to add cookies to headers
  async function addCookies(headers, cookieUrl) {
    if (cookieJar && (!crossOrigin || withCredentials)) {
      try {
        const cookieString = await cookieJar.getCookieString(cookieUrl);
        if (cookieString) {
          headers.set("Cookie", cookieString);
        }
      } catch {
        // Ignore cookie errors
      }
    }
  }

  // Helper to store cookies from response
  async function storeCookies(response, cookieUrl) {
    if (cookieJar && (!crossOrigin || withCredentials)) {
      try {
        const setCookieHeaders = response.headers.getAll("set-cookie") || [];
        await Promise.all(setCookieHeaders.map(
          cookie => cookieJar.setCookie(cookie, cookieUrl, { ignoreError: true }).catch(() => {})
        ));
      } catch {
        // Ignore cookie errors
      }
    }
  }

  // Main request logic
  (async () => {
    let finalResponse;
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

        const preflightResponse = await doFetch(url, "OPTIONS", preflightRequestHeaders, null);
        preflightResponse.body?.destroy();
        preflightResponse.cleanup?.();

        if (preflightResponse.status < 200 || preflightResponse.status > 299) {
          throw new Error("Response for preflight has invalid HTTP status code " + preflightResponse.status);
        }

        // Call processPreflightResponse hook for CORS validation
        const preflightValid = hooks.processPreflightResponse?.({
          status: preflightResponse.status,
          statusText: preflightResponse.statusText,
          headers: preflightResponse.headers
        });
        if (preflightValid === false) {
          return;
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

        await addCookies(currentHeaders, currentURL);

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

        const response = await doFetch(currentURL, requestMethod, currentHeaders, requestBody);

        await storeCookies(response, currentURL);

        // Handle 401 authentication challenge
        if (response.status === 401 &&
            /^Basic /i.test(response.headers.get("www-authenticate") || "") &&
            auth && auth.user && !authSent) {
          authSent = true;
          redirectCount++;
          response.body?.destroy();
          response.cleanup?.();
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

            if (redirectResult === false) {
              response.body?.destroy();
              response.cleanup?.();
              return;
            }

            // Handle method change for 301/302/303
            if ((response.status === 301 || response.status === 302) && currentMethod === "POST") {
              currentMethod = "GET";
            } else if (response.status === 303 && !["GET", "HEAD"].includes(currentMethod)) {
              currentMethod = "GET";
            }

            response.body?.destroy();
            response.cleanup?.();
            continue;
          }
        }

        finalResponse = response;
        break;
      }

      if (!finalResponse) {
        throw new Error("Maximum number of redirects exceeded");
      }

      if (aborted) {
        return;
      }

      // Notify upload complete
      hooks.processUploadComplete?.();

      // Call processResponse hook - returns false if processing should stop (e.g., CORS error)
      const responseOk = hooks.processResponse?.({
        status: finalResponse.status,
        statusText: finalResponse.statusText,
        headers: finalResponse.headers,
        url: currentURL
      });

      if (responseOk === false) {
        finalResponse.body?.destroy();
        finalResponse.cleanup?.();
        return;
      }

      // Stream the response body, decompressing if needed
      if (finalResponse.body) {
        const contentEncoding = finalResponse.headers.get("content-encoding");
        const codings = contentEncoding ? contentEncoding.toLowerCase().split(",").map(c => c.trim()) : [];

        const decoders = [];
        for (let i = codings.length - 1; i >= 0; i--) {
          const coding = codings[i];
          if (coding === "gzip" || coding === "x-gzip") {
            decoders.push(zlib.createGunzip({
              flush: zlib.constants.Z_SYNC_FLUSH,
              finishFlush: zlib.constants.Z_SYNC_FLUSH
            }));
          } else if (coding === "deflate") {
            decoders.push(zlib.createInflate({
              flush: zlib.constants.Z_SYNC_FLUSH,
              finishFlush: zlib.constants.Z_SYNC_FLUSH
            }));
          } else if (coding === "br") {
            decoders.push(zlib.createBrotliDecompress({
              flush: zlib.constants.BROTLI_OPERATION_FLUSH,
              finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
            }));
          } else {
            decoders.length = 0;
            break;
          }
        }

        // Raw bytes for progress tracking
        finalResponse.body.on("data", chunk => {
          if (!aborted) {
            hooks.processRawBodyChunk?.(chunk);
          }
        });

        await new Promise((resolve, reject) => {
          function onError(err) {
            reject(err);
          }

          const outputStream = decoders.length > 0 ?
            pipeline(finalResponse.body, ...decoders, err => {
              if (err) {
                onError(err);
              }
            }).on("error", onError) :
            finalResponse.body.on("error", onError);

          outputStream.on("data", chunk => {
            if (!aborted) {
              hooks.processBodyChunk?.(chunk);
            }
          });
          outputStream.on("end", resolve);
        });
      }

      finalResponse?.cleanup?.();

      if (!aborted) {
        hooks.processEndOfBody?.();
      }
    } catch (err) {
      finalResponse?.cleanup?.();

      if (!aborted) {
        hooks.processBodyError?.(err);
      }
    }
  })();

  const controller = {
    abort() {
      aborted = true;
      abortController.abort();
    }
  };

  if (requestManager) {
    const req = {
      abort() {
        config.onAbortError?.();
        controller.abort();
      }
    };
    requestManager.add(req);
    // Note: We need to clean up on completion. The hooks will handle this.
  }

  return controller;
}

exports.headerListSeparatorRegexp = headerListSeparatorRegexp;
exports.simpleHeaders = simpleHeaders;
exports.preflightHeaders = preflightHeaders;
exports.performFetch = performFetch;
