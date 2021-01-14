"use strict";

const http = require("http");
const https = require("https");
const url = require("url");
const util = require("util");
const EventEmitter = require("events");
const zlib = require("zlib");
const querystring = require("querystring");
const FormData = require("form-data");
const caseless = require("caseless");
const RequestJar = require("./RequestJar");
const Auth = require("./auth");
const Redirect = require("./redirect");
const Tunnel = require("./tunnel");
const toBase64 = require("./toBase64");

const globalCookieJar = new RequestJar();
const globalPool = {};

function unescapeString(item) {
  return querystring.unescape(item);
}

function filterForNonReserved(reserved, options) {
  // Filter out properties that are not reserved.
  // Reserved values are passed in at call site.
  const object = {};
  for (const key in options) {
    if (reserved.indexOf(key) === -1) {
      object[key] = options[key];
    }
  }
  return object;
}

function filterOutReservedFunctions(reserved, options) {
  // Filter out properties that are functions and are reserved.
  // Reserved values are passed in at call site.
  const object = {};
  for (const i in options) {
    if (reserved.indexOf(i) === -1 || typeof options[i] !== "function") {
      object[i] = options[i];
    }
  }
  return object;
}

function Request(options) {
  // Assign any non-reserved properties to the Request instance
  // remove any reserved functions from the options object
  // call init
  const self = this;
  EventEmitter.call(self);
  const reserved = Object.keys(Request.prototype);
  Object.assign(self, filterForNonReserved(reserved, options));
  self._auth = new Auth(self);
  self._redirect = new Redirect(self);
  self._tunnel = new Tunnel(self);
  self.init(filterOutReservedFunctions(reserved, options));
}

util.inherits(Request, EventEmitter);

Request.prototype.init = function (options) {
  // init() contains all the code to setup the request object.
  // the actual outgoing request is not started until start() is called
  // this function is called from both the constructor and on redirect.
  const self = this;

  caseless.httpify(self, self.headers);

  self.localAddress = options.localAddress;

  self.pool = globalPool;
  self.dests = self.dests || [];
  self.__isRequestRequest = true;
  self.uri = url.parse(self.uri); // options.uri is always a string

  self.tunnel = self._tunnel.isEnabled();
  if (self.proxy) {
    self._tunnel.setup(options);
  }

  self._redirect.onRequest(options);

  self.setHost = false;
  if (!self.hasHeader("host")) {
    self.setHeader(
      self.originalHostHeaderName || "host",
      self.uri.host
    );
    self.setHost = true;
  }

  self.jar(self._jar || options.jar);

  if (self.proxy && !self.tunnel) {
    self.port = self.proxy.port;
    self.host = self.proxy.hostname;
  } else {
    self.port = self.uri.port;
    self.host = self.uri.hostname;
  }

  self.path = self.uri.path;

  if (options.auth) {
    self.auth(
      options.auth.user,
      options.auth.pass,
      options.auth.sendImmediately
    );
  }

  if (self.gzip && !self.hasHeader("accept-encoding")) {
    self.setHeader("accept-encoding", "gzip, deflate");
  }

  if (self.uri.auth && !self.hasHeader("authorization")) {
    const uriAuthPieces = self.uri.auth.split(":").map(unescapeString);
    self.auth(uriAuthPieces[0], uriAuthPieces.slice(1).join(":"), true);
  }

  if (!self.tunnel && self.proxy && self.proxy.auth && !self.hasHeader("proxy-authorization")) {
    const proxyAuthPieces = self.proxy.auth.split(":").map(unescapeString);
    const authHeader = "Basic " + toBase64(proxyAuthPieces.join(":"));
    self.setHeader("proxy-authorization", authHeader);
  }

  if (self.proxy && !self.tunnel) {
    self.path = self.uri.protocol + "//" + self.uri.host + self.path;
  }
  const protocol = self.proxy && !self.tunnel ? self.proxy.protocol : self.uri.protocol;

  self.httpModule = protocol === "https:" ? https : http;

  if (options.forever) {
    self.agentClass = self.httpModule.Agent;
    self.agentOptions = self.agentOptions || {};
    self.agentOptions.keepAlive = true;
  }

  self.agent = self.getNewAgent();

  setImmediate(() => {
    if (!self._aborted) {
      /* eslint-disable func-style */
      const endCallback = function () {
        if (self._form) {
          if (!self._auth.hasAuth || (self._auth.hasAuth && self._auth.sentAuth)) {
            self._form.pipe(self);
          }
        }
        if (!self.src) {
          if (self._auth.hasAuth && !self._auth.sentAuth) {
            self.end();
          } else {
            if (self.method !== "GET" && typeof self.method !== "undefined") {
              self.setHeader("content-length", 0);
            }
            self.end();
          }
        }
      };
      /* eslint-enable func-style */
      if (self._form && !self.hasHeader("content-length")) {
        // Before ending the request, we had to compute the length of the whole form, asynchronously
        self.setHeader(self._form.getHeaders(), true);
        self._form.getLength((err, length) => {
          if (!err && !Number.isNaN(length)) {
            self.setHeader("content-length", length);
          }
          endCallback();
        });
      }
      endCallback();
      self.ntick = true;
    }
  });
};

