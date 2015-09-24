"use strict";

var HTTP_STATUS_CODES = require("http").STATUS_CODES;
var deasync;
try {
  deasync = require("deasync");
} catch (e) {
  // deasync is not usable with browserify
  deasync = null;
}

var jsdom = require("../../../jsdom");
var core = require("../../level1/core");
require("../../level2/core");
require("../../level2/events");
var Event = core.Event;
var ProgressEvent = core.ProgressEvent;
var Blob = require("../file/blob");
var XMLHttpRequestEventTarget = require("./xmlhttprequesteventtarget");
var utils = require("./utils");
var DOMException = require("../../web-idl/DOMException");

var forbiddenRequestHeaders = new RegExp("^(?:" + [
  "Accept-Charset",
  "Accept-Encoding",
  "Access-Control-Request-Headers",
  "Access-Control-Request-Method",
  "Connection",
  "Content-Length",
  "Cookie",
  "Cookie2",
  "Date",
  "DNT",
  "Expect",
  "Host",
  "Keep-Alive",
  "Origin",
  "Referer",
  "TE",
  "Trailer",
  "Transfer-Encoding",
  "Upgrade",
  "User-Agent",
  "Via",
  "Sec-.*",
  "Proxy-.*"
].join("|") + ")$", "i");
var uniqueResponseHeaders = new RegExp("^(?:" + [
  "content-type",
  "content-length",
  "user-agent",
  "referer",
  "host",
  "authorization",
  "proxy-authorization",
  "if-modified-since",
  "if-unmodified-since",
  "from",
  "location",
  "max-forwards"
].join("|") + ")$", "i");

var allowedRequestMethods = ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE"];
var forbiddenRequestMethods = ["TRACK", "TRACE", "CONNECT"];

