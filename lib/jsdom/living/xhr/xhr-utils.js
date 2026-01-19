"use strict";
const { EventEmitter } = require("events");
const { Readable, pipeline } = require("stream");
const zlib = require("zlib");
const { URL } = require("whatwg-url");
const { getGlobalDispatcher } = require("undici");
const DOMException = require("../generated/DOMException");
const ResourceLoader = require("../../browser/resources/resource-loader");
const HeaderList = require("../fetch/header-list");

const ProgressEvent = require("../generated/ProgressEvent");

const { fireAnEvent } = require("../helpers/events");
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

const READY_STATES = exports.READY_STATES = Object.freeze({
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
});

function dispatchError(xhr) {
  const errMessage = xhr.properties.error;
  requestErrorSteps(xhr, "error", DOMException.create(xhr._globalObject, [errMessage, "NetworkError"]));
}

function validCORSHeaders(xhr, response, flag, properties, origin) {
  const acaoStr = response.headers.get("access-control-allow-origin");
  const acao = acaoStr ? acaoStr.trim() : null;
  if (acao !== "*" && acao !== origin) {
    properties.error = "Cross origin " + origin + " forbidden";
    dispatchError(xhr);
    return false;
  }
  const acacStr = response.headers.get("access-control-allow-credentials");
  const acac = acacStr ? acacStr.trim() : null;
  if (flag.withCredentials && acac !== "true") {
    properties.error = "Credentials forbidden";
    dispatchError(xhr);
    return false;
  }
  return true;
}

