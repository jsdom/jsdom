"use strict";

const { Readable, pipeline } = require("stream");
const zlib = require("zlib");
const { URL, parseURL, serializeURLOrigin } = require("whatwg-url");
const { getGlobalDispatcher } = require("undici");
const ResourceLoader = require("../../browser/resources/resource-loader");
const { asciiLowercase } = require("../helpers/strings");
const { utf8Encode } = require("../helpers/encoding");
const { toBase64 } = require("@exodus/bytes/base64.js");
const {
  headerListContains,
  headerListGet,
  headerListGetDecodeAndSplit,
  headerListAppend,
  headerListDelete
} = require("./xhr-utils");
const {
  isCORSWhitelisted,
  isNoCORSSafelistedRequest,
  isForbiddenResponse
} = require("../fetch/header-types");

const SIMPLE_METHODS = new Set(["GET", "HEAD", "POST"]);
const CORS_SAFE_RESPONSE_HEADERS = new Set([
  "cache-control",
  "content-language",
  "content-length",
  "content-type",
  "expires",
  "last-modified",
  "pragma"
]);

function makeNetworkErrorResponse({ aborted = false } = {}) {
  return {
    type: "error",
    status: 0,
    statusMessage: "",
    headerList: [],
    body: null,
    url: null,
    aborted
  };
}

function getURLRecord(url) {
  if (!url) {
    return null;
  }
  if (url.scheme) {
    return url;
  }
  if (url._url) {
    return url._url;
  }
  if (url.href) {
    return parseURL(url.href);
  }
  return null;
}

function getOrigin(url) {
  if (!url) {
    return null;
  }
  if (url.origin) {
    return url.origin;
  }
  const record = getURLRecord(url);
  return record ? serializeURLOrigin(record) : null;
}

function basicAuthorizationHeader(username, password) {
  const authString = `${username}:${password}`;
  return "Basic " + toBase64(utf8Encode(authString));
}

function getScheme(url) {
  if (!url) {
    return null;
  }
  if (url.protocol) {
    return url.protocol;
  }
  const record = getURLRecord(url);
  return record ? `${record.scheme}:` : null;
}

function urlHasCredentials(url) {
  if (!url) {
    return false;
  }
  if (typeof url.username === "string" && typeof url.password === "string") {
    return url.username !== "" || url.password !== "";
  }
  const record = getURLRecord(url);
  if (!record) {
    return false;
  }
  return record.username !== "" || record.password !== "";
}

function isSameOrigin(origin, url) {
  if (!origin) {
    return false;
  }
  return origin === getOrigin(url);
}

function cloneHeaderList(list) {
  return list.map(header => ({ name: header.name, value: header.value }));
}

function headerListToUndiciHeaders(list) {
  const headers = [];
  for (const header of list) {
    headers.push(header.name, header.value);
  }
  return headers;
}

function getHeaderValues(list, name) {
  const lowerName = asciiLowercase(name);
  const values = [];
  for (const header of list) {
    if (asciiLowercase(header.name) === lowerName) {
      values.push(header.value);
    }
  }
  return values;
}

