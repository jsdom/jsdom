"use strict";
const http = require("http");
const https = require("https");
const { Writable } = require("stream");
const zlib = require("zlib");

const ver = process.version.replace("v", "").split(".");
const majorNodeVersion = Number.parseInt(ver[0]);
const minorNodeVersion = Number.parseInt(ver[1]);

function abortRequest(clientRequest) {
  if (majorNodeVersion > 13 || (majorNodeVersion === 13 && minorNodeVersion > 13)) {
    clientRequest.destroy();
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
function Request(urlObj, options) {
  Writable.call(this);
  this._sanitizeOptions(options);
  this._currentUrl = urlObj.toString();
  this._options = options;
  this.headers = this._options.headers;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];
  this.response = Object.create(null);
  this.response.removeAllListeners = () => {};
  this._performRequest();
}

Request.prototype = Object.create(Writable.prototype);

Request.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
  this.removeAllListeners();
};

Request.prototype.attachListenerToForm = function (form) {
  const self = this;
  form.removeAllListeners();
  form.on("error", err => {
    self.emit("error", err);
    self.abort();
  });
};

Request.prototype.getCookie = function () {
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

Request.prototype.setCookies = function (res) {
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
Request.prototype.write = function (data, encoding) {
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
Request.prototype.end = function () {
  this.emit("request", this._currentRequest);
  this._ended = this._ending = true;
  this._currentRequest.end();
};

// Sets a header value on the current native request
Request.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
Request.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive"
].forEach(method => {
  Request.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(property => {
  Object.defineProperty(Request.prototype, property, {
    get() {
      return this._currentRequest[property];
    }
  });
});

Request.prototype.toJSON = function () {
  const uri = new URL(this._currentUrl);
  const { method, headers } = this._options;
  return { uri, method, headers };
};

Request.prototype._sanitizeOptions = function (options) {
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
Request.prototype._performRequest = function () {
  // Load the native protocol
  const { protocol: scheme } = this._options;
  const nativeProtocol = this._options.nativeProtocols[scheme];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + scheme));
    return;
  }
  if (!(this._options.host || (this._options.hostname && this._options.port))) {
    this.abort();
    this.emit("error", new Error(`Invalid URI: ${this._options.href}`));
    return;
  }
  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  this._options.agent = this._options.agents[scheme.substr(0, scheme.length - 1)];
  const self = this;
  // React to responses of native requests
  function onNative(response) {
    self._processResponse(response);
  }
  const request = nativeProtocol.request(this._options, onNative);
  this._currentRequest = request;
  this.getCookie();
  // Set up event handlers
  request._redirectable = this;
  for (const event in eventHandlers) {
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with Request#end)
  if (this._isRedirect) {
    // Write the request entity and end
    let i = 0;
    const buffers = this._requestBodyBuffers;
    const that = this;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      if (request === that._currentRequest) {
        // Report any write errors
        if (error) {
          that.emit("error", error);
        } else if (i < buffers.length) {
          // Write the next buffer if there are still left
          const buffer = buffers[i++];
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        } else if (that._ended) {
          // End the request if `end` has been called on us
          request.end();
        }
      }
    })();
  }
};

const isUrl = /^https?:/;

Request.prototype._processResponse = function (response) {
  response.request = {};
  response.request.headers = this._options.headers;
  response.request.uri = new URL(this._currentUrl);
  this.response = response;
  this.setCookies(response);
  const { statusCode } = response;
  const { location } = response.headers;
  const catchResErrors = err => {
    if (!(majorNodeVersion === 15 && err.message === "aborted")) {
      this.emit("error", err);
    }
  };
  response.on("error", catchResErrors);
  let redirectAddress = null;
  if (
    typeof location === "string" &&
    location.length &&
    this._options.followRedirects &&
    statusCode >= 300 &&
    statusCode < 400
  ) {
    redirectAddress = location;
  } else if (
    statusCode === 401 &&
    /^Basic /i.test(response.headers["www-authenticate"] || "") &&
    (this._options.user && this._options.user.length)
  ) {
    const { user, pass } = this._options;
    this._options.auth = `${user}:${pass}`;
    redirectAddress = 1;
  }
  if (redirectAddress) {
    if (++this._redirectCount > 21) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }
    abortRequest(this._currentRequest);
    response.destroy();
    this._isRedirect = true;
    if (
      ((statusCode === 301 || statusCode === 302) && this._options.method === "POST") ||
      (statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method))
    ) {
      this._options.method = "GET";
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }
    let previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers);
    if (!previousHostName) {
      previousHostName = new URL(this._currentUrl).hostname;
    }
    const previousURI = this._currentUrl;
    if (redirectAddress !== 1) {
      const nextURL = !isUrl.test(redirectAddress) ?
        new URL(redirectAddress, this._currentUrl) :
        new URL(redirectAddress);
      // Drop the Authorization header if redirecting to another host
      if (nextURL.hostname !== previousHostName) {
        removeMatchingHeaders(/^authorization$/i, this._options.headers);
      }
      this._currentUrl = nextURL.toString();
      Object.assign(this._options, urlToOptions(nextURL));
    }
    this._options.headers.Referer = previousURI;
    this.response.request.uri = new URL(this._currentUrl);
    this.emit("redirect");
    this._sanitizeOptions(this._options);
    try {
      this._performRequest();
    } catch (cause) {
      const error = new RedirectionError("Redirected request failed: " + cause.message);
      error.cause = cause;
      this.emit("error", error);
    }
  } else {
    const isCompressed = this._options.headers["Accept-Encoding"] === "gzip, deflate";
    const self = this;
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
    pipeline.removeAllListeners("error");
    this.emit("response", response);
    pipeline.on("data", bytes => this.emit("data", bytes));
    pipeline.once("end", bytes => this.emit("end", bytes));
    pipeline.on("error", catchResErrors);
    pipeline.on("close", () => this.emit("close"));
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
      value: (urlObj, options) => new Request(
        urlObj,
        Object.assign(urlToOptions(urlObj), options, { nativeProtocols })
      ),
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
