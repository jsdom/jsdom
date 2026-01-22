"use strict";
const fsPromises = require("fs/promises");
const { fileURLToPath } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const HeaderList = require("../../living/fetch/header-list");

const packageVersion = require("../../../../package.json").version;

const DEFAULT_USER_AGENT = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                           `(KHTML, like Gecko) jsdom/${packageVersion}`;
const MAX_REDIRECTS = 20;

/**
 * Creates the jsdom interceptor that handles:
 * - data: URLs (decode and return)
 * - file: URLs (read from filesystem)
 * - HTTP(S): manually follows redirects, capturing cookies at each hop
 *
 * @param {object} options
 * @param {string} [options.userAgent] - User-Agent header to use for HTTP requests
 * @returns {function} An undici interceptor
 */
function createJsdomInterceptor({ userAgent = DEFAULT_USER_AGENT } = {}) {
  return dispatch => async (opts, handler) => {
    const { cookieJar, url: opaqueURL, noRedirectFollow } = opts.opaque || {};

    // Use URL from opaque if available (set by jsdom-fetch), otherwise reconstruct
    const url = opaqueURL || reconstructURL(opts.origin, opts.path);

    // Handle data: URLs
    if (url.startsWith("data:")) {
      return handleDataURL(url, handler);
    }

    // Handle file: URLs
    if (url.startsWith("file:")) {
      return handleFileURL(url, handler, opts.signal);
    }

    // Pass through WebSocket upgrade requests directly - they can't be buffered
    if (isWebSocketUpgrade(opts.headers)) {
      return dispatch(opts, handler);
    }

    // HTTP(S): follow redirects manually to capture cookies (unless caller handles redirects)
    if (noRedirectFollow) {
      return handleHTTPWithoutRedirects(dispatch, opts, handler, { cookieJar, userAgent });
    }
    return handleHTTPWithRedirects(dispatch, opts, handler, { cookieJar, userAgent });
  };
}

/**
 * Handle data: URLs by decoding them and returning the body.
 */
function handleDataURL(url, handler) {
  const urlRecord = parseURL(url);
  if (!urlRecord) {
    const error = new Error(`Invalid URL: ${url}`);
    if (handler.onError) {
      handler.onError(error);
    } else if (handler.onResponseError) {
      handler.onResponseError(null, error);
    }
    return false;
  }

  const dataURL = dataURLFromRecord(urlRecord);
  if (dataURL === null) {
    const error = new TypeError("Invalid data: URL");
    if (handler.onError) {
      handler.onError(error);
    } else if (handler.onResponseError) {
      handler.onResponseError(null, error);
    }
    return false;
  }

  const contentType = dataURL.mimeType.toString();
  const body = dataURL.body;

  // Call onConnect if present (expected by undici's compose)
  if (handler.onConnect) {
    handler.onConnect(() => {});
  }

  // Always use old handler API for compatibility with undici's compose
  if (handler.onHeaders) {
    const rawHeaders = ["content-type", contentType];
    const resume = () => {};
    handler.onHeaders(200, rawHeaders, resume, "OK");
    handler.onData(body);
    handler.onComplete({});
  } else if (handler.onResponseStart) {
    handler.onResponseStart(null, 200, { "content-type": contentType }, "OK");
    handler.onResponseData(null, body);
    handler.onResponseEnd(null, {});
  }

  return true;
}

/**
 * Handle file: URLs by reading from the filesystem.
 */