Request.prototype.getNewAgent = function () {
  const self = this;
  const Agent = self.agentClass;
  const theOptions = {};
  if (self.agentOptions) {
    for (const i in self.agentOptions) {
      theOptions[i] = self.agentOptions[i];
    }
  }

  let poolKey = "";

  // ca option is only relevant if proxy or destination are https
  const { proxy } = self;
  const isHttps = (proxy && proxy.protocol === "https:") || this.uri.protocol === "https:";

  if (isHttps) {
    if (theOptions.ca) {
      if (poolKey) {
        poolKey += ":";
      }
      poolKey += theOptions.ca;
    }

    if (typeof theOptions.rejectUnauthorized !== "undefined") {
      if (poolKey) {
        poolKey += ":";
      }
      poolKey += theOptions.rejectUnauthorized;
    }

    if (theOptions.cert) {
      if (poolKey) {
        poolKey += ":";
      }
      poolKey += theOptions.cert.toString("ascii") + theOptions.key.toString("ascii");
    }

    if (theOptions.pfx) {
      if (poolKey) {
        poolKey += ":";
      }
      poolKey += theOptions.pfx.toString("ascii");
    }

    if (theOptions.ciphers) {
      if (poolKey) {
        poolKey += ":";
      }
      poolKey += theOptions.ciphers;
    }

    if (theOptions.secureProtocol) {
      if (poolKey) {
        poolKey += ":";
      }
      poolKey += theOptions.secureProtocol;
    }

    if (theOptions.secureOptions) {
      if (poolKey) {
        poolKey += ":";
      }
      poolKey += theOptions.secureOptions;
    }
  }

  // we"re using a stored agent.  Make sure it"s protocol-specific
  poolKey = self.uri.protocol + poolKey;

  // generate a new agent for this setting if none yet exists
  if (!self.pool[poolKey]) {
    self.pool[poolKey] = new Agent(theOptions);
    // properly set maxSockets on new agents
    if (self.pool.maxSockets) {
      self.pool[poolKey].maxSockets = self.pool.maxSockets;
    }
  }

  return self.pool[poolKey];
};

Request.prototype.start = function () {
  // start() is called once we are ready to send the outgoing HTTP request.
  // this is usually called on the first write(), end() or on nextTick()
  const self = this;
  if (!self._aborted) {
    self._started = true;
    self.method = self.method || "GET";
    self.href = self.uri.href;
    const { agent, headers, host, localAddress, method, path, port } = self;
    try {
      self.req = self.httpModule.request({ agent, headers, host, localAddress, method, path, port });
      self.req.on("response", self.onRequestResponse.bind(self));
      self.req.on("error", self.onRequestError.bind(self));
      self.req.on("socket", socket => {
        self.emit("socket", socket);
      });
      self.emit("request", self.req);
    } catch (err) {
      self.emit("error", err);
    }
  }
};

Request.prototype.onRequestError = function (error) {
  const self = this;
  if (!self._aborted) {
    if (self.req && self.req._reusedSocket && error.code === "ECONNRESET" && self.agent.addRequestNoreuse) {
      self.agent = {
        addRequest: self.agent.addRequestNoreuse.bind(self.agent)
      };
      self.start();
      self.req.end();
    } else {
      self.clearTimeout();
      self.emit("error", error);
    }
  }
};