var tokenRegexp = /^(?:(?![\x00-\x1F\x7F \t\(\)<>@,;:\\"\/\[\]?={}])[\x00-\x7F])+$/;
var fieldValueRegexp = /^(?:(?![\x00-\x1F\x7F])[\x00-\xFF])*$/;

function createXMLHttpRequest(options) {
  function XMLHttpRequest() {
    if (!(this instanceof XMLHttpRequest)) {
      throw new TypeError("DOM object constructor cannot be called as a function.");
    }
    XMLHttpRequestEventTarget.call(this);
    Object.defineProperties(this, {
      upload: {
        configurable: true,
        enumerable: true,
        value: new XMLHttpRequestUpload(),
        writable: false
      },
      _properties: {
        configurable: false,
        enumerable: false,
        value: Object.create(Object.prototype, {
          auth: {
            configurable: false,
            enumerable: true,
            value: "",
            writable: true
          },
          client: {
            configurable: false,
            enumerable: true,
            value: null,
            writable: true
          },
          method: {
            configurable: false,
            enumerable: true,
            value: undefined,
            writable: true
          },
          responseHeaders: {
            configurable: false,
            enumerable: true,
            value: {},
            writable: true
          },
          responseBuffer: {
            configurable: false,
            enumerable: true,
            value: null,
            writable: true
          },
          responseCache: {
            configurable: false,
            enumerable: true,
            value: null,
            writable: true
          },
          responseTextCache: {
            configurable: false,
            enumerable: true,
            value: null,
            writable: true
          },
          responseXMLCache: {
            configurable: false,
            enumerable: true,
            value: null,
            writable: true
          },
          responseType: {
            configurable: false,
            enumerable: true,
            value: "",
            writable: true
          },
          requestHeaders: {
            configurable: false,
            enumerable: true,
            value: {},
            writable: true
          },
          uri: {
            configurable: true,
            enumerable: true,
            value: "",
            writable: true
          },
          options: {
            configurable: true,
            enumerable: true,
            value: options,
            writable: true
          }
        }),
        writable: false
      }
    });
  }

  XMLHttpRequest.prototype = Object.create(XMLHttpRequestEventTarget.prototype);

  var XMLHttpRequestResponseType = [
    "",
    "arraybuffer",
    "blob",
    "document",
    "json",
    "text"
  ];

  (function (proto) {
    var constants = {
      UNSENT: {
        configurable: false,
        enumerable: true,
        value: 0,
        writable: false
      },
      OPENED: {
        configurable: false,
        enumerable: true,
        value: 1,
        writable: false
      },
      HEADERS_RECEIVED: {
        configurable: false,
        enumerable: true,
        value: 2,
        writable: false
      },
      LOADING: {
        configurable: false,
        enumerable: true,
        value: 3,
        writable: false
      },
      DONE: {
        configurable: false,
        enumerable: true,
        value: 4,
        writable: false
      }
    };

    Object.defineProperties(XMLHttpRequest, constants);
    Object.defineProperties(proto, constants);

    Object.defineProperties(proto, {
      _flag: {
        configurable: false,
        enumerable: false,
        get: function getter() {
          var flag = Object.create(Object.prototype, {
            synchronous: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            uploadComplete: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            uploadEvents: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            withCredentials: {
              configurable: true,
              enumerable: true,
              value: false,
              writable: true
            },
            send: {
              configurable: true,
              enumerable: true,
              value: false,
              writable: true
            },
            timeout: {
              configurable: true,
              enumerable: true,
              value: 0,
              writable: true
            },
            timeoutStart: {
              configurable: true,
              enumerable: true,
              value: 0,
              writable: true
            },
            timeoutId: {
              configurable: true,
              enumerable: true,
              value: 0,
              writable: true
            },
            timeoutFn: {
              configurable: true,
              enumerable: true,
              value: null,
              writable: true
            },
            mimeType: {
              configurable: true,
              enumerable: true,
              value: null,
              writable: true
            }
          });
          Object.defineProperty(this, "_flag", {
            configurable: false,
            enumerable: false,
            value: flag,
            writable: false
          });
          return flag;
        }
      },
      _ownerDocument: {
        configurable: true,
        enumerable: true,
        get: function () {
          return options.window.document;
        }
      },
      readyState: {
        configurable: true,
        enumerable: true,
        value: XMLHttpRequest.UNSENT,
        writable: false
      },
      responseType: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          var responseType = this._properties.responseType;
          return responseType;
        },
        set: function setter(responseType) {
          if (this.readyState === XMLHttpRequest.LOADING || this.readyState === XMLHttpRequest.DONE) {
            throw new DOMException(DOMException.INVALID_STATE_ERR);
          }
          if (this.readyState === XMLHttpRequest.OPENED && this._flag.synchronous) {
            throw new DOMException(DOMException.INVALID_ACCESS_ERR);
          }
          if (XMLHttpRequestResponseType.indexOf(responseType) === -1) {
            responseType = "";
          }
          this._properties.responseType = responseType;
        }
      },
      response: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          if (this._properties.responseCache) {
            return this._properties.responseCache;
          }
          var res = "";
          switch (this.responseType) {
            case "":
            case "text":
              res = this.responseText;
              break;
            case "arraybuffer":
              if (!this._properties.responseBuffer) {
                return null;
              }
              res = (new Uint8Array(this._properties.responseBuffer)).buffer;
              break;
            case "blob":
              if (!this._properties.responseBuffer) {
                return null;
              }
              res = new Blob([(new Uint8Array(this._properties.responseBuffer)).buffer]);
              break;
            case "document":
              res = this.responseXML;
              break;
            case "json":
              if (this.readyState !== XMLHttpRequest.DONE || !this._properties.responseBuffer) {
                res = null;
              }
              try {
                res = JSON.parse(this._properties.responseBuffer.toString());
              } catch (e) {
                res = null;
              }
              break;
          }
          this._properties.responseCache = res;
          return res;
        }
      },
      responseText: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          if (this.responseType !== "" && this.responseType !== "text") {
            throw new DOMException(DOMException.INVALID_STATE_ERR);
          }
          if (this.readyState !== XMLHttpRequest.LOADING && this.readyState !== XMLHttpRequest.DONE) {
            return "";
          }
          if (this._properties.responseTextCache) {
            return this._properties.responseTextCache;
          }
          var responseBuffer = this._properties.responseBuffer;
          if (!responseBuffer) {
            return "";
          }
          var res = responseBuffer.toString();
          this._properties.responseTextCache = res;
          return res;
        }
      },
      responseXML: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          if (this.responseType !== "" && this.responseType !== "document") {
            throw new DOMException(DOMException.INVALID_STATE_ERR);
          }
          if (this.readyState !== XMLHttpRequest.DONE) {
            return null;
          }
          if (this._properties.responseXMLCache) {
            return this._properties.responseXMLCache;
          }
          var contentType = this._flag.mimeType || this.getResponseHeader("Content-Type");
          if (contentType && !contentType.match(/^(?:text\/html|text\/xml|application\/xml|.*?\+xml)(?:;.*)*$/)) {
            return null;
          }
          var responseBuffer = this._properties.responseBuffer;
          if (!responseBuffer) {
            return null;
          }
          var resText = responseBuffer.toString();
          var res = jsdom.jsdom(resText, { parsingMode: "xml" });
          this._properties.responseXMLCache = res;
          return res;
        }
      },
      status: {
        configurable: true,
        enumerable: true,
        value: 0,
        writable: false
      },
      statusText: {
        configurable: true,
        enumerable: true,
        value: "",
        writable: false
      },
      timeout: {
        configurable: true,
        enumerable: true,
        get: function () {
          return this._flag.timeout;
        },
        set: function (val) {
          if (this._flag.synchronous) {
            throw new DOMException(DOMException.INVALID_ACCESS_ERR);
          }
          this._flag.timeout = val;
          clearTimeout(this._flag.timeoutId);
          if (val > 0 && this._flag.timeoutFn) {
            this._flag.timeoutId = setTimeout(
              this._flag.timeoutFn,
              Math.max(0, val - ((new Date()).getTime() - this._flag.timeoutStart))
            );
          } else {
            this._flag.timeoutFn = null;
            this._flag.timeoutStart = 0;
          }
        }
      },
      upload: {
        configurable: true,
        enumerable: true,
        value: null,
        writable: false
      },
      withCredentials: {
        configurable: true,
        enumerable: true,
        get: function () {
          return this._flag.withCredentials;
        },
        set: function (val) {
          if (!(this.readyState === XMLHttpRequest.UNSENT || this.readyState === XMLHttpRequest.OPENED)) {
            throw new DOMException(DOMException.INVALID_STATE_ERR);
          }
          if (this._flag.send) {
            throw new DOMException(DOMException.INVALID_STATE_ERR);
          }
          if (this._flag.synchronous) {
            throw new DOMException(DOMException.INVALID_ACCESS_ERR);
          }
          this._flag.withCredentials = val;
        }
      }
    });

    function _readyStateChange(xhr, readyState) {
      if (xhr.readyState !== readyState) {
        var readyStateChangeEvent = new Event("readystatechange");
        Object.defineProperty(xhr, "readyState", {
          configurable: true,
          enumerable: true,
          value: readyState,
          writable: false
        });
        xhr.dispatchEvent(readyStateChangeEvent);
      }
    }

    function _receiveResponse(xhr, response) {
      var _properties = xhr._properties;
      var contentLength = "0";
      var bufferLength = 0;
      var byteOffset = 0;
      var statusCode = response.statusCode;
      Object.defineProperties(xhr, {
        status: {
          configurable: true,
          enumerable: true,
          value: statusCode,
          writable: false
        },
        statusText: {
          configurable: true,
          enumerable: true,
          value: response.statusMessage || HTTP_STATUS_CODES[statusCode] || "OK",
          writable: false
        }
      });

      var headers = {};
      var headerMap = {};
      var rawHeaders = response.rawHeaders;
      var n = +rawHeaders.length;
      for (var i = 0; i < n; i += 2) {
        var k = rawHeaders[i];
        var kl = k.toLowerCase();
        var v = rawHeaders[i + 1];
        if (k.match(uniqueResponseHeaders)) {
          if (headerMap[kl] !== undefined) {
            delete headers[headerMap[kl]];
          }
          headers[k] = v;
        } else {
          if (headerMap[kl] !== undefined) {
            headers[headerMap[kl]] += ", " + v;
          } else {
            headers[k] = v;
          }
        }
        headerMap[kl] = k;
      }
      _properties.responseHeaders = headers;
      contentLength = xhr.getResponseHeader("content-length") || contentLength;
      bufferLength = parseInt(contentLength, 10);
      xhr.lengthComputable = false;
      if (bufferLength !== 0) {
        xhr.total = bufferLength;
        xhr.loaded = 0;
        xhr.lengthComputable = true;
      }
      _properties.responseBuffer = new Buffer(0);
      _properties.responseCache = null;
      _properties.responseTextCache = null;
      _properties.responseXMLCache = null;
      if (!xhr._flag.synchronous) {
        _readyStateChange(xhr, XMLHttpRequest.HEADERS_RECEIVED);
      }
      _properties.client.on("data", function (chunk) {
        _properties.responseBuffer = Buffer.concat([_properties.responseBuffer, chunk]);
        _properties.responseCache = null;
        _properties.responseTextCache = null;
        _properties.responseXMLCache = null;
      });
      response.addListener("data", function (chunk) {
        byteOffset += chunk.length;
        xhr.loaded = byteOffset;
        if (!xhr._flag.synchronous) {
          _readyStateChange(xhr, XMLHttpRequest.LOADING);
        }
        var progress = {lengthComputable: xhr.lengthComputable, total: xhr.total, loaded: xhr.loaded};
        if (xhr.total !== xhr.loaded) {
          var progressEvent = new ProgressEvent("progress", progress);
          xhr.dispatchEvent(progressEvent);
        }
      });
      _properties.client.addListener("end", function () {
        clearTimeout(xhr._flag.timeoutId);
        xhr._flag.timeoutFn = null;
        xhr._flag.timeoutStart = 0;
        _properties.client = null;
        _readyStateChange(xhr, XMLHttpRequest.DONE);
        var loadEvent = new ProgressEvent("load");
        var loadEndEvent = new ProgressEvent("loadend", {
          lengthComputable: xhr.lengthComputable,
          total: xhr.total,
          loaded: xhr.loaded
        });
        xhr.dispatchEvent(loadEvent);
        xhr.dispatchEvent(loadEndEvent);
      });
    }

    function _setDispatchProgressEvents(xhr) {
      var client = xhr._properties.client;

      client.on("request", function (req) {
        xhr.upload.dispatchEvent(new ProgressEvent("loadstart"));
        req.on("response", function () {
          var total = 0;
          var lengthComputable = false;
          var length = parseInt(utils.getRequestHeader(client.headers, "content-length"), 10);
          if (length) {
            total = length;
            lengthComputable = true;
          }
          var progress = {lengthComputable: lengthComputable, total: total, loaded: total};
          var progressEvent = new ProgressEvent("progress", progress);
          xhr.upload.dispatchEvent(progressEvent);

          var loadEvent = new ProgressEvent("load");
          var loadEndEvent = new ProgressEvent("loadend");
          xhr.upload.dispatchEvent(loadEvent);
          xhr.upload.dispatchEvent(loadEndEvent);
        });
      });

    }

    proto.abort = function abort() {
      clearTimeout(this._flag.timeoutId);
      this._flag.timeoutFn = null;
      this._flag.timeoutStart = 0;
      var client = this._properties.client;
      if (client) {
        client.abort();
      }
      if (!(this.readyState === XMLHttpRequest.UNSENT ||
            (this.readyState === XMLHttpRequest.OPENED && !this._flag.send) ||
            this.readyState === XMLHttpRequest.DONE)) {
        this._flag.send = false;
        _readyStateChange(this, XMLHttpRequest.DONE);
        if (!(this._properties.method === "HEAD" || this._properties.method === "GET")) {
          this.upload.dispatchEvent(new ProgressEvent("progress"));
          this.upload.dispatchEvent(new ProgressEvent("abort"));
          this.upload.dispatchEvent(new ProgressEvent("loadend"));
        }
        this.dispatchEvent(new ProgressEvent("progress"));
        this.dispatchEvent(new ProgressEvent("abort"));
        this.dispatchEvent(new ProgressEvent("loadend"));
      }
      Object.defineProperty(this, "readyState", {
        configurable: true,
        enumerable: true,
        value: XMLHttpRequest.UNSENT,
        writable: false
      });
    };

    proto.getAllResponseHeaders = function getAllResponseHeaders() {
      var readyState = this.readyState;
      if ([XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED].indexOf(readyState) >= 0) {
        return "";
      }
      return Object.keys(this._properties.responseHeaders)
      .filter(function (key) {
        var keyLc = key.toLowerCase();
        return keyLc !== "set-cookie" && keyLc !== "set-cookie2";
      })
      .map(function (key) {
        return [key, this._properties.responseHeaders[key]].join(": ");
      }, this).join("\r\n");
    };

    proto.getResponseHeader = function getResponseHeader(header) {
      var readyState = this.readyState;
      var key;
      var value;
      if ([XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED].indexOf(readyState) >= 0) {
        return null;
      }
      var keys = Object.keys(this._properties.responseHeaders);
      var n = keys.length;
      var responseHeaders = {};
      while (n--) {
        key = keys[n];
        responseHeaders[key.toLowerCase()] = this._properties.responseHeaders[key];
      }
      key = header.toLowerCase();
      if (key === "set-cookie" || key === "set-cookie2") {
        return null;
      }
      value = responseHeaders[key];
      return typeof value !== "undefined" ? "" + value : null;
    };

    proto.open = function open(method, uri, async, user, password) {
      var argumentCount = arguments.length;
      if (argumentCount < 2) {
        throw new TypeError("Not enought arguments");
      }
      if (!tokenRegexp.test(method)) {
        throw new DOMException(DOMException.SYNTAX_ERR);
      }
      var upperCaseMethod = method.toUpperCase();
      if (forbiddenRequestMethods.indexOf(upperCaseMethod) !== -1) {
        throw new DOMException(DOMException.SECURITY_ERR);
      }
      if (allowedRequestMethods.indexOf(upperCaseMethod) !== -1) {
        method = upperCaseMethod;
      }
      if (typeof async !== "undefined") {
        this._flag.synchronous = !async;
      } else {
        this._flag.synchronous = false;
      }
      if (this._properties.responseType && this._flag.synchronous) {
        throw new DOMException(DOMException.INVALID_ACCESS_ERR);
      }
      if (this._flag.synchronous && this._flag.timeout) {
        throw new DOMException(DOMException.INVALID_ACCESS_ERR);
      }
      this._properties.method = method;
      this._properties.uri = uri;
      if (argumentCount >= 4 && (user || password)) {
        this._properties.auth = {
          user: user || "",
          pass: password || "",
          sendImmediately: false
        };
      }
      var client = this._properties.client;
      if (client && typeof client.abort === "function") {
        client.abort();
      }
      this._flag.send = false;
      this._properties.requestHeaders = {};
      this._properties.requestBuffer = null;
      this._properties.requestCache = null;
      _readyStateChange(this, XMLHttpRequest.OPENED);
    };

    proto.overrideMimeType = function overrideMimeType(mime) {
      if ([XMLHttpRequest.LOADING, XMLHttpRequest.DONE].indexOf(this.readyState) >= 0) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      this._flag.mimeType = mime;
    };

    var syncFn = deasync ? deasync(function (xhr, done) {
      function loadend() {
        xhr.removeEventListener("loadend", loadend, false);
        xhr.removeEventListener("error", error, false);
        xhr.removeEventListener("abort", abort, false);
        xhr.removeEventListener("timeout", abort, false);
        done(null);
      }
      function error(err) {
        xhr.removeEventListener("loadend", loadend, false);
        xhr.removeEventListener("error", error, false);
        xhr.removeEventListener("abort", abort, false);
        xhr.removeEventListener("timeout", abort, false);
        done(new DOMException(DOMException.NETWORK_ERR, err));
      }
      function abort(err) {
        xhr.removeEventListener("loadend", loadend, false);
        xhr.removeEventListener("error", error, false);
        xhr.removeEventListener("abort", abort, false);
        xhr.removeEventListener("timeout", abort, false);
        done(new DOMException(DOMException.ABORT_ERR, err));
      }
      function timeout(err) {
        xhr.removeEventListener("loadend", loadend, false);
        xhr.removeEventListener("error", error, false);
        xhr.removeEventListener("abort", abort, false);
        xhr.removeEventListener("timeout", abort, false);
        done(new DOMException(DOMException.TIMEOUT_ERR, err));
      }
      xhr.addEventListener("loadend", loadend, false);
      xhr.addEventListener("error", error, false);
      xhr.addEventListener("abort", abort, false);
      xhr.addEventListener("timeout", timeout, false);
    }) : function () {} ;

    proto.send = function send(body) {
      var _properties = this._properties;
      var client;
      var self = this;
      if (this.readyState !== XMLHttpRequest.OPENED || this._flag.send) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      this._flag.send = true;
      if (!this._flag.synchronous) {
        this.dispatchEvent(new ProgressEvent("loadstart"));
      }

      client = utils.createClient.call(this, this._properties, body,
        _receiveResponse.bind(null, this),
        function (err) {
          if (err) {
            if (client) {
              client.removeAllListeners();
            }
            _readyStateChange(self, XMLHttpRequest.DONE);
            if (!(_properties.method === "HEAD" || _properties.method === "GET")) {
              self.upload.dispatchEvent(new ProgressEvent("error"));
              self.upload.dispatchEvent(new ProgressEvent("loadend"));
            }
            self.dispatchEvent(new ProgressEvent("error"));
            self.dispatchEvent(new ProgressEvent("loadend"));
          }
        }
      );
      _properties.client = client;
      if (body !== undefined &&
          body !== null &&
          body !== "" &&
          !(_properties.method === "HEAD" || _properties.method === "GET") &&
          !this._flag.synchronous) {
        _setDispatchProgressEvents(this);
      }
      if (this.timeout > 0) {
        this._flag.timeoutStart = (new Date()).getTime();
        this._flag.timeoutFn = function () {
          client.abort();
          if (!(self.readyState === XMLHttpRequest.UNSENT ||
                (self.readyState === XMLHttpRequest.OPENED && !self._flag.send) ||
                self.readyState === XMLHttpRequest.DONE)) {
            self._flag.send = false;
            _readyStateChange(self, XMLHttpRequest.DONE);
            if (!(_properties.method === "HEAD" || _properties.method === "GET")) {
              self.upload.dispatchEvent(new ProgressEvent("progress"));
              self.upload.dispatchEvent(new ProgressEvent("timeout"));
              self.upload.dispatchEvent(new ProgressEvent("loadend"));
            }
            self.dispatchEvent(new ProgressEvent("progress"));
            self.dispatchEvent(new ProgressEvent("timeout"));
            self.dispatchEvent(new ProgressEvent("loadend"));
          }
          Object.defineProperty(self, "readyState", {
            configurable: true,
            enumerable: true,
            value: XMLHttpRequest.UNSENT,
            writable: false
          });
        };
        this._flag.timeoutId = setTimeout(this._flag.timeoutFn, this.timeout);
      }
      if (this._flag.synchronous) {
        syncFn(this);
      }
    };

    proto.setRequestHeader = function setRequestHeader(header, value) {
      if (arguments.length !== 2) {
        throw new TypeError();
      }
      value = String(value);
      if (!tokenRegexp.test(header) || !fieldValueRegexp.test(value)) {
        throw new DOMException(DOMException.SYNTAX_ERR);
      }
      if (this.readyState !== XMLHttpRequest.OPENED || this._flag.send) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      if (forbiddenRequestHeaders.test(header)) {
        return;
      }
      var keys = Object.keys(this._properties.requestHeaders);
      var n = keys.length;
      while (n--) {
        var key = keys[n];
        if (key.toLowerCase() === header.toLowerCase()) {
          this._properties.requestHeaders[key] += ", " + value;
          return;
        }
      }
      this._properties.requestHeaders[header] = value;
    };

    proto.toString = function () {
      return "[object XMLHttpRequest]";
    };

    proto.onreadystatechange = null;
  })(XMLHttpRequest.prototype);

  function XMLHttpRequestUpload() {
    if (!(this instanceof XMLHttpRequestUpload)) {
      throw new TypeError("DOM object constructor cannot be called as a function.");
    }
    XMLHttpRequestEventTarget.call(this);
  }

  XMLHttpRequestUpload.prototype = Object.create(XMLHttpRequestEventTarget.prototype);

  Object.defineProperties(XMLHttpRequestUpload.prototype, {
    _ownerDocument: {
      configurable: true,
      enumerable: true,
      get: function () {
        return options.window.document;
      }
    }
  });

  return {
    XMLHttpRequest: XMLHttpRequest,
    XMLHttpRequestUpload: XMLHttpRequestUpload
  };
}

module.exports = createXMLHttpRequest;