async function handleFileURL(url, handler, signal) {
  // Call onConnect if present (expected by undici's compose)
  if (handler.onConnect) {
    handler.onConnect(() => {});
  }

  try {
    const filePath = fileURLToPath(url);
    const body = await fsPromises.readFile(filePath, { signal });

    // Always use old handler API for compatibility with undici's compose
    if (handler.onHeaders) {
      const rawHeaders = [];
      const resume = () => {};
      handler.onHeaders(200, rawHeaders, resume, "OK");
      handler.onData(body);
      handler.onComplete({});
    } else if (handler.onResponseStart) {
      handler.onResponseStart(null, 200, {}, "OK");
      handler.onResponseData(null, body);
      handler.onResponseEnd(null, {});
    }

    return true;
  } catch (error) {
    if (handler.onError) {
      handler.onError(error);
    } else if (handler.onResponseError) {
      handler.onResponseError(null, error);
    }
    return false;
  }
}

/**
 * Handle HTTP(S) requests without following redirects.
 * Used when the caller (like XHR) handles redirects itself.
 * Still handles cookies and default headers.
 */
async function handleHTTPWithoutRedirects(dispatch, opts, handler, { cookieJar, userAgent }) {
  const { url: opaqueURL } = opts.opaque || {};
  const currentURL = opaqueURL || reconstructURL(opts.origin, opts.path);
  const currentMethod = opts.method || "GET";
  const originalHeaders = normalizeHeadersToObject(opts.headers);

  // Build request headers
  const requestHeaders = { ...originalHeaders };

  // Set default headers if not already present
  if (!hasHeaderCaseInsensitive(requestHeaders, "User-Agent")) {
    requestHeaders["User-Agent"] = userAgent;
  }
  if (!hasHeaderCaseInsensitive(requestHeaders, "Accept-Language")) {
    requestHeaders["Accept-Language"] = "en";
  }
  if (!hasHeaderCaseInsensitive(requestHeaders, "Accept")) {
    requestHeaders["Accept"] = "*/*";
  }
  if (!hasHeaderCaseInsensitive(requestHeaders, "Accept-Encoding")) {
    requestHeaders["Accept-Encoding"] = "gzip, deflate";
  }
  if (opts.referrer && !hasHeaderCaseInsensitive(requestHeaders, "Referer")) {
    requestHeaders.Referer = opts.referrer;
  }

  // Add cookies from jar for the current URL (but not for CORS preflight OPTIONS requests)
  const isPreflightRequest = currentMethod === "OPTIONS" &&
    hasHeaderCaseInsensitive(requestHeaders, "Access-Control-Request-Method");
  if (cookieJar && !isPreflightRequest) {
    try {
      const cookieString = await cookieJar.getCookieString(currentURL);
      if (cookieString) {
        requestHeaders.Cookie = cookieString;
      }
    } catch {
      // Ignore cookie errors
    }
  }

  const parsedURL = new URL(currentURL);
  const dispatchOpts = {
    origin: parsedURL.origin,
    path: parsedURL.pathname + parsedURL.search,
    method: currentMethod,
    headers: requestHeaders,
    body: opts.body,
    signal: opts.signal,
    opaque: opts.opaque
  };

  // Dispatch and stream response, storing cookies from response
  return dispatchWithCookieHandling(dispatch, dispatchOpts, handler, currentURL, cookieJar);
}

/**
 * Dispatch and stream response, handling cookies but not redirects.
 */