Request.prototype.onRequestResponse = function (response) {
  const self = this;
  if (self._aborted) {
    response.resume();
  } else {
    self.response = response;
    response.request = self;

    // Save the original host before any redirect (if it changes, we need to
    // remove any authorization headers).  Also remember the case of the header
    // name because lots of broken servers expect Host instead of host and we
    // want the caller to be able to specify this.
    self.originalHost = self.getHeader("host");
    if (!self.originalHostHeaderName) {
      self.originalHostHeaderName = self.hasHeader("host");
    }
    if (self.setHost) {
      self.removeHeader("host");
    }
    self.clearTimeout();

    const targetCookieJar = self._jar && self._jar.setCookie ? self._jar : globalCookieJar;
    /* eslint-disable func-style */
    const addCookie = function (cookie) {
      // set the cookie if its domain is in the href's domain.
      try {
        targetCookieJar.setCookie(cookie, self.uri.href, { ignoreError: true });
      } catch (e) {
        self.emit("error", e);
      }
    };
    response.caseless = caseless(response.headers);
    /* eslint-enable func-style */
    if (response.caseless.has("set-cookie") && !self._disableCookies) {
      const setCookie = response.caseless.get("set-cookie");
      if (Array.isArray(setCookie)) {
        setCookie.forEach(addCookie);
      } else {
        addCookie(setCookie);
      }
    }
    if (!self._redirect.onResponse(response)) {
      // Be a good stream and emit end when the response is finished.
      response.on("close", () => {
        // Hack to emit end on close because of a core bug that never fires end
        if (!self._ended) {
          self.response.emit("end");
        }
      });
      response.once("end", () => {
        self._ended = true;
      });
      const code = response.statusCode;
      let responseContent;
      if (self.gzip && !(
        self.method === "HEAD" ||
        // Informational
        (code >= 100 && code < 200) ||
        // No Content
        code === 204 ||
        // Not Modified
        code === 304
      )) {
        let contentEncoding = response.headers["content-encoding"] || "identity";
        contentEncoding = contentEncoding.trim().toLowerCase();
        // Be more lenient with decoding compressed responses, since (very rarely)
        // servers send slightly invalid gzip responses that are still accepted
        // by common browsers.
        // Always using Z_SYNC_FLUSH is what cURL does.
        const zlibOptions = {
          flush: zlib.Z_SYNC_FLUSH,
          finishFlush: zlib.Z_SYNC_FLUSH
        };
        if (contentEncoding === "gzip") {
          responseContent = zlib.createGunzip(zlibOptions);
          response.pipe(responseContent);
        } else if (contentEncoding === "deflate") {
          responseContent = zlib.createInflate(zlibOptions);
          response.pipe(responseContent);
        } else {
          // Since previous versions didn"t check for Content-Encoding header,
          // ignore any invalid values to preserve backwards-compatibility
          responseContent = response;
        }
      }
      self.responseContent = responseContent;
      self.emit("response", response);
      responseContent.on("data", chunk => {
        self._destdata = true;
        self.emit("data", chunk);
      });
      responseContent.once("end", chunk => {
        self.emit("end", chunk);
      });
      responseContent.on("error", error => {
        self.emit("error", error);
      });
      responseContent.on("close", () => {
        self.emit("close");
      });

      if (self.callback) {
        self.readResponseBody(response);
      } else {
        self.on("end", () => {
          if (!self._aborted) {
            self.emit("complete", response);
          }
        });
      }
    }
  }
};


