"use strict";
const fs = require("fs");
const http = require("http");
const https = require("https");
const { EventEmitter } = require("events");
const fetch = require("node-fetch");
const fetchCookie = require("fetch-cookie/node-fetch");
const { parse } = require("url");
const HttpsProxyAgent = require("https-proxy-agent");
const HttpProxyAgent = require("http-proxy-agent");
const AbortController = require("abort-controller");
const FormData = require("form-data");

const { URL } = require("whatwg-url");
const parseDataURL = require("data-urls");
const DOMException = require("domexception/webidl2js-wrapper");

const ProgressEvent = require("../generated/ProgressEvent");

const { fireAnEvent } = require("../helpers/events");
const { getResponseBody, getResponseHeaders } = require("../helpers/response");

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

function getRequestHeader(requestHeaders, header) {
  const lcHeader = header.toLowerCase();
  const keys = Object.keys(requestHeaders);
  let n = keys.length;
  while (n--) {
    const key = keys[n];
    if (key.toLowerCase() === lcHeader) {
      return requestHeaders[key];
    }
  }
  return null;
}

function updateRequestHeader(requestHeaders, header, newValue) {
  const lcHeader = header.toLowerCase();
  const keys = Object.keys(requestHeaders);
  let n = keys.length;
  while (n--) {
    const key = keys[n];
    if (key.toLowerCase() === lcHeader) {
      requestHeaders[key] = newValue;
    }
  }
}

function dispatchError(xhr) {
  const originalError = xhr.properties.error;
  requestErrorSteps(xhr, "error", DOMException.create(xhr._globalObject, [originalError, "NetworkError"]));

  if (xhr._ownerDocument) {
    const error = new Error(originalError);
    if (originalError.stack) {
      error.stack = originalError.stack;
    }
    error.type = "XMLHttpRequest"; // TODO this should become "resource loading" when XHR goes through resource loader

    xhr._ownerDocument._defaultView._virtualConsole.emit("jsdomError", error);
  }
}