function validCORSPreflightHeaders(xhr, response, flag, properties) {
  if (!validCORSHeaders(xhr, response, flag, properties, properties.origin)) {
    return false;
  }
  const acahStr = response.headers.get("access-control-allow-headers");
  const acah = new Set(acahStr ? acahStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
  const forbiddenHeaders = acah.has("*") ?
    [] :
    flag.requestHeaders.headerNamesNotIn(new Set([...simpleHeaders, ...acah]));
  if (forbiddenHeaders.length > 0) {
    properties.error = "Headers " + forbiddenHeaders + " forbidden";
    dispatchError(xhr);
    return false;
  }
  return true;
}

function requestErrorSteps(xhr, event, exception) {
  const { flag, properties, upload } = xhr;

  xhr.readyState = READY_STATES.DONE;
  properties.send = false;

  setResponseToNetworkError(xhr);

  if (flag.synchronous) {
    throw exception;
  }

  fireAnEvent("readystatechange", xhr);

  if (!properties.uploadComplete) {
    properties.uploadComplete = true;

    if (properties.uploadListener) {
      fireAnEvent(event, upload, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
      fireAnEvent("loadend", upload, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
    }
  }

  fireAnEvent(event, xhr, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
  fireAnEvent("loadend", xhr, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
}

function setResponseToNetworkError(xhr) {
  const { properties } = xhr;

  properties.responseBytes =
    properties.responseCache =
    properties.responseTextCache =
    properties.responseXMLCache = null;

  properties.responseHeaders = new HeaderList();
  xhr.status = 0;
  xhr.statusText = "";
}

// Helper to create an EventEmitter client from a ResourceLoader.fetch() call
function createClientFromFetch(fetchPromise, url, requestManager, properties, xhr) {
  const client = new EventEmitter();
  const abortController = new AbortController();
  let aborted = false;

  client.abort = () => {
    aborted = true;
    abortController.abort();
    client.emit("abort");
  };

  (async () => {
    try {
      const response = await fetchPromise;

      if (aborted) {
        return;
      }

      const responseObj = new EventEmitter();
      responseObj.statusCode = response.status;
      responseObj.statusMessage = response.statusText;
      responseObj.headers = HeaderList.fromJSON(response.headers);

      // Use the original URL since Response.url is empty for manually created responses
      client.emit("response", responseObj, response.url || url);

      // Stream the response body
      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done || aborted) {
            break;
          }
          responseObj.emit("data", value);
          client.emit("data", value);
        }
      }

      if (!aborted) {
        responseObj.emit("end");
        client.emit("end");
      }
    } catch (err) {
      if (!aborted) {
        client.emit("error", err);
      }
    }
  })();

  if (requestManager) {
    const req = {
      abort() {
        properties.abortError = true;
        xhr.abort();
      }
    };
    requestManager.add(req);
    const rmReq = requestManager.remove.bind(requestManager, req);
    client.on("abort", rmReq);
    client.on("error", rmReq);
    client.on("end", rmReq);
  }

  return client;
}

// return a "request" client object or an event emitter matching the same behaviour for unsupported protocols
// the callback should be called with a "request" response object or an event emitter matching the same behaviour too
function createClient(xhr) {
  const { flag, properties } = xhr;
  const urlObj = new URL(flag.uri);
  const uri = urlObj.href;
  const ucMethod = flag.method.toUpperCase();

  const { requestManager } = flag;
  const resourceLoader = flag.resourceLoader || getDefaultResourceLoader();

  // For data: and file: URLs, use ResourceLoader.fetch() directly
  if (urlObj.protocol === "data:" || urlObj.protocol === "file:") {
    const fetchPromise = resourceLoader.fetch(uri);
    return createClientFromFetch(fetchPromise, uri, requestManager, properties, xhr);
  }

  // HTTP/HTTPS requests - need special handling for CORS preflight and redirects
  const client = new EventEmitter();
  const abortController = new AbortController();
  let aborted = false;

  client.abort = () => {
    aborted = true;
    abortController.abort();
    client.emit("abort");
  };

  // Build request headers - start with user-set headers, then add defaults
  const requestHeaders = flag.requestHeaders.clone();

  if (!flag.requestHeaders.contains("referer")) {
    requestHeaders.set("Referer", flag.referrer);
  }
  if (!flag.requestHeaders.contains("user-agent")) {
    requestHeaders.set("User-Agent", flag.userAgent);
  }
  if (!flag.requestHeaders.contains("accept-language")) {
    requestHeaders.set("Accept-Language", "en");
  }
  if (!flag.requestHeaders.contains("accept")) {
    requestHeaders.set("Accept", "*/*");
  }
  requestHeaders.set("Accept-Encoding", "gzip, deflate");

  const crossOrigin = flag.origin !== urlObj.origin;
  if (crossOrigin) {
    requestHeaders.set("Origin", flag.origin);
  }

  const { body } = flag;
  const hasBody = body !== undefined &&
                  body !== null &&
                  body !== "" &&
                  !(ucMethod === "HEAD" || ucMethod === "GET");

  if (hasBody && !flag.requestHeaders.contains("content-type")) {
    requestHeaders.set("Content-Type", "text/plain;charset=UTF-8");
  }

  if (hasBody) {
    requestHeaders.set("Content-Length", String(body.byteLength));
  }

  // Store headers on client for upload progress tracking
  client.headers = requestHeaders;

  const nonSimpleHeaders = flag.requestHeaders.headerNamesNotIn(simpleHeaders);

  const needsPreflight = crossOrigin &&
    (!simpleMethods.has(ucMethod) || nonSimpleHeaders.length > 0 || properties.uploadListener);

  // Helper to perform the actual request using undici's dispatch API directly
  // We use dispatch instead of fetch() because:
  // 1. fetch() normalizes header values (strips leading/trailing whitespace)
  // 2. undici's request() doesn't provide statusText
  // The dispatch API preserves header values and provides statusText.
  function doFetch(url, method, headers, bodyData) {
    return new Promise((resolve, reject) => {
      const requestURL = new URL(url);
      // Use the dispatcher from resourceLoader, or fall back to the global dispatcher
      const dispatcher = resourceLoader._dispatcher || getGlobalDispatcher();

      let responseHeaders;
      let bodyStream = null;

      // Check if already aborted before dispatching
      if (abortController.signal.aborted) {
        reject(DOMException.create(xhr._globalObject, ["The operation was aborted.", "AbortError"]));
        return;
      }

      // Will be set by onConnect to allow aborting the underlying connection
      let dispatchAbort = null;

      // Handle abort during request
      function onAbort() {
        const error = DOMException.create(xhr._globalObject, ["The operation was aborted.", "AbortError"]);
        // Abort the underlying connection if available
        if (dispatchAbort) {
          dispatchAbort(error);
        }
        reject(error);
      }
      abortController.signal.addEventListener("abort", onAbort, { once: true });

      dispatcher.dispatch({
        origin: requestURL.origin,
        path: requestURL.pathname + requestURL.search,
        method,
        headers,
        body: bodyData
      }, {
        onConnect(abort) {
          // Store the abort function for later use
          dispatchAbort = abort;

          // If already aborted, abort the connection immediately
          if (abortController.signal.aborted) {
            abort(DOMException.create(xhr._globalObject, ["The operation was aborted.", "AbortError"]));
          }
        },
        onHeaders(statusCode, rawHeaders, resume, statusText) {
          // If aborted, don't process headers
          if (abortController.signal.aborted) {
            return false;
          }

          responseHeaders = HeaderList.fromUndiciRawHeaders(rawHeaders);

          // Create a Readable stream for the body, using resume for backpressure.
          bodyStream = new Readable({ read: resume });

          // Resolve immediately when headers are received
          resolve({
            status: statusCode,
            statusText: statusText || "",
            headers: responseHeaders,
            body: bodyStream,
            // Cleanup function to detach error forwarding when consumer is done.
            // Also adds error handler to prevent unhandled errors from destroy() calls
            // that happen after the main error has already been reported.
            cleanup() {
              if (bodyStream) {
                bodyStream.on("error", () => {});
              }
              bodyStream = null;
            }
          });

          return true; // Continue receiving body
        },
        onData(chunk) {
          // If aborted, stop receiving data
          if (abortController.signal.aborted) {
            return false;
          }
          bodyStream.push(chunk);
          return true;
        },
        onComplete() {
          abortController.signal.removeEventListener("abort", onAbort);
          bodyStream.push(null); // Signal end of stream
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
  async function addCookies(headers, url) {
    if (flag.cookieJar && (!crossOrigin || flag.withCredentials)) {
      try {
        const cookieString = await flag.cookieJar.getCookieString(url);
        if (cookieString) {
          headers.set("Cookie", cookieString);
        }
      } catch {
        // Ignore cookie errors
      }
    }
  }

  // Helper to store cookies from response
  async function storeCookies(response, url) {
    if (flag.cookieJar && (!crossOrigin || flag.withCredentials)) {
      try {
        const setCookieHeaders = response.headers.getAll("set-cookie") || [];
        await Promise.all(setCookieHeaders.map(
          cookie => flag.cookieJar.setCookie(cookie, url, { ignoreError: true }).catch(() => {})
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
        flag.preflight = true;

        const preflightRequestHeaders = new HeaderList();
        preflightRequestHeaders.set("Origin", requestHeaders.get("Origin"));
        preflightRequestHeaders.set("Access-Control-Request-Method", flag.method);
        preflightRequestHeaders.set("User-Agent", flag.userAgent);

        if (nonSimpleHeaders.length > 0) {
          preflightRequestHeaders.set("Access-Control-Request-Headers", nonSimpleHeaders.join(", "));
        }

        const preflightResponse = await doFetch(uri, "OPTIONS", preflightRequestHeaders, null);
        // Cleanup preflight body to prevent unhandled errors
        preflightResponse.body?.destroy();
        preflightResponse.cleanup?.();

        if (preflightResponse.status < 200 || preflightResponse.status > 299) {
          throw new Error("Response for preflight has invalid HTTP status code " + preflightResponse.status);
        }

        if (!validCORSPreflightHeaders(xhr, preflightResponse, flag, properties)) {
          setResponseToNetworkError(xhr);
          return;
        }
      }

      // Perform the actual request with redirect handling
      let currentURL = uri;
      const MAX_REDIRECTS = 21;
      let redirectCount = 0;

      let authSent = false;

      while (redirectCount < MAX_REDIRECTS) {
        // Build headers for this request, adding cookies
        const currentHeaders = requestHeaders.clone();

        // Check if current URL is cross-origin and add Origin header if needed
        const currentURLObj = new URL(currentURL);
        const isCurrentCrossOrigin = flag.origin !== currentURLObj.origin;
        if (isCurrentCrossOrigin && !currentHeaders.contains("Origin")) {
          currentHeaders.set("Origin", flag.origin);
        }

        await addCookies(currentHeaders, currentURL);

        // Add basic auth only after receiving a 401 challenge (or if explicitly set via setRequestHeader)
        if (authSent && flag.auth) {
          const authString = `${flag.auth.user || ""}:${flag.auth.pass || ""}`;
          currentHeaders.set("Authorization", "Basic " + toBase64(utf8Encode(authString)));
        }

        // Determine method and body for this request
        let requestMethod = flag.method;
        let requestBody = null;
        if (redirectCount === 0) {
          requestBody = hasBody ? body : null;
        } else if (flag.method === "POST") {
          requestMethod = "GET";
        }

        const response = await doFetch(currentURL, requestMethod, currentHeaders, requestBody);

        // Store cookies from response
        await storeCookies(response, currentURL);

        // Handle 401 authentication challenge
        if (response.status === 401 &&
            /^Basic /i.test(response.headers.get("www-authenticate") || "") &&
            flag.auth && flag.auth.user && !authSent) {
          authSent = true;
          redirectCount++;

          // Consume the 401 response body and cleanup
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

            // Emit redirect event (used for CORS validation and Origin header update in XMLHttpRequest-impl.js)
            // Pass the original requestHeaders so Origin modifications persist across redirects
            client.emit("redirect", response, requestHeaders, prevURL, currentURL);

            // Handle method change for 301/302/303
            if ((response.status === 301 || response.status === 302) && flag.method === "POST") {
              flag.method = "GET";
            } else if (response.status === 303 && !["GET", "HEAD"].includes(flag.method)) {
              flag.method = "GET";
            }

            // Consume the redirect response body and cleanup
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

      // Create response object in the format expected by XMLHttpRequest-impl.js
      const responseObj = new EventEmitter();
      responseObj.statusCode = finalResponse.status;
      responseObj.statusMessage = finalResponse.statusText;
      responseObj.headers = finalResponse.headers;

      // Emit request event for upload tracking BEFORE response event.
      // This ensures upload progress/load/loadend events fire before xhr load event.
      // The fake request object collects handlers and we call them synchronously.
      let uploadResponseHandler = null;
      client.emit("request", {
        on(event, handler) {
          if (event === "response") {
            uploadResponseHandler = handler;
          }
        }
      });

      // Call upload handler synchronously before processing response
      if (uploadResponseHandler) {
        uploadResponseHandler(responseObj);
      }

      // Emit the response event
      client.emit("response", responseObj, currentURL);

      // Stream the response body, decompressing if needed
      if (finalResponse.body) {
        // Check Content-Encoding and create decoders
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
            // Unknown encoding, skip decompression
            decoders.length = 0;
            break;
          }
        }

        // Emit raw bytes on responseObj for progress tracking,
        // decompressed bytes on client for response content
        finalResponse.body.on("data", chunk => {
          if (!aborted) {
            responseObj.emit("data", chunk);
          }
        });

        await new Promise((resolve, reject) => {
          function onError(err) {
            reject(err);
          }

          // Following undici's pattern: attach error handler synchronously via chaining
          const outputStream = decoders.length > 0 ?
            pipeline(finalResponse.body, ...decoders, err => {
              if (err) {
                onError(err);
              }
            }).on("error", onError) :
            finalResponse.body.on("error", onError);

          outputStream.on("data", chunk => {
            if (!aborted) {
              client.emit("data", chunk);
            }
          });
          outputStream.on("end", resolve);
        });
      }

      // Cleanup after successful body consumption
      finalResponse?.cleanup?.();

      if (!aborted) {
        responseObj.emit("end");
        client.emit("end");
      }
    } catch (err) {
      // Cleanup on error to prevent unhandled stream errors
      finalResponse?.cleanup?.();

      if (!aborted) {
        if (err.name === "AbortError") {
          client.emit("abort");
        } else {
          client.emit("error", err);
        }
      }
    }
  })();

  if (requestManager) {
    const req = {
      abort() {
        properties.abortError = true;
        xhr.abort();
      }
    };
    requestManager.add(req);
    const rmReq = requestManager.remove.bind(requestManager, req);
    client.on("abort", rmReq);
    client.on("error", rmReq);
    client.on("end", rmReq);
  }

  return client;
}

exports.headerListSeparatorRegexp = headerListSeparatorRegexp;
exports.simpleHeaders = simpleHeaders;
exports.preflightHeaders = preflightHeaders;
exports.dispatchError = dispatchError;
exports.validCORSHeaders = validCORSHeaders;
exports.requestErrorSteps = requestErrorSteps;
exports.setResponseToNetworkError = setResponseToNetworkError;
exports.createClient = createClient;