function decodeBodyStream(response) {
  const codings = headerListGetDecodeAndSplit(response.headerList, "Content-Encoding") || [];
  const decoders = [];

  for (let i = codings.length - 1; i >= 0; i--) {
    const coding = asciiLowercase(codings[i].trim());
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

  if (decoders.length === 0) {
    return response.body;
  }

  let stream = response.body;
  for (const decoder of decoders) {
    stream = pipeline(stream, decoder, () => {});
  }

  return stream;
}

function createAbortError() {
  const error = new Error("The operation was aborted.");
  error.name = "AbortError";
  return error;
}

function incrementallyRead(body, processBodyChunk, processEndOfBody, processBodyError) {
  if (!body) {
    processEndOfBody();
    return;
  }

  body.on("data", chunk => {
    processBodyChunk(chunk);
  });
  body.on("end", () => {
    processEndOfBody();
  });
  body.on("error", err => {
    processBodyError(err);
  });
}

async function readFully(body) {
  if (!body) {
    return null;
  }

  const chunks = [];
  let length = 0;
  await new Promise((resolve, reject) => {
    body.on("data", chunk => {
      chunks.push(chunk);
      length += chunk.length;
    });
    body.on("end", resolve);
    body.on("error", reject);
  });

  const buffer = Buffer.allocUnsafe(length);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return new Uint8Array(buffer);
}

function applyResponseHeaderFiltering(request, response) {
  const filtered = [];
  const crossOrigin = !isSameOrigin(request.origin, response.url);
  const scheme = getScheme(response.url);
  const needsCredentials = request.credentialsMode === "include" ||
    request.useURLCredentialsFlag ||
    urlHasCredentials(response.url);

  if (crossOrigin && scheme !== "data:") {
    const origin = headerListGet(response.headerList, "Access-Control-Allow-Origin");
    if (origin !== "*" && origin !== request.origin) {
      return makeNetworkErrorResponse();
    }
    if (needsCredentials) {
      const credentials = headerListGet(response.headerList, "Access-Control-Allow-Credentials");
      if (credentials !== "true" || origin === "*") {
        return makeNetworkErrorResponse();
      }
    }

    const expose = headerListGetDecodeAndSplit(response.headerList, "Access-Control-Expose-Headers") || [];
    const exposeSet = new Set(expose.map(value => asciiLowercase(value.trim())));
    for (const header of response.headerList) {
      const lowerName = asciiLowercase(header.name);
      if (isForbiddenResponse(lowerName)) {
        continue;
      }
      if (CORS_SAFE_RESPONSE_HEADERS.has(lowerName) || exposeSet.has(lowerName) || exposeSet.has("*")) {
        filtered.push(header);
      }
    }
  } else {
    for (const header of response.headerList) {
      const lowerName = asciiLowercase(header.name);
      if (!isForbiddenResponse(lowerName)) {
        filtered.push(header);
      }
    }
  }

  response.headerList = filtered;
  return response;
}

function passesAccessControlCheck(request, response) {
  const crossOrigin = !isSameOrigin(request.origin, response.url);
  const scheme = getScheme(response.url);
  if (!crossOrigin || scheme === "data:") {
    return true;
  }

  const origin = headerListGet(response.headerList, "Access-Control-Allow-Origin");
  if (origin !== "*" && origin !== request.origin) {
    return false;
  }

  const needsCredentials = request.credentialsMode === "include" ||
    request.useURLCredentialsFlag ||
    urlHasCredentials(response.url);
  if (needsCredentials) {
    const credentials = headerListGet(response.headerList, "Access-Control-Allow-Credentials");
    if (credentials !== "true" || origin === "*") {
      return false;
    }
  }

  return true;
}

async function runPreflight(request, unsafeHeaders, dispatcher, abortController) {
  const url = request.url;
  const preflightHeaders = [];
  headerListAppend(preflightHeaders, "Origin", request.origin);
  headerListAppend(preflightHeaders, "Access-Control-Request-Method", request.method);
  if (unsafeHeaders.length > 0) {
    headerListAppend(preflightHeaders, "Access-Control-Request-Headers", unsafeHeaders.join(", "));
  }
  headerListAppend(preflightHeaders, "Accept", "*/*");
  if (request.userAgent) {
    headerListAppend(preflightHeaders, "User-Agent", request.userAgent);
  }

  const response = await dispatchRequest(url, "OPTIONS", preflightHeaders, null, dispatcher, abortController);
  response.body?.destroy();

  if (response.status < 200 || response.status > 299) {
    return makeNetworkErrorResponse();
  }

  const allowOrigin = headerListGet(response.headerList, "Access-Control-Allow-Origin");
  if (allowOrigin !== "*" && allowOrigin !== request.origin) {
    return makeNetworkErrorResponse();
  }

  const allowCredentials = headerListGet(response.headerList, "Access-Control-Allow-Credentials");
  const needsCredentials = request.credentialsMode === "include" || request.useURLCredentialsFlag;
  if (needsCredentials && (allowCredentials !== "true" || allowOrigin === "*")) {
    return makeNetworkErrorResponse();
  }

  const allowHeaders = new Set(
    (headerListGetDecodeAndSplit(response.headerList, "Access-Control-Allow-Headers") || [])
      .map(value => asciiLowercase(value.trim()))
  );
  if (!allowHeaders.has("*") && unsafeHeaders.some(header => !allowHeaders.has(header))) {
    return makeNetworkErrorResponse();
  }

  return null;
}

function getUnsafeHeaderNames(headerList) {
  const unsafe = new Set();
  for (const header of headerList) {
    const name = header.name;
    const value = header.value;
    const lowerName = asciiLowercase(name);
    if (!isCORSWhitelisted(name, value) && !isNoCORSSafelistedRequest(lowerName)) {
      unsafe.add(lowerName);
    }
  }
  return [...unsafe].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

async function dispatchRequest(url, method, headerList, body, dispatcher, abortController, onConnectCallback) {
  const headerArray = headerListToUndiciHeaders(headerList);

  return new Promise((resolve, reject) => {
    const requestURL = new URL(url.href);
    let bodyStream = null;
    let dispatchAbort = null;
    let settled = false;

    function onAbort() {
      if (dispatchAbort && !settled) {
        try {
          dispatchAbort();
        } catch {
          // Ignore abort errors thrown by the dispatcher.
        }
      } else if (bodyStream) {
        bodyStream.destroy();
      }
      if (!settled) {
        settled = true;
        resolve(makeNetworkErrorResponse({ aborted: true }));
      }
    }

    abortController.signal.addEventListener("abort", onAbort, { once: true });

    dispatcher.dispatch({
      origin: requestURL.origin,
      path: requestURL.pathname + requestURL.search,
      method,
      headers: headerArray,
      body
    }, {
      onConnect(abort) {
        dispatchAbort = abort;
        if (onConnectCallback) {
          onConnectCallback();
        }
        if (abortController.signal.aborted) {
          abort(createAbortError());
        }
      },
      onHeaders(statusCode, rawHeaders, resume, statusText) {
        const responseHeaders = [];
        for (let i = 0; i < rawHeaders.length; i += 2) {
          const name = rawHeaders[i].toString("latin1");
          const value = rawHeaders[i + 1].toString("latin1");
          responseHeaders.push({ name, value });
        }

        bodyStream = new Readable({ read: resume });
        resolve({
          status: statusCode,
          statusMessage: statusText || "",
          headerList: responseHeaders,
          body: bodyStream,
          url: parseURL(requestURL.href)
        });
        settled = true;

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

async function fetchWithResourceLoader(request, resourceLoader, abortController) {
  const response = await resourceLoader.fetch(request.url.href, {
    method: request.method,
    headers: headerListToUndiciHeaders(request.headerList),
    body: request.body,
    referrer: request.referrer || undefined,
    signal: abortController.signal,
    cookieJar: request.cookieJar
  });

  const buffer = new Uint8Array(await response.arrayBuffer());
  const headers = [];
  for (const [name, value] of response.headers) {
    headers.push({ name, value });
  }

  return {
    status: response.status,
    statusMessage: response.statusText,
    headerList: headers,
    body: Readable.from([buffer]),
    url: parseURL(response.url || request.url.href)
  };
}

async function performFetch(request, abortController, onRequestConnect) {
  const resourceLoader = request.resourceLoader || new ResourceLoader();
  const dispatcher = resourceLoader._dispatcher || getGlobalDispatcher();
  const authCache = request.authCache || {};
  const userProvidedAuth = headerListContains(request.headerList, "Authorization");

  if (request.url.protocol === "data:" || request.url.protocol === "file:") {
    if (onRequestConnect) {
      onRequestConnect();
    }
    return fetchWithResourceLoader(request, resourceLoader, abortController);
  }

  let requestHeaders = cloneHeaderList(request.headerList);

  if (request.referrer && !headerListContains(requestHeaders, "Referer")) {
    headerListAppend(requestHeaders, "Referer", request.referrer);
  }
  if (request.userAgent && !headerListContains(requestHeaders, "User-Agent")) {
    headerListAppend(requestHeaders, "User-Agent", request.userAgent);
  }
  if (!headerListContains(requestHeaders, "Accept")) {
    headerListAppend(requestHeaders, "Accept", "*/*");
  }
  if (!headerListContains(requestHeaders, "Accept-Language")) {
    headerListAppend(requestHeaders, "Accept-Language", "en");
  }
  if (!headerListContains(requestHeaders, "Accept-Encoding")) {
    headerListAppend(requestHeaders, "Accept-Encoding", "gzip, deflate");
  }

  const crossOrigin = !isSameOrigin(request.origin, request.url);
  if (crossOrigin) {
    headerListDelete(requestHeaders, "Origin");
    headerListAppend(requestHeaders, "Origin", request.origin);
  }

  if (request.body && !headerListContains(requestHeaders, "Content-Length")) {
    headerListAppend(requestHeaders, "Content-Length", String(request.body.byteLength));
  }

  const hasBody = request.body !== null;
  const unsafeHeaderNames = getUnsafeHeaderNames(request.headerList);
  const needsPreflight = crossOrigin && (request.useCORSPreflightFlag || !SIMPLE_METHODS.has(request.method) ||
    unsafeHeaderNames.length > 0 || request.uploadListenerFlag);

  if (needsPreflight) {
    const preflightError = await runPreflight(request, unsafeHeaderNames, dispatcher, abortController);
    if (preflightError) {
      return preflightError;
    }
  }

  let currentURL = request.url;
  let currentMethod = request.method;
  let currentBody = hasBody ? request.body : null;
  let redirectCount = 0;
  let origin = request.origin;
  let urlAuthTried = false;

  while (redirectCount < 20) {
    const currentCrossOrigin = !isSameOrigin(request.origin, currentURL);
    headerListDelete(requestHeaders, "Cookie");
    if (request.cookieJar && (!currentCrossOrigin || request.credentialsMode === "include")) {
      try {
        const cookieString = await request.cookieJar.getCookieString(currentURL.href);
        if (cookieString) {
          headerListAppend(requestHeaders, "Cookie", cookieString);
        }
      } catch {
        // Ignore cookie errors
      }
    }

    const hasURLCredentials = currentURL.username !== "" || currentURL.password !== "";
    const cacheKey = getOrigin(currentURL) || "null";
    if (!userProvidedAuth &&
        !headerListContains(requestHeaders, "Authorization") &&
        !hasURLCredentials &&
        authCache[cacheKey]) {
      const cached = authCache[cacheKey];
      headerListAppend(requestHeaders, "Authorization",
        basicAuthorizationHeader(cached.username, cached.password));
    }

    let response = await dispatchRequest(currentURL, currentMethod, requestHeaders, currentBody, dispatcher,
      abortController, onRequestConnect);

    if (!userProvidedAuth &&
        !headerListContains(requestHeaders, "Authorization") &&
        hasURLCredentials &&
        !urlAuthTried &&
        response.status === 401) {
      const authenticate = headerListGet(response.headerList, "WWW-Authenticate") || "";
      if (/\bBasic\b/i.test(authenticate)) {
        urlAuthTried = true;
        response.body?.destroy();
        headerListAppend(requestHeaders, "Authorization",
          basicAuthorizationHeader(currentURL.username, currentURL.password));
        response = await dispatchRequest(currentURL, currentMethod, requestHeaders, currentBody, dispatcher,
          abortController, onRequestConnect);
        if (response.status >= 200 && response.status < 400) {
          authCache[cacheKey] = { username: currentURL.username, password: currentURL.password };
        }
      }
    }

    if (!userProvidedAuth &&
        headerListContains(requestHeaders, "Authorization") &&
        response.status >= 200 && response.status < 400 &&
        !authCache[cacheKey]) {
      const authValue = headerListGet(requestHeaders, "Authorization") || "";
      const token = authValue.split(" ")[1] || "";
      const [username, password] = Buffer.from(token, "base64").toString("utf8").split(":");
      if (username !== undefined && password !== undefined) {
        authCache[cacheKey] = { username, password };
      }
    }

    if (!passesAccessControlCheck(request, response)) {
      response.body?.destroy();
      return makeNetworkErrorResponse();
    }

    if (request.cookieJar && (!currentCrossOrigin || request.credentialsMode === "include")) {
      const setCookies = getHeaderValues(response.headerList, "Set-Cookie");
      await Promise.all(setCookies.map(cookie => request.cookieJar.setCookie(cookie, currentURL.href,
        { ignoreError: true }).catch(() => {})));
    }

    if (response.status >= 300 && response.status < 400) {
      const location = headerListGet(response.headerList, "Location");
      if (!location) {
        response.url = parseURL(currentURL.href);
        return response;
      }

      const previousURL = currentURL;
      currentURL = new URL(location, currentURL.href);
      redirectCount++;

      if ((response.status === 301 || response.status === 302) && currentMethod === "POST") {
        currentMethod = "GET";
        currentBody = null;
        headerListDelete(requestHeaders, "Content-Type");
        headerListDelete(requestHeaders, "Content-Length");
      } else if (response.status === 303 && currentMethod !== "GET" && currentMethod !== "HEAD") {
        currentMethod = "GET";
        currentBody = null;
        headerListDelete(requestHeaders, "Content-Type");
        headerListDelete(requestHeaders, "Content-Length");
      }

      const previousOrigin = getOrigin(previousURL);
      const nextOrigin = getOrigin(currentURL);
      const isCrossOriginRedirect = previousOrigin !== nextOrigin;

      if (isCrossOriginRedirect && previousOrigin !== origin) {
        origin = "null";
      }
      headerListDelete(requestHeaders, "Origin");
      headerListAppend(requestHeaders, "Origin", origin);
      if (isCrossOriginRedirect) {
        headerListDelete(requestHeaders, "Authorization");
      }

      response.body?.destroy();
      continue;
    }

    response.url = parseURL(currentURL.href);
    return response;
  }

  return makeNetworkErrorResponse();
}

function fetching(request, {
  processRequestBodyChunkLength,
  processRequestEndOfBody,
  processResponse,
  processResponseConsumeBody
} = {}) {
  const abortController = new AbortController();
  const controller = {
    terminated: false,
    terminate() {
      if (this.terminated) {
        return;
      }
      this.terminated = true;
      abortController.abort();
    }
  };

  (async () => {
    try {
      let didReportRequestBody = false;
      const onRequestConnect = () => {
        if (didReportRequestBody || abortController.signal.aborted) {
          return;
        }
        didReportRequestBody = true;
        if (request.body && processRequestBodyChunkLength) {
          processRequestBodyChunkLength(request.body.byteLength);
        }
        if (request.body && processRequestEndOfBody) {
          processRequestEndOfBody();
        }
      };

      let response = await performFetch(request, abortController, onRequestConnect);
      if (response.type === "error") {
        if (processResponse) {
          processResponse(response);
        } else if (processResponseConsumeBody) {
          processResponseConsumeBody(response, "failure");
        }
        return;
      }

      response = applyResponseHeaderFiltering(request, response);
      if (response.type === "error") {
        if (processResponse) {
          processResponse(response);
        } else if (processResponseConsumeBody) {
          processResponseConsumeBody(response, "failure");
        }
        return;
      }

      response.rawBody = response.body;
      response.body = decodeBodyStream(response);

      if (processResponse) {
        processResponse(response);
        return;
      }

      if (processResponseConsumeBody) {
        const bodyBytes = await readFully(response.body);
        processResponseConsumeBody(response, bodyBytes || null);
      }
    } catch (error) {
      const aborted = abortController.signal.aborted;
      const response = makeNetworkErrorResponse({ aborted });
      if (processResponse) {
        processResponse(response);
      } else if (processResponseConsumeBody) {
        processResponseConsumeBody(response, "failure");
      }
    }
  })();

  return controller;
}

module.exports = {
  fetching,
  incrementallyRead,
  makeNetworkErrorResponse
};