function validCORSHeaders(xhr, response, flag, properties, origin) {
  const responseHeaders = getResponseHeaders(response);
  const acaoStr = responseHeaders["access-control-allow-origin"];
  const acao = acaoStr ? acaoStr.trim() : null;
  if (acao !== "*" && acao !== origin) {
    properties.error = "Cross origin " + origin + " forbidden";
    dispatchError(xhr);
    return false;
  }
  const acacStr = responseHeaders["access-control-allow-credentials"];
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
  const acahStr = getResponseHeaders(response)["access-control-allow-headers"];
  const acah = new Set(acahStr ? acahStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
  const forbiddenHeaders = Object.keys(flag.requestHeaders).filter(header => {
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

function getAgent(uri, proxy, rejectUnauthorized) {
  const isHttps = uri.substr(0, 6) === "https:";
  const agentOpts = { keepAlive: true, rejectUnauthorized };
  if (proxy) {
    // agentOpts.rejectUnauthorized = this._strictSSL;
    const proxyOpts = { ...parse(proxy), ...agentOpts };
    return isHttps ? new HttpsProxyAgent(proxyOpts) : new HttpProxyAgent(proxyOpts);
  }
  return isHttps ? new https.Agent(agentOpts) : new http.Agent(agentOpts);
}

/** consider @deprecation */
function closeResponse(response) {
  // close the response by reading the response buffer
  // I'm not sure if this is needed.
  return response.buffer();
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
  properties.responseCache = properties.responseTextCache = properties.responseXMLCache = null;
  properties.responseHeaders = {};
  xhr.status = 0;
  xhr.statusText = "";
}

// return a "request" client object or an event emitter matching the same behaviour for unsupported protocols
// the callback should be called with a "request" response object or an event emitter matching the same behaviour too
function createClient(xhr) {
  const { flag, properties } = xhr;
  const { method, proxy, strictSSL } = flag;
  const urlObj = new URL(flag.uri);
  const uri = urlObj.href;
  const ucMethod = method.toUpperCase();

  const { requestManager } = flag;

  if (urlObj.protocol === "file:") {
    const response = new EventEmitter();
    response.status = 200;
    response.rawHeaders = [];
    response.headers = {};
    response.request = { uri: urlObj };
    response.url = uri.href;
    const filePath = urlObj.pathname
      .replace(/^file:\/\//, "")
      .replace(/^\/([a-z]):\//i, "$1:/")
      .replace(/%20/g, " ");

    const client = new EventEmitter();

    const readableStream = fs.createReadStream(filePath, { encoding: null });

    readableStream.on("data", chunk => {
      response.emit("data", chunk);
      client.emit("data", chunk);
    });

    readableStream.on("end", () => {
      response.emit("end");
      client.emit("end");
    });

    readableStream.on("error", err => {
      client.emit("error", err);
    });

    client.abort = function () {
      readableStream.destroy();
      client.emit("abort");
    };

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

    process.nextTick(() => client.emit("response", response));

    return client;
  }

  if (urlObj.protocol === "data:") {
    const response = new EventEmitter();

    response.request = { uri: urlObj };
    response.url = uri.href;

    const client = new EventEmitter();

    let buffer;
    try {
      const parsed = parseDataURL(uri);
      const contentType = parsed.mimeType.toString();
      buffer = parsed.body;
      response.status = 200;
      response.rawHeaders = ["Content-Type", contentType];
      response.headers = { "content-type": contentType };
    } catch (err) {
      process.nextTick(() => client.emit("error", err));
      return client;
    }

    client.abort = () => {
      // do nothing
    };

    process.nextTick(() => {
      client.emit("response", response);
      process.nextTick(() => {
        response.emit("data", buffer);
        client.emit("data", buffer);
        response.emit("end");
        client.emit("end");
      });
    });

    return client;
  }

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

  const crossOrigin = flag.origin !== urlObj.origin;
  if (crossOrigin) {
    requestHeaders.Origin = flag.origin;
  }

  /**
   *
   * @param {EventEmitter&{abort: () => void}} client
   * @param {boolean} sendAuthImmediately - if FALSE, any auth will not added
   * to the request unless the server responsed with a 401 first. This function
   * will automatically retry itself by calling itself with TRUE.
   */
  async function doRequestWithClient(client, sendAuthImmediately) {
    try {
      const headers = { ...requestHeaders };
      const { auth, cookieJar, formData, body: flagBody } = flag;
      if (sendAuthImmediately) {
        let username = "";
        let password = "";
        if (typeof auth === "object") {
          const { user, pass } = auth;
          if (typeof user === "string") {
            username = user;
          }
          if (typeof pass === "string") {
            password = pass;
          }
        }
        headers.Authorization = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
      }
      let targetFetch;
      if (cookieJar && (!crossOrigin || flag.withCredentials)) {
        targetFetch = fetchCookie(fetch, cookieJar);
      } else {
        targetFetch = fetch;
      }

      const hasBody = flagBody !== undefined &&
        flagBody !== null &&
        flagBody !== "" &&
        !(ucMethod === "HEAD" || ucMethod === "GET");

      if (hasBody && getRequestHeader(flag.requestHeaders, "content-type") === null) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
      const fetchOptions = { headers, method, follow: 21, redirect: "follow", agent: getAgent(uri, proxy, strictSSL) };
      if (hasBody) {
        if (formData) {
          const form = new FormData();
          for (const entry of flagBody) {
            form.append(entry.name, entry.value, entry.options);
          }
          fetchOptions.body = form;
          Object.assign(fetchOptions.headers, form.getHeaders());
        } else {
          fetchOptions.body = flagBody;
        }
      }
      const response = await targetFetch(uri, fetchOptions);

      if (!sendAuthImmediately &&
        response.status === 401 &&
        /^Basic /i.test(getResponseHeaders(response)["WWW-Authenticate"] || "")) {
        await closeResponse(response);
        doRequestWithClient(client, true);
      } else {
        /** @warning Abstractlion leak. Instead, make fetch response obj conform to the request module interface */
        client.emit("response", response);

        const readable = getResponseBody(response);

        // const requestClient = request(options);

        // if (hasBody && flag.formData) {
        //   const form = requestClient.form();
        //   for (const entry of body) {
        //     form.append(entry.name, entry.value, entry.options);
        //   }
        // }

        //   const realClient = doRequest();
        //   realClient.on("response", res => client.emit("response", res));

        readable.on("data", chunk => client.emit("data", chunk));
        readable.on("end", () => client.emit("end"));
        readable.on("error", error => {
          // https://github.com/node-fetch/node-fetch/blob/master/README.md#class-aborterror
          // `node-fetch` throws an object with name=AbortError when the request is aborted.
          if (error.name === "AbortError") {
            client.emit("abort");
          } else {
            client.emit("error", error);
          }
        });
        /** @todo detect when redirect happened, response.status > 300
         * if (response.redirected) then emit redirect with response and a request object as arguments
         *   realClient.on("redirect", () => {
         *     client.response = realClient.response;
         *     client.emit("redirect");
         *   });
         */

        // return requestClient;
      }
    } catch (e) {
      process.nextTick(() => client.emit("error", e));
    }
  }

  const client = new EventEmitter();
  const abortController = new AbortController();
  client.abort = () => {
    abortController.abort();
  };

  const nonSimpleHeaders = Object.keys(flag.requestHeaders)
    .filter(header => !simpleHeaders.has(header.toLowerCase()));

  if (crossOrigin && (!simpleMethods.has(ucMethod) || nonSimpleHeaders.length > 0 || properties.uploadListener)) {
    const preflightRequestHeaders = [];
    for (const header in requestHeaders) {
      // the only existing request headers the cors spec allows on the preflight request are Origin and Referrer
      const lcHeader = header.toLowerCase();
      if (lcHeader === "origin" || lcHeader === "referrer") {
        preflightRequestHeaders[header] = requestHeaders[header];
      }
    }

    preflightRequestHeaders["Access-Control-Request-Method"] = method;
    if (nonSimpleHeaders.length > 0) {
      preflightRequestHeaders["Access-Control-Request-Headers"] = nonSimpleHeaders.join(", ");
    }

    preflightRequestHeaders["User-Agent"] = flag.userAgent;

    flag.preflight = true;

    // A unique value representing a stopped preflight body.
    const stop = Symbol("stop");
    fetch(uri, {
      method: "OPTIONS",
      headers: preflightRequestHeaders,
      redirect: "follow",
      agent: getAgent(uri, proxy, strictSSL),
      signal: abortController.signal
    }).then(resp => {
      // don't send the real request if the preflight request returned an error
      if (resp.status < 200 || resp.status > 299) {
        client.emit("error", new Error("Response for preflight has invalid HTTP status code " + resp.status));
        return stop;
      }
      // don't send the real request if we aren't allowed to use the headers
      if (!validCORSPreflightHeaders(xhr, resp, flag, properties)) {
        setResponseToNetworkError(xhr);
        return stop;
      }
      return closeResponse(resp);
    }).then(maybeStop => {
      if (maybeStop !== stop) {
        doRequestWithClient(client, false);
      }
    }).catch(error => {
      client.emit("error", error);
    });
  } else {
    doRequestWithClient(client, false);
  }

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