Request.prototype.readResponseBody = function (response) {
  const self = this;
  let buffers = [];
  let bufferLength = 0;
  const strings = [];

  self.on("data", chunk => {
    if (!Buffer.isBuffer(chunk)) {
      strings.push(chunk);
    } else if (chunk.length) {
      bufferLength += chunk.length;
      buffers.push(chunk);
    }
  });
  self.on("end", () => {
    if (!self._aborted) {
      if (bufferLength) {
        response.body = Buffer.concat(buffers, bufferLength);
        if (self.encoding !== null) {
          response.body = response.body.toString(self.encoding);
        }
        // `buffer` is defined in the parent scope and used in a closure it exists for the life of the Request.
        // This can lead to leaky behavior if the user retains a reference to the request object.
        buffers = [];
        bufferLength = 0;
      } else if (strings.length) {
        // The UTF8 BOM [0xEF,0xBB,0xBF] is converted to [0xFE,0xFF] in the JS UTC16/UCS2 representation.
        // Strip this value out when the encoding is set to 'utf8', as upstream consumers won't
        // expect it and it breaks JSON.parse().
        if (self.encoding === "utf8" && strings[0].length > 0 && strings[0][0] === "\uFEFF") {
          strings[0] = strings[0].substring(1);
        }
        response.body = strings.join("");
      }
      if (self._json) {
        try {
          response.body = JSON.parse(response.body, self._jsonReviver);
        } catch (e) {
          /** @warning empty block */
        }
      }
      if (typeof response.body === "undefined" && !self._json) {
        response.body = self.encoding === null ? Buffer.alloc(0) : "";
      }
      self.emit("complete", response, response.body);
    } else {
      // `buffer` is defined in the parent scope and used in a closure it exists for the life of the request.
      // This can lead to leaky behavior if the user retains a reference to the request object.
      buffers = [];
      bufferLength = 0;
    }
  });
};

Request.prototype.abort = function () {
  const self = this;
  self._aborted = true;
  if (self.req && typeof self.req.destroy === "function") {
    self.req.destroy();
  } else if (self.response && typeof self.response.destroy === "function") {
    self.response.destroy();
  }
  self.clearTimeout();
  self.emit("abort");
};

Request.prototype.form = function () {
  const self = this;
  // create form-data object
  self._form = new FormData();
  self._form.on("error", err => {
    err.message = "form-data: " + err.message;
    self.emit("error", err);
    self.abort();
  });
  return self._form;
};

Request.prototype.getHeader = function (name, headers) {
  const self = this;
  let result;
  if (!headers) {
    headers = self.headers;
  }
  Object.keys(headers).forEach(key => {
    if (key.length !== name.length) {
      return;
    }
    if (key.match(new RegExp(name, "i"))) {
      result = headers[key];
    }
  });
  return result;
};

Request.prototype.auth = function (user, pass, sendImmediately) {
  const self = this;
  self._auth.onRequest(user, pass, sendImmediately);
  return self;
};

Request.prototype.jar = function (jar) {
  const self = this;
  let cookies;

  if (self._redirect.redirectsFollowed === 0) {
    self.originalCookieHeader = self.getHeader("cookie");
  }

  if (!jar) {
    // disable cookies
    cookies = false;
    self._disableCookies = true;
  } else {
    const targetCookieJar = jar.getCookieString ? jar : globalCookieJar;
    const urihref = self.uri.href;
    // fetch cookie in the Specified host
    if (targetCookieJar) {
      cookies = targetCookieJar.getCookieString(urihref);
    }
  }

  // if need cookie and cookie is not empty
  if (cookies && cookies.length) {
    if (self.originalCookieHeader) {
      // Don"t overwrite existing Cookie header
      self.setHeader("cookie", self.originalCookieHeader + "; " + cookies);
    } else {
      self.setHeader("cookie", cookies);
    }
  }
  self._jar = jar;
  return self;
};

Request.prototype.write = function (...args) {
  const self = this;
  if (!self._aborted) {
    if (!self._started) {
      self.start();
    }
    if (self.req) {
      // self.req.write.apply(self.req, ...args)
      return self.req.write(...args);
    }
  }
  return undefined;
};

Request.prototype.end = function () {
  const self = this;
  if (!self._aborted) {
    if (!self._started) {
      self.start();
    }
    if (self.req && typeof self.req.end === "function") {
      self.req.end();
    }
  }
};

Request.prototype.clearTimeout = function () {
  if (this.timeoutTimer) {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = null;
  }
};

Request.prototype.then = function (onfulfilled, onrejected) {
  /** @todo When then is called on the object, the promise should be resolved or caught */
};

Request.prototype.catch = function (onrejected) {
  /** @todo When catch is called on the request object, the promise should be rejected */
  this.then(undefined, onrejected);
};

Request.defaultProxyHeaderWhiteList =
  Tunnel.defaultProxyHeaderWhiteList.slice();

Request.defaultProxyHeaderExclusiveList =
  Tunnel.defaultProxyHeaderExclusiveList.slice();

module.exports = Request;