function dispatchWithCookieHandling(dispatch, opts, handler, currentURL, cookieJar) {
  return new Promise(resolve => {
    let statusCode, statusText, headers;

    dispatch(opts, {
      onConnect(abort) {
        if (handler.onConnect) {
          handler.onConnect(abort);
        }
      },
      onHeaders(status, rawHeaders, resume, text) {
        statusCode = status;
        statusText = text || "";
        headers = HeaderList.fromUndiciRawHeaders(rawHeaders);

        // Add final URL header
        headers.append("x-final-url", currentURL);

        // Forward to handler
        if (handler.onHeaders) {
          const rawHeadersOut = [];
          for (const [name, value] of headers) {
            rawHeadersOut.push(name, value);
          }
          return handler.onHeaders(statusCode, rawHeadersOut, resume, statusText);
        }
        return true;
      },
      onData(chunk) {
        if (handler.onData) {
          return handler.onData(chunk);
        }
        return true;
      },
      async onComplete() {
        // Store cookies from this response
        if (cookieJar) {
          const setCookieHeaders = headers.getAll("set-cookie") || [];
          await Promise.all(setCookieHeaders.map(
            cookie => cookieJar.setCookie(cookie, currentURL, { ignoreError: true }).catch(() => {})
          ));
        }

        if (handler.onComplete) {
          handler.onComplete({});
        }
        resolve(true);
      },
      onError(err) {
        if (handler.onError) {
          handler.onError(err);
        }
        resolve(false);
      },
      // New handler API (undici >= 7)
      onResponseStart(controller, status, hdrs, text) {
        statusCode = status;
        statusText = text || "";
        headers = new HeaderList();
        for (const [key, value] of Object.entries(hdrs)) {
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.append(key, value);
          }
        }

        // Add final URL header
        headers.append("x-final-url", currentURL);

        if (handler.onResponseStart) {
          const headersObj = {};
          for (const [name, value] of headers) {
            const lowerName = name.toLowerCase();
            if (headersObj[lowerName]) {
              if (Array.isArray(headersObj[lowerName])) {
                headersObj[lowerName].push(value);
              } else {
                headersObj[lowerName] = [headersObj[lowerName], value];
              }
            } else {
              headersObj[lowerName] = value;
            }
          }
          handler.onResponseStart(null, statusCode, headersObj, statusText);
        } else if (handler.onHeaders) {
          const rawHeadersOut = [];
          for (const [name, value] of headers) {
            rawHeadersOut.push(name, value);
          }
          handler.onHeaders(statusCode, rawHeadersOut, () => {}, statusText);
        }
      },
      onResponseData(controller, chunk) {
        if (handler.onResponseData) {
          handler.onResponseData(null, chunk);
        } else if (handler.onData) {
          handler.onData(chunk);
        }
      },
      async onResponseEnd(controller, trailers) {
        // Store cookies from this response
        if (cookieJar) {
          const setCookieHeaders = headers.getAll("set-cookie") || [];
          await Promise.all(setCookieHeaders.map(
            cookie => cookieJar.setCookie(cookie, currentURL, { ignoreError: true }).catch(() => {})
          ));
        }

        if (handler.onResponseEnd) {
          handler.onResponseEnd(null, {});
        } else if (handler.onComplete) {
          handler.onComplete({});
        }
        resolve(true);
      },
      onResponseError(controller, err) {
        if (handler.onResponseError) {
          handler.onResponseError(null, err);
        } else if (handler.onError) {
          handler.onError(err);
        }
        resolve(false);
      }
    });
  });
}

/**
 * Handle HTTP(S) requests with manual redirect following and cookie capture.
 * Streams non-redirect responses directly to the handler for progress events.
 */
