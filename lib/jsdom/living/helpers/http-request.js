"use strict";
const http = require("http");
const https = require("https");
const { Writable } = require("stream");
const { format } = require("url");
const zlib = require("zlib");

const ver = process.version.replace("v", "").split(".");
const majorNodeVersion = Number.parseInt(ver[0]);
const minorNodeVersion = Number.parseInt(ver[1]);

function abortRequest(clientRequest) {
  if (majorNodeVersion > 13 || (majorNodeVersion === 13 && minorNodeVersion > 13)) {
    clientRequest.destroy();
    clientRequest.aborted = clientRequest.destroyed;
  } else {
    clientRequest.abort();
  }
  clientRequest.removeAllListeners();
  clientRequest.on("error", noop);
}

// Create handlers that pass events from native requests
const eventHandlers = Object.create(null);
["connect", "error", "socket", "timeout"].forEach(event => {
  eventHandlers[event] = function (...args) {
    this._redirectable.emit(event, ...args);
  };
});

function createErrorType(code, defaultMessage) {
  function CustomError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message || defaultMessage;
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

// Error types with codes
const RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  ""
);

const TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);

const WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP/HTTPS request that can be redirected
function RedirectableRequest(options) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._sendingAuth = false;
  this._redirectCount = 0;
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];
  this.response = Object.create(null);

  // React to responses of native requests
  const self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };
  // Perform the first request
  this._performRequest();
}

RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  try {
    abortRequest(this._currentRequest);
  } catch { /* ignore errors */ }
  this.emit("abort");
  this.removeAllListeners();
};

RedirectableRequest.prototype.attachListenerToForm = function (form) {
  const self = this;
  form.removeAllListeners();
  form.on("error", err => {
    // err.message = `FormData Error: ${err.message}`;
    self.emit("error", err);
    self.abort();
  });
};

RedirectableRequest.prototype.getCookie = function () {
  let cookies;
  if (this._redirectCount === 0) {
    this.originalCookieHeader = this.getHeader("Cookie");
  }
  const jar = this._options.cookieJar;
  if (jar && typeof jar.getCookieStringSync === "function") {
    cookies = jar.getCookieStringSync(this._options.href);
  } else {
    this._areCookiesDisabled = true;
  }

  // if need cookie and cookie is not empty
  if (cookies && cookies.length) {
    if (this.originalCookieHeader) {
      // Do not overwrite existing Cookie header
      this.setHeader("Cookie", this.originalCookieHeader + "; " + cookies);
    } else {
      this.setHeader("Cookie", cookies);
    }
  }
};

RedirectableRequest.prototype.setCookies = function (res) {
  const self = this;
  const jar = self._options.cookieJar;
  const cookies = res.headers["set-cookie"];
  if (!this._areCookiesDisabled && jar && typeof jar.setCookieSync === "function" && Array.isArray(cookies)) {
    try {
      cookies.forEach(cookie => jar.setCookieSync(cookie, self._currentUrl, { ignoreError: true }));
    } catch (e) {
      this.emit("error", e);
    }
  }
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || (typeof data === "object" && ("length" in data)))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }

  if (data.length > 0) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data, encoding });
    this._currentRequest.write(data, encoding);
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function () {
  this._ended = this._ending = true;
  this._currentRequest.end();
  this.emit("request", this._currentRequest);
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive"
].forEach(method => {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(property => {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get() {
      return this._currentRequest[property];
    }
  });
});

RedirectableRequest.prototype.toJSON = function () {
  const uri = new URL(this._currentUrl);
  const { method, headers } = this._options;
  return { uri, method, headers };
};

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present

  // Since http.clientRequest treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    const searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    } else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  const self = this;
  // Load the native protocol
  const { protocol } = this._options;
  const nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }
  if (!(this._options.host || (this._options.hostname && this._options.port))) {
    this.abort();
    this.emit("error", new Error(`Invalid URI: ${this._currentUrl}`));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    const scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  if (this._isRedirect) {
    this._options.headers.Referer = this._options.href;
  }
  this._currentUrl = format(this._options);
  const origin = new URL(this._currentUrl).searchParams.get("origin");
  if (origin) {
    this._options.headers.Origin = origin;
  }
  const request = nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentRequest = request;
  this.getCookie();
  if (this._sendingAuth) {
    const { user, pass } = this._options;
    const authString = `${user}:${pass}`;
    this.setHeader(
      "Authorization",
      `Basic ${Buffer.from(authString, "utf8").toString("base64")}`
    );
  }
  // Set up event handlers
  request._redirectable = this;
  for (const event in eventHandlers) {
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }
  this.response.request = {};
  this.response.request.headers = this._options.headers;
  this.response.request.uri = new URL(this._options.href);

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    this.emit("redirect");
    // Write the request entity and end.
    let i = 0;
    const buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      if (request === self._currentRequest) {
        // Report any write errors
        if (error) {
          self.emit("error", error);
        } else if (i < buffers.length) {
          // Write the next buffer if there are still left
          const buffer = buffers[i++];
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        } else if (self._ended) {
          // End the request if `end` has been called on us
          request.end();
        }
      }
    })();
  }
};

