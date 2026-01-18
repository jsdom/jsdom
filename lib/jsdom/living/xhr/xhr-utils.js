"use strict";
const { EventEmitter } = require("events");
const { URL } = require("whatwg-url");
const { getGlobalDispatcher } = require("undici");
const DOMException = require("../generated/DOMException");
const ResourceLoader = require("../../browser/resources/resource-loader");

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

// Case-insensitive header helpers for the plain-object request headers.
// We use plain objects instead of Headers because XHR preserves header name casing.
function getRequestHeader(requestHeaders, header) {
  const lcHeader = header.toLowerCase();
  const keys = Object.keys(requestHeaders);
  for (const key of keys) {
    if (key.toLowerCase() === lcHeader) {
      return requestHeaders[key];
    }
  }
  return null;
}

function updateRequestHeader(requestHeaders, header, newValue) {
  const lcHeader = header.toLowerCase();
  const keys = Object.keys(requestHeaders);
  for (const key of keys) {
    if (key.toLowerCase() === lcHeader) {
      requestHeaders[key] = newValue;
      return;
    }
  }
}

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
  Object.keys(flag.requestHeaders).filter(header => {
    const lcHeader = header.toLowerCase();
    return !simpleHeaders.has(lcHeader) && !acah.has(lcHeader);
  });
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

  properties.responseHeaders = new Headers();
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
      responseObj.headers = response.headers;

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
  const requestHeaders = {};
  for (const header in flag.requestHeaders) {
    requestHeaders[header] = flag.requestHeaders[header];
  }

  if (getRequestHeader(flag.requestHeaders, "referer") === null) {
    requestHeaders.Referer = flag.referrer;
  }
  if (getRequestHeader(flag.requestHeaders, "user-agent") === null) {
    requestHeaders["User-Agent"] = flag.userAgent;
  }
  if (getRequestHeader(flag.requestHeaders, "accept-language") === null) {
    requestHeaders["Accept-Language"] = "en";
  }
  if (getRequestHeader(flag.requestHeaders, "accept") === null) {
    requestHeaders.Accept = "*/*";
  }
  requestHeaders["Accept-Encoding"] = "gzip, deflate";

  const crossOrigin = flag.origin !== urlObj.origin;
  if (crossOrigin) {
    requestHeaders.Origin = flag.origin;
  }

  const { body } = flag;
  const hasBody = body !== undefined &&
                  body !== null &&
                  body !== "" &&
                  !(ucMethod === "HEAD" || ucMethod === "GET");

  if (hasBody && getRequestHeader(flag.requestHeaders, "content-type") === null) {
    requestHeaders["Content-Type"] = "text/plain;charset=UTF-8";
  }

  if (hasBody) {
    requestHeaders["Content-Length"] = String(body.byteLength);
  }

  // Store headers on client for upload progress tracking
  client.headers = requestHeaders;

  const nonSimpleHeaders = Object.keys(flag.requestHeaders)
    .filter(header => !simpleHeaders.has(header.toLowerCase()));

  const needsPreflight = crossOrigin &&
    (!simpleMethods.has(ucMethod) || nonSimpleHeaders.length > 0 || properties.uploadListener);

  // Helper to perform the actual request using undici's dispatch API directly
  // We use dispatch instead of fetch() because:
  // 1. fetch() normalizes header values (strips leading/trailing whitespace)
  // 2. undici's request() doesn't provide statusText
  // The dispatch API preserves header values and provides statusText.
  function doFetch(url, method, headers, bodyData) {
    return new Promise((resolve, reject) => {
      // Convert headers object to flat array format to preserve whitespace in values
      const headerArray = [];
      for (const key of Object.keys(headers)) {
        headerArray.push(key, headers[key]);
      }

      const requestURL = new URL(url);
      // Use the dispatcher from resourceLoader, or fall back to the global dispatcher
      const dispatcher = resourceLoader._dispatcher || getGlobalDispatcher();

      // Collect response data
      const responseHeaders = {};
      const bodyChunks = [];
      let bodyResolve, bodyReject;
      // Use an object so modifications are visible across closures without reassignment
      const bodyState = { complete: false, waiting: null };
      const bodyPromise = new Promise((res, rej) => {
        bodyResolve = res;
        bodyReject = rej;
      });

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

      // Create headers wrapper that is iterable like native Headers
      // We use a custom object instead of Headers because we need to preserve
      // header values without normalization (Headers strips whitespace).
      // The _rawHeaders property is used for JSON serialization in the sync worker.
      function createHeadersWrapper() {
        return {
          _rawHeaders: responseHeaders,
          get(name) {
            const value = responseHeaders[name.toLowerCase()];
            if (Array.isArray(value)) {
              return value.join(", ");
            }
            return value || null;
          },
          getSetCookie() {
            const cookies = responseHeaders["set-cookie"];
            if (!cookies) {
              return [];
            }
            return Array.isArray(cookies) ? cookies : [cookies];
          },
          * [Symbol.iterator]() {
            for (const name of Object.keys(responseHeaders)) {
              const value = responseHeaders[name];
              if (Array.isArray(value)) {
                for (const v of value) {
                  yield [name, v];
                }
              } else {
                yield [name, value];
              }
            }
          }
        };
      }

      dispatcher.dispatch({
        origin: requestURL.origin,
        path: requestURL.pathname + requestURL.search,
        method,
        headers: headerArray,
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

          // Parse raw headers array into object
          // rawHeaders is a flat array: [name, value, name, value, ...]
          for (let i = 0; i < rawHeaders.length; i += 2) {
            const name = rawHeaders[i].toString().toLowerCase();
            const value = rawHeaders[i + 1].toString();
            if (responseHeaders[name] !== undefined) {
              // Handle multiple headers with same name (like set-cookie)
              if (Array.isArray(responseHeaders[name])) {
                responseHeaders[name].push(value);
              } else {
                responseHeaders[name] = [responseHeaders[name], value];
              }
            } else {
              responseHeaders[name] = value;
            }
          }
          // Resolve immediately when headers are received
          resolve({
            status: statusCode,
            statusText: statusText || "",
            headers: createHeadersWrapper(),
            body: {
              arrayBuffer() {
                return bodyPromise.then(() => {
                  const totalLength = bodyChunks.reduce((sum, chunk) => sum + chunk.length, 0);
                  const result = new Uint8Array(totalLength);
                  let offset = 0;
                  for (const chunk of bodyChunks) {
                    result.set(chunk, offset);
                    offset += chunk.length;
                  }
                  return result.buffer;
                });
              },
              async* [Symbol.asyncIterator]() {
                let index = 0;
                // Yield chunks as they arrive
                while (index < bodyChunks.length || !bodyState.complete) {
                  if (index < bodyChunks.length) {
                    yield bodyChunks[index++];
                  } else if (!bodyState.complete) {
                    // Wait for new data or completion
                    await new Promise(r => {
                      bodyState.waiting = r;
                    });
                  }
                }
                // Yield any remaining chunks
                while (index < bodyChunks.length) {
                  yield bodyChunks[index++];
                }
              }
            },
            arrayBuffer() {
              return bodyPromise.then(() => {
                const totalLength = bodyChunks.reduce((sum, chunk) => sum + chunk.length, 0);
                const result = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of bodyChunks) {
                  result.set(chunk, offset);
                  offset += chunk.length;
                }
                return result.buffer;
              });
            }
          });

          return true; // Continue receiving body
        },
        onData(chunk) {
          // If aborted, stop receiving data
          if (abortController.signal.aborted) {
            return false;
          }
          bodyChunks.push(chunk);
          // Notify any waiting iterator
          if (bodyState.waiting) {
            bodyState.waiting();
          }
          return true;
        },
        onComplete() {
          abortController.signal.removeEventListener("abort", onAbort);
          bodyState.complete = true;
          bodyResolve();
          // Notify any waiting iterator
          if (bodyState.waiting) {
            bodyState.waiting();
          }
        },
        onError(err) {
          abortController.signal.removeEventListener("abort", onAbort);
          bodyReject(err);
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
          headers.Cookie = cookieString;
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
        const setCookieHeaders = response.headers.getSetCookie();
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
    try {
      // Handle CORS preflight if needed
      if (needsPreflight) {
        flag.preflight = true;

        const preflightRequestHeaders = {
          "Origin": requestHeaders.Origin,
          "Access-Control-Request-Method": flag.method,
          "User-Agent": flag.userAgent
        };

        if (nonSimpleHeaders.length > 0) {
          preflightRequestHeaders["Access-Control-Request-Headers"] = nonSimpleHeaders.join(", ");
        }

        const preflightResponse = await doFetch(uri, "OPTIONS", preflightRequestHeaders, null);

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
      let finalResponse;

      let authSent = false;

      while (redirectCount < MAX_REDIRECTS) {
        // Build headers for this request, adding cookies
        const currentHeaders = { ...requestHeaders };

        // Check if current URL is cross-origin and add Origin header if needed
        const currentURLObj = new URL(currentURL);
        const isCurrentCrossOrigin = flag.origin !== currentURLObj.origin;
        if (isCurrentCrossOrigin && !currentHeaders.Origin) {
          currentHeaders.Origin = flag.origin;
        }

        await addCookies(currentHeaders, currentURL);

        // Add basic auth only after receiving a 401 challenge (or if explicitly set via setRequestHeader)
        if (authSent && flag.auth) {
          const authString = `${flag.auth.user || ""}:${flag.auth.pass || ""}`;
          currentHeaders.Authorization = "Basic " + toBase64(utf8Encode(authString));
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

          // Consume the 401 response body
          try {
            await response.arrayBuffer();
          } catch {
            // Ignore
          }

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

            // Emit redirect event (used for CORS validation in XMLHttpRequest-impl.js)
            client.emit("redirect", response, currentHeaders, prevURL, currentURL);

            // Handle method change for 301/302/303
            if ((response.status === 301 || response.status === 302) && flag.method === "POST") {
              flag.method = "GET";
            } else if (response.status === 303 && !["GET", "HEAD"].includes(flag.method)) {
              flag.method = "GET";
            }

            // Consume the redirect response body
            try {
              await response.arrayBuffer();
            } catch {
              // Ignore
            }

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

      // Emit the response event
      client.emit("response", responseObj, currentURL);

      // Emit request event for upload tracking
      client.emit("request", {
        on(event, handler) {
          if (event === "response") {
            // Already got response, call handler immediately
            setImmediate(() => handler(responseObj));
          }
        }
      });

      // Stream the response body using async iteration (undici's body is an async iterable)
      if (finalResponse.body) {
        for await (const chunk of finalResponse.body) {
          if (aborted) {
            break;
          }
          responseObj.emit("data", chunk);
          client.emit("data", chunk);
        }
      }

      if (!aborted) {
        responseObj.emit("end");
        client.emit("end");
      }
    } catch (err) {
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
exports.getRequestHeader = getRequestHeader;
exports.updateRequestHeader = updateRequestHeader;
exports.dispatchError = dispatchError;
exports.validCORSHeaders = validCORSHeaders;
exports.requestErrorSteps = requestErrorSteps;
exports.setResponseToNetworkError = setResponseToNetworkError;
exports.createClient = createClient;