async function handleHTTPWithRedirects(dispatch, opts, handler, { cookieJar, userAgent }) {
  const { url: opaqueURL } = opts.opaque || {};
  let currentURL = opaqueURL || reconstructURL(opts.origin, opts.path);
  let currentMethod = opts.method || "GET";
  let currentBody = opts.body;
  const originalHeaders = normalizeHeadersToObject(opts.headers);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    // Build request headers for this request
    const requestHeaders = { ...originalHeaders };

    // Set default headers if not already present
    if (!hasHeaderCaseInsensitive(requestHeaders, "User-Agent")) {
      requestHeaders["User-Agent"] = userAgent;
    }
    if (!hasHeaderCaseInsensitive(requestHeaders, "Accept-Language")) {
      requestHeaders["Accept-Language"] = "en";
    }
    if (!hasHeaderCaseInsensitive(requestHeaders, "Accept")) {
      requestHeaders["Accept"] = "*/*";
    }
    if (!hasHeaderCaseInsensitive(requestHeaders, "Accept-Encoding")) {
      requestHeaders["Accept-Encoding"] = "gzip, deflate";
    }
    if (opts.referrer && !hasHeaderCaseInsensitive(requestHeaders, "Referer")) {
      requestHeaders.Referer = opts.referrer;
    }

    // Add cookies from jar for the current URL (but not for CORS preflight OPTIONS requests)
    const isPreflightRequest = currentMethod === "OPTIONS" &&
      hasHeaderCaseInsensitive(requestHeaders, "Access-Control-Request-Method");
    if (cookieJar && !isPreflightRequest) {
      try {
        const cookieString = await cookieJar.getCookieString(currentURL);
        if (cookieString) {
          requestHeaders.Cookie = cookieString;
        }
      } catch {
        // Ignore cookie errors
      }
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

    // Use streaming dispatch - it will tell us if we need to redirect or can stream
    const result = await dispatchWithStreamingSupport(dispatch, dispatchOpts, handler, currentURL, cookieJar);

    if (result.error) {
      if (handler.onResponseError) {
        handler.onResponseError(null, result.error);
      } else if (handler.onError) {
        handler.onError(result.error);
      }
      return false;
    }

    if (result.streamed) {
      // Response was streamed directly to handler, we're done
      return true;
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
    return false;
  }

  const error = new Error(`Too many redirects (max ${MAX_REDIRECTS})`);
  if (handler.onResponseError) {
    handler.onResponseError(null, error);
  } else if (handler.onError) {
    handler.onError(error);
  }
  return false;
}

/**
 * Dispatch a request with streaming support.
 * - For redirects: buffers body, stores cookies, returns redirect info
 * - For non-redirects: streams response directly to handler
 * Returns: { streamed: true } | { redirect: { url, methodChange } } | { error }
 */
function dispatchWithStreamingSupport(dispatch, opts, handler, currentURL, cookieJar) {
  return new Promise(resolve => {
    let statusCode, statusText, headers;
    let isRedirect = false;
    let redirectChunks = [];
    let handlerConnected = false;

    dispatch(opts, {
      onConnect(abort) {
        // Store abort for later if needed
      },
      onHeaders(status, rawHeaders, resume, text) {
        statusCode = status;
        statusText = text || "";
        headers = HeaderList.fromUndiciRawHeaders(rawHeaders);

        // Check if this is a redirect
        isRedirect = status >= 300 && status < 400 && headers.get("location");

        if (!isRedirect) {
          // Not a redirect - stream directly to handler
          // Add final URL header and connect handler
          headers.append("x-final-url", currentURL);

          if (handler.onConnect) {
            handler.onConnect(() => {});
          }
          handlerConnected = true;

          if (handler.onHeaders) {
            const rawHeadersOut = [];
            for (const [name, value] of headers) {
              rawHeadersOut.push(name, value);
            }
            handler.onHeaders(statusCode, rawHeadersOut, resume, statusText);
          }
        }

        return true;
      },
      onData(chunk) {
        if (isRedirect) {
          // Buffer redirect response body (usually empty)
          redirectChunks.push(chunk);
        } else if (handler.onData) {
          // Stream to handler
          handler.onData(chunk);
        }
        return true;
      },
      async onComplete() {
        // Store cookies from this response
        if (cookieJar) {
          const setCookieHeaders = headers.getAll("set-cookie") || [];
          await Promise.all(setCookieHeaders.map(
            cookie => cookieJar.setCookie(cookie, currentURL, { ignoreError: true }).catch(() => {})
          ));
        }

        if (isRedirect) {
          const location = headers.get("location");
          const newURL = (new URL(location, currentURL)).href;
          const methodChange = statusCode === 303 ||
            ((statusCode === 301 || statusCode === 302) && opts.method === "POST");

          resolve({ redirect: { url: newURL, methodChange } });
        } else {
          // Complete the streamed response
          if (handler.onComplete) {
            handler.onComplete({});
          }
          resolve({ streamed: true });
        }
      },
      onError(err) {
        resolve({ error: err });
      },
      // New handler API (undici >= 7)
      onResponseStart(controller, status, hdrs, text) {
        statusCode = status;
        statusText = text || "";
        headers = new HeaderList();
        for (const [key, value] of Object.entries(hdrs)) {
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.append(key, value);
          }
        }

        // Check if this is a redirect
        isRedirect = status >= 300 && status < 400 && headers.get("location");

        if (!isRedirect) {
          // Not a redirect - stream directly to handler
          headers.append("x-final-url", currentURL);

          if (handler.onConnect) {
            handler.onConnect(() => {});
          }
          handlerConnected = true;

          if (handler.onResponseStart) {
            const headersObj = {};
            for (const [name, value] of headers) {
              const lowerName = name.toLowerCase();
              if (headersObj[lowerName]) {
                if (Array.isArray(headersObj[lowerName])) {
                  headersObj[lowerName].push(value);
                } else {
                  headersObj[lowerName] = [headersObj[lowerName], value];
                }
              } else {
                headersObj[lowerName] = value;
              }
            }
            handler.onResponseStart(null, statusCode, headersObj, statusText);
          } else if (handler.onHeaders) {
            // Fallback to old API
            const rawHeadersOut = [];
            for (const [name, value] of headers) {
              rawHeadersOut.push(name, value);
            }
            handler.onHeaders(statusCode, rawHeadersOut, () => {}, statusText);
          }
        }
      },
      onResponseData(controller, chunk) {
        if (isRedirect) {
          redirectChunks.push(chunk);
        } else if (handler.onResponseData) {
          handler.onResponseData(null, chunk);
        } else if (handler.onData) {
          handler.onData(chunk);
        }
      },
      async onResponseEnd(controller, trailers) {
        // Store cookies from this response
        if (cookieJar) {
          const setCookieHeaders = headers.getAll("set-cookie") || [];
          await Promise.all(setCookieHeaders.map(
            cookie => cookieJar.setCookie(cookie, currentURL, { ignoreError: true }).catch(() => {})
          ));
        }

        if (isRedirect) {
          const location = headers.get("location");
          const newURL = (new URL(location, currentURL)).href;
          const methodChange = statusCode === 303 ||
            ((statusCode === 301 || statusCode === 302) && opts.method === "POST");

          resolve({ redirect: { url: newURL, methodChange } });
        } else {
          if (handler.onResponseEnd) {
            handler.onResponseEnd(null, {});
          } else if (handler.onComplete) {
            handler.onComplete({});
          }
          resolve({ streamed: true });
        }
      },
      onResponseError(controller, err) {
        resolve({ error: err });
      }
    });
  });
}