// get internal request headers
RedirectableRequest.prototype._getRequestHeaders = function () {};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  Object.assign(this.response, response);
  response.request = {};
  response.request.headers = this._options.headers;
  response.request.uri = new URL(this._options.href);
  this.setCookies(response);
  const { statusCode } = response;

  const self = this;
  function newRequest() {
    // Perform the redirected request
    try {
      self._performRequest();
    } catch (cause) {
      const error = new RedirectionError("Redirected request failed: " + cause.message);
      error.cause = cause;
      self.emit("error", error);
    }
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  const { location } = response.headers;
  if (location && this._options.followRedirects && statusCode >= 300 && statusCode < 400) {
    // Abort the current request
    abortRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    // response.destroy();
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > 21) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    if (((statusCode === 301 || statusCode === 302) && this._options.method === "POST") ||
      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      (statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method))) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    let previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers);
    if (!previousHostName) {
      previousHostName = new URL(this._currentUrl).hostname;
    }

    // Create the redirected request
    /** @todo Correct redirect Url Parsing  */
    const redirectUrlParts = new URL(location, this._currentUrl);
    Object.assign(this._options, urlToOptions(redirectUrlParts));

    // Drop the Authorization header if redirecting to another host
    if (redirectUrlParts.hostname !== previousHostName) {
      removeMatchingHeaders(/^authorization$/i, this._options.headers);
    }
    this._sanitizeOptions(this._options);
    this._isRedirect = true;
    this._sendingAuth = false;
    newRequest();
  } else if (statusCode === 401 && /^Basic /i.test(response.headers["www-authenticate"] || "")) {
    abortRequest(this._currentRequest);
    // response.destroy();
    if (++this._redirectCount > 21) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }
    this._isRedirect = true;
    this._sendingAuth = true;
    newRequest();
  } else {
    const isCompressed = self._options.headers["Accept-Encoding"] === "gzip, deflate";
    function hasBody(code) {
      const isHead = self._options.method === "HEAD";
      const isInformational = code >= 100 && code < 200;
      const hasNoContent = code === 204;
      const isNotModified = code === 304;
      return !(isHead || isInformational || hasNoContent || isNotModified);
    }
    let pipeline = response;
    if (isCompressed && hasBody(statusCode)) {
      const zlibOptions = {
        flush: zlib.constants.Z_SYNC_FLUSH,
        finishFlush: zlib.constants.Z_SYNC_FLUSH
      };
      const contentEncoding = (response.headers["content-encoding"] || "identity").trim().toLowerCase();
      if (contentEncoding === "gzip") {
        pipeline = zlib.createGunzip(zlibOptions);
        pipeline.request = response.request;
        response.pipe(pipeline);
      } else if (contentEncoding === "deflate") {
        pipeline = zlib.createInflate(zlibOptions);
        pipeline.request = response.request;
        response.pipe(pipeline);
      }
    }
    this.emit("response", response);
    pipeline.on("data", bytes => this.emit("data", bytes));
    pipeline.once("end", bytes => this.emit("end", bytes));
    pipeline.on("error", err => {
      this.emit("error", err);
    });
    pipeline.on("close", () => this.emit("close"));

    // Clean up
    this._requestBodyBuffers = [];
  }
};

function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  const { protocol, hash, search, href, pathname } = urlObject;
  const hostname = urlObject.hostname.startsWith("[") ?
    urlObject.hostname.slice(1, -1) :
    urlObject.hostname;
  const options = {
    protocol,
    hostname,
    hash,
    search,
    pathname,
    path: `${pathname}${search}`,
    href
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  let lastValue;
  for (const header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return lastValue;
}

const httpModules = Object.create(null);
const nativeProtocols = {};
[["http:", http], ["https:", https]].forEach(([scheme, protocol]) => {
  const nativeProtocol = nativeProtocols[scheme] = protocol;
  httpModules[scheme] = Object.create(nativeProtocol);
  Object.defineProperties(httpModules[scheme], {
    request: {
      value: (urlObj, options) => {
        const reqOpts = Object.assign(Object.create(null), urlToOptions(urlObj), options);
        reqOpts.nativeProtocols = nativeProtocols;
        return new RedirectableRequest(reqOpts);
      },
      configurable: true,
      enumerable: true,
      writable: true
    }
  });
});

module.exports = function getRequest(uri, rejectUnauthorized) {
  const isHttps = uri.substr(0, 6) === "https:";
  if (isHttps) {
    return (urlObj, options) => httpModules["https:"].request(urlObj, { ...options, rejectUnauthorized });
  }
  return httpModules["http:"].request;
};