/**
 * Dispatch a request and collect the full response.
 * Returns { response: { statusCode, statusText, headers: HeaderList, body: Buffer } } or { error }.
 */
function dispatchAndCollect(dispatch, opts) {
  return new Promise(resolve => {
    const chunks = [];
    let statusCode, statusText, headers;

    dispatch(opts, {
      onConnect(abort) {
        // No-op
      },
      onHeaders(status, rawHeaders, resume, text) {
        statusCode = status;
        statusText = text || "";
        headers = HeaderList.fromUndiciRawHeaders(rawHeaders);
        return true;
      },
      onData(chunk) {
        chunks.push(chunk);
        return true;
      },
      onComplete() {
        resolve({
          response: {
            statusCode,
            statusText,
            headers,
            body: Buffer.concat(chunks)
          }
        });
      },
      onError(err) {
        resolve({ error: err });
      },
      // New handler API
      onResponseStart(controller, status, hdrs, text) {
        statusCode = status;
        statusText = text || "";
        // hdrs is already an object, convert to HeaderList
        headers = new HeaderList();
        for (const [key, value] of Object.entries(hdrs)) {
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.append(key, value);
          }
        }
      },
      onResponseData(controller, chunk) {
        chunks.push(chunk);
      },
      onResponseEnd(controller, trailers) {
        resolve({
          response: {
            statusCode,
            statusText,
            headers,
            body: Buffer.concat(chunks)
          }
        });
      },
      onResponseError(controller, err) {
        resolve({ error: err });
      }
    });
  });
}

/**
 * Send a collected response to the handler.
 */
function sendCollectedResponse(response, finalURL, handler) {
  // Add x-final-url header for consumers to know the final URL after redirects
  response.headers.append("x-final-url", finalURL);

  // Call onConnect if present (expected by undici's compose)
  if (handler.onConnect) {
    handler.onConnect(() => {});
  }

  // Always use old handler API for compatibility with undici's compose
  if (handler.onHeaders) {
    // Convert HeaderList to flat array for onHeaders
    const rawHeaders = [];
    for (const [name, value] of response.headers) {
      rawHeaders.push(name, value);
    }
    const resume = () => {};
    handler.onHeaders(response.statusCode, rawHeaders, resume, response.statusText);
    handler.onData(response.body);
    handler.onComplete({});
  } else if (handler.onResponseStart) {
    // Convert HeaderList to object for onResponseStart
    const headersObj = {};
    for (const [name, value] of response.headers) {
      const lowerName = name.toLowerCase();
      if (headersObj[lowerName]) {
        if (Array.isArray(headersObj[lowerName])) {
          headersObj[lowerName].push(value);
        } else {
          headersObj[lowerName] = [headersObj[lowerName], value];
        }
      } else {
        headersObj[lowerName] = value;
      }
    }
    handler.onResponseStart(null, response.statusCode, headersObj, response.statusText);
    handler.onResponseData(null, response.body);
    handler.onResponseEnd(null, {});
  }

  return true;
}

/**
 * Normalize headers to an object format.
 */
function normalizeHeadersToObject(headers) {
  if (!headers) {
    return {};
  }

  if (Array.isArray(headers)) {
    // Convert [key, value, key, value, ...] to object
    const obj = {};
    for (let i = 0; i < headers.length; i += 2) {
      obj[headers[i]] = headers[i + 1];
    }
    return obj;
  }

  if (typeof headers === "object") {
    return { ...headers };
  }

  return {};
}

/**
 * Check if a header exists (case-insensitive).
 */
function hasHeaderCaseInsensitive(headers, name) {
  const lowerName = name.toLowerCase();
  return Object.keys(headers).some(key => key.toLowerCase() === lowerName);
}

/**
 * Check if this is a WebSocket upgrade request.
 * WebSocket requests have "sec-websocket-key" header and can't be buffered.
 * Note: undici doesn't include "Upgrade: websocket" in the headers object passed to interceptors.
 */
function isWebSocketUpgrade(headers) {
  if (!headers) {
    return false;
  }

  // Headers can be array [key, value, key, value, ...] or object
  if (Array.isArray(headers)) {
    for (let i = 0; i < headers.length; i += 2) {
      const key = headers[i];
      if (typeof key === "string" && key.toLowerCase() === "sec-websocket-key") {
        return true;
      }
    }
    return false;
  }

  // Object format
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === "sec-websocket-key") {
      return true;
    }
  }
  return false;
}

/**
 * Reconstruct URL from origin and path.
 * Handles special cases for data: and file: URLs where origin is "null".
 */
function reconstructURL(origin, path) {
  if (origin === "null" || origin === null) {
    // For data: and file: URLs, origin is the string "null"
    // Distinguish by path: file: URLs have paths starting with "/"
    if (path && path.startsWith("/")) {
      return "file://" + path;
    }
    // Otherwise assume data: URL (path is media-type,data)
    return "data:" + path;
  }
  return origin + path;
}

module.exports = createJsdomInterceptor;
module.exports.DEFAULT_USER_AGENT = DEFAULT_USER_AGENT;
