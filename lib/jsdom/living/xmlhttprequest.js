"use strict";

const HTTP_STATUS_CODES = require("http").STATUS_CODES;
const deasync = require("deasync");

const jsdom = require("../../jsdom");
const xhrUtils = require("./xhr-utils");
const DOMException = require("../web-idl/DOMException");
const xhrSymbols = require("./xmlhttprequest-symbols");
const utils = require("../utils");
const documentBaseURLHelper = require("./helpers/document-base-url");

const forbiddenRequestHeaders = new RegExp("^(?:" + [
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
const uniqueResponseHeaders = new RegExp("^(?:" + [
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

const allowedRequestMethods = ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE"];
const forbiddenRequestMethods = ["TRACK", "TRACE", "CONNECT"];

const tokenRegexp = /^(?:(?![\x00-\x1F\x7F \t\(\)<>@,;:\\"\/\[\]?={}])[\x00-\x7F])+$/;
const fieldValueRegexp = /^(?:(?![\x00-\x1F\x7F])[\x00-\xFF])*$/;

const XMLHttpRequestResponseType = [
  "",
  "arraybuffer",
  "blob",
  "document",
  "json",
  "text"
];

module.exports = function (core) {
  core.createXMLHttpRequest = function createXMLHttpRequest(window) {
    const Event = core.Event;
    const ProgressEvent = core.ProgressEvent;
    const Blob = core.Blob;
    const XMLHttpRequestEventTarget = core.XMLHttpRequestEventTarget;
    const XMLHttpRequestUpload = core.XMLHttpRequestUpload;

    class XMLHttpRequest extends XMLHttpRequestEventTarget {
      constructor() {
        super();
        if (!(this instanceof XMLHttpRequest)) {
          throw new TypeError("DOM object constructor cannot be called as a function.");
        }
        this.upload = new XMLHttpRequestUpload();
        this.upload._ownerDocument = window.document;

        this[xhrSymbols.flag] = {
          synchronous: false,
          withCredentials: false,
          send: false,
          timeout: 0,
          timeoutStart: 0,
          timeoutId: 0,
          timeoutFn: null,
          mimeType: null
        };

        this[xhrSymbols.properties] = {
          auth: "",
          client: null,
          method: undefined,
          responseHeaders: {},
          responseBuffer: null,
          responseCache: null,
          responseTextCache: null,
          responseXMLCache: null,
          responseType: "",
          requestHeaders: {},
          uri: ""
        };
        this.readyState = XMLHttpRequest.UNSENT;
        this.status = 0;
        this.statusText = "";
        this.onreadystatechange = null;
      }
      get UNSENT() {
        return 0;
      }
      static get UNSENT() {
        return 0;
      }
      get OPENED() {
        return 1;
      }
      static get OPENED() {
        return 1;
      }
      get HEADERS_RECEIVED() {
        return 2;
      }
      static get HEADERS_RECEIVED() {
        return 2;
      }
      get LOADING() {
        return 3;
      }
      static get LOADING() {
        return 3;
      }
      get DONE() {
        return 4;
      }
      static get DONE() {
        return 4;
      }
      get _ownerDocument() {
        return window.document;
      }
      get responseType() {
        return this[xhrSymbols.properties].responseType;
      }
      set responseType(responseType) {
        if (this.readyState === XMLHttpRequest.LOADING || this.readyState === XMLHttpRequest.DONE) {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        if (this.readyState === XMLHttpRequest.OPENED && this[xhrSymbols.flag].synchronous) {
          throw new DOMException(DOMException.INVALID_ACCESS_ERR);
        }
        if (XMLHttpRequestResponseType.indexOf(responseType) === -1) {
          responseType = "";
        }
        this[xhrSymbols.properties].responseType = responseType;
      }
      get response() {
        if (this[xhrSymbols.properties].responseCache) {
          return this[xhrSymbols.properties].responseCache;
        }
        let res = "";
        switch (this.responseType) {
          case "":
          case "text":
            res = this.responseText;
            break;
          case "arraybuffer":
            if (!this[xhrSymbols.properties].responseBuffer) {
              return null;
            }
            res = (new Uint8Array(this[xhrSymbols.properties].responseBuffer)).buffer;
            break;
          case "blob":
            if (!this[xhrSymbols.properties].responseBuffer) {
              return null;
            }
            res = new Blob([(new Uint8Array(this[xhrSymbols.properties].responseBuffer)).buffer]);
            break;
          case "document":
            res = this.responseXML;
            break;
          case "json":
            if (this.readyState !== XMLHttpRequest.DONE || !this[xhrSymbols.properties].responseBuffer) {
              res = null;
            }
            try {
              res = JSON.parse(this[xhrSymbols.properties].responseBuffer.toString());
            } catch (e) {
              res = null;
            }
            break;
        }
        this[xhrSymbols.properties].responseCache = res;
        return res;
      }
      get responseText() {
        if (this.responseType !== "" && this.responseType !== "text") {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        if (this.readyState !== XMLHttpRequest.LOADING && this.readyState !== XMLHttpRequest.DONE) {
          return "";
        }
        if (this[xhrSymbols.properties].responseTextCache) {
          return this[xhrSymbols.properties].responseTextCache;
        }
        const responseBuffer = this[xhrSymbols.properties].responseBuffer;
        if (!responseBuffer) {
          return "";
        }
        const res = responseBuffer.toString();
        this[xhrSymbols.properties].responseTextCache = res;
        return res;
      }
      get responseXML() {
        if (this.responseType !== "" && this.responseType !== "document") {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        if (this.readyState !== XMLHttpRequest.DONE) {
          return null;
        }
        if (this[xhrSymbols.properties].responseXMLCache) {
          return this[xhrSymbols.properties].responseXMLCache;
        }
        const contentType = this[xhrSymbols.flag].mimeType || this.getResponseHeader("Content-Type");
        if (contentType && !contentType.match(/^(?:text\/html|text\/xml|application\/xml|.*?\+xml)(?:;.*)*$/)) {
          return null;
        }
        const responseBuffer = this[xhrSymbols.properties].responseBuffer;
        if (!responseBuffer) {
          return null;
        }
        const resText = responseBuffer.toString();
        const res = jsdom.jsdom(resText, {
          parsingMode: "xml"
        });
        this[xhrSymbols.properties].responseXMLCache = res;
        return res;
      }
      get timeout() {
        return this[xhrSymbols.flag].timeout;
      }
      set timeout(val) {
        if (this[xhrSymbols.flag].synchronous) {
          throw new DOMException(DOMException.INVALID_ACCESS_ERR);
        }
        this[xhrSymbols.flag].timeout = val;
        clearTimeout(this[xhrSymbols.flag].timeoutId);
        if (val > 0 && this[xhrSymbols.flag].timeoutFn) {
          this[xhrSymbols.flag].timeoutId = setTimeout(
            this[xhrSymbols.flag].timeoutFn,
            Math.max(0, val - ((new Date()).getTime() - this[xhrSymbols.flag].timeoutStart))
          );
        } else {
          this[xhrSymbols.flag].timeoutFn = null;
          this[xhrSymbols.flag].timeoutStart = 0;
        }
      }
      get withCredentials() {
        return this[xhrSymbols.flag].withCredentials;
      }
      set withCredentials(val) {
        if (!(this.readyState === XMLHttpRequest.UNSENT || this.readyState === XMLHttpRequest.OPENED)) {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        if (this[xhrSymbols.flag].send) {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        if (this[xhrSymbols.flag].synchronous) {
          throw new DOMException(DOMException.INVALID_ACCESS_ERR);
        }
        this[xhrSymbols.flag].withCredentials = val;
      }

      abort() {
        clearTimeout(this[xhrSymbols.flag].timeoutId);
        this[xhrSymbols.flag].timeoutFn = null;
        this[xhrSymbols.flag].timeoutStart = 0;
        const client = this[xhrSymbols.properties].client;
        if (client) {
          client.abort();
        }
        if (!(this.readyState === XMLHttpRequest.UNSENT ||
            (this.readyState === XMLHttpRequest.OPENED && !this[xhrSymbols.flag].send) ||
            this.readyState === XMLHttpRequest.DONE)) {
          this[xhrSymbols.flag].send = false;
          _readyStateChange(this, XMLHttpRequest.DONE);
          if (!(this[xhrSymbols.properties].method === "HEAD" || this[xhrSymbols.properties].method === "GET")) {
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
      }
      getAllResponseHeaders() {
        const readyState = this.readyState;
        if ([XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED].indexOf(readyState) >= 0) {
          return "";
        }
        return Object.keys(this[xhrSymbols.properties].responseHeaders)
          .filter(key => {
            const keyLc = key.toLowerCase();
            return keyLc !== "set-cookie" && keyLc !== "set-cookie2";
          })
          .map(function (key) {
            return [key, this[xhrSymbols.properties].responseHeaders[key]].join(": ");
          }, this).join("\r\n");
      }

      getResponseHeader(header) {
        const readyState = this.readyState;
        if ([XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED].indexOf(readyState) >= 0) {
          return null;
        }
        const keys = Object.keys(this[xhrSymbols.properties].responseHeaders);
        let n = keys.length;
        const responseHeaders = {};
        while (n--) {
          const key = keys[n];
          responseHeaders[key.toLowerCase()] = this[xhrSymbols.properties].responseHeaders[key];
        }
        const key = header.toLowerCase();
        if (key === "set-cookie" || key === "set-cookie2") {
          return null;
        }
        const value = responseHeaders[key];
        return typeof value !== "undefined" ? String(value) : null;
      }

      open(method, uri, async, user, password) {
        const argumentCount = arguments.length;
        if (argumentCount < 2) {
          throw new TypeError("Not enought arguments");
        }
        if (!tokenRegexp.test(method)) {
          throw new DOMException(DOMException.SYNTAX_ERR);
        }
        const upperCaseMethod = method.toUpperCase();
        if (forbiddenRequestMethods.indexOf(upperCaseMethod) !== -1) {
          throw new DOMException(DOMException.SECURITY_ERR);
        }
        if (allowedRequestMethods.indexOf(upperCaseMethod) !== -1) {
          method = upperCaseMethod;
        }
        if (typeof async !== "undefined") {
          this[xhrSymbols.flag].synchronous = !async;
        } else {
          this[xhrSymbols.flag].synchronous = false;
        }
        if (this[xhrSymbols.properties].responseType && this[xhrSymbols.flag].synchronous) {
          throw new DOMException(DOMException.INVALID_ACCESS_ERR);
        }
        if (this[xhrSymbols.flag].synchronous && this[xhrSymbols.flag].timeout) {
          throw new DOMException(DOMException.INVALID_ACCESS_ERR);
        }
        this[xhrSymbols.properties].method = method;

        const baseUrl = documentBaseURLHelper.documentBaseURL(this._ownerDocument);
        const urlObj = new utils.URL(uri, baseUrl.toString());
        this[xhrSymbols.properties].uri = urlObj.href;

        if (argumentCount >= 4 && (user || password)) {
          this[xhrSymbols.properties].auth = {
            user: user || "",
            pass: password || "",
            sendImmediately: false
          };
        }
        const client = this[xhrSymbols.properties].client;
        if (client && typeof client.abort === "function") {
          client.abort();
        }
        this[xhrSymbols.flag].send = false;
        this[xhrSymbols.properties].requestHeaders = {};
        this[xhrSymbols.properties].requestBuffer = null;
        this[xhrSymbols.properties].requestCache = null;
        _readyStateChange(this, XMLHttpRequest.OPENED);
      }

      overrideMimeType(mime) {
        if ([XMLHttpRequest.LOADING, XMLHttpRequest.DONE].indexOf(this.readyState) >= 0) {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        this[xhrSymbols.flag].mimeType = mime;
      }

      send(body) {
        const properties = this[xhrSymbols.properties];
        const self = this;
        if (this.readyState !== XMLHttpRequest.OPENED || this[xhrSymbols.flag].send) {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        this[xhrSymbols.flag].send = true;
        if (!this[xhrSymbols.flag].synchronous) {
          this.dispatchEvent(new ProgressEvent("loadstart"));
        }

        const client = xhrUtils.createClient(core, this, body,
          (err, response) => {
            if (err) {
              if (client) {
                client.removeAllListeners();
              }
              _readyStateChange(self, XMLHttpRequest.DONE);
              if (!(properties.method === "HEAD" || properties.method === "GET")) {
                self.upload.dispatchEvent(new ProgressEvent("error", err));
                self.upload.dispatchEvent(new ProgressEvent("loadend"));
              }
              self.dispatchEvent(new ProgressEvent("error", err));
              self.dispatchEvent(new ProgressEvent("loadend"));
              return;
            }
            _receiveResponse(self, response);
          }
        );
        properties.client = client;
        if (client) {
          if (body !== undefined &&
            body !== null &&
            body !== "" &&
            !(properties.method === "HEAD" || properties.method === "GET") &&
            !this[xhrSymbols.flag].synchronous) {
            _setDispatchProgressEvents(this);
          }
          if (this.timeout > 0) {
            this[xhrSymbols.flag].timeoutStart = (new Date()).getTime();
            this[xhrSymbols.flag].timeoutFn = function () {
              client.abort();
              if (!(self.readyState === XMLHttpRequest.UNSENT ||
                  (self.readyState === XMLHttpRequest.OPENED && !self[xhrSymbols.flag].send) ||
                  self.readyState === XMLHttpRequest.DONE)) {
                self[xhrSymbols.flag].send = false;
                _readyStateChange(self, XMLHttpRequest.DONE);
                if (!(properties.method === "HEAD" || properties.method === "GET")) {
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
            this[xhrSymbols.flag].timeoutId = setTimeout(this[xhrSymbols.flag].timeoutFn, this.timeout);
          }
        }
        if (this[xhrSymbols.flag].synchronous) {
          const syncFn = deasync((xhr, done) => {
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
          });
          syncFn(this);
        }
      }

      setRequestHeader(header, value) {
        if (arguments.length !== 2) {
          throw new TypeError();
        }
        value = String(value);
        if (!tokenRegexp.test(header) || !fieldValueRegexp.test(value)) {
          throw new DOMException(DOMException.SYNTAX_ERR);
        }
        if (this.readyState !== XMLHttpRequest.OPENED || this[xhrSymbols.flag].send) {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
        if (forbiddenRequestHeaders.test(header)) {
          return;
        }
        const keys = Object.keys(this[xhrSymbols.properties].requestHeaders);
        let n = keys.length;
        while (n--) {
          const key = keys[n];
          if (key.toLowerCase() === header.toLowerCase()) {
            this[xhrSymbols.properties].requestHeaders[key] += ", " + value;
            return;
          }
        }
        this[xhrSymbols.properties].requestHeaders[header] = value;
      }

      toString() {
        return "[object XMLHttpRequest]";
      }
    }

    function _readyStateChange(xhr, readyState) {
      if (xhr.readyState !== readyState) {
        const readyStateChangeEvent = new Event("readystatechange");
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
      const properties = xhr[xhrSymbols.properties];
      let byteOffset = 0;
      const statusCode = response.statusCode;
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

      const headers = {};
      const headerMap = {};
      const rawHeaders = response.rawHeaders;
      const n = Number(rawHeaders.length);
      for (let i = 0; i < n; i += 2) {
        const k = rawHeaders[i];
        const kl = k.toLowerCase();
        const v = rawHeaders[i + 1];
        if (k.match(uniqueResponseHeaders)) {
          if (headerMap[kl] !== undefined) {
            delete headers[headerMap[kl]];
          }
          headers[k] = v;
        } else if (headerMap[kl] !== undefined) {
          headers[headerMap[kl]] += ", " + v;
        } else {
          headers[k] = v;
        }
        headerMap[kl] = k;
      }
      properties.responseHeaders = headers;
      const contentLength = xhr.getResponseHeader("content-length") || "0";
      const bufferLength = parseInt(contentLength, 10) || 0;
      xhr.lengthComputable = false;
      if (bufferLength !== 0) {
        xhr.total = bufferLength;
        xhr.loaded = 0;
        xhr.lengthComputable = true;
      }
      properties.responseBuffer = new Buffer(0);
      properties.responseCache = null;
      properties.responseTextCache = null;
      properties.responseXMLCache = null;
      if (!xhr[xhrSymbols.flag].synchronous) {
        _readyStateChange(xhr, XMLHttpRequest.HEADERS_RECEIVED);
      }
      properties.client.on("data", chunk => {
        properties.responseBuffer = Buffer.concat([properties.responseBuffer, chunk]);
        properties.responseCache = null;
        properties.responseTextCache = null;
        properties.responseXMLCache = null;
      });
      response.on("data", chunk => {
        byteOffset += chunk.length;
        xhr.loaded = byteOffset;
        if (!xhr[xhrSymbols.flag].synchronous) {
          _readyStateChange(xhr, XMLHttpRequest.LOADING);
        }
        if (xhr.total !== xhr.loaded) {
          const progress = {
            lengthComputable: xhr.lengthComputable,
            total: xhr.total,
            loaded: xhr.loaded
          };
          const progressEvent = new ProgressEvent("progress", progress);
          xhr.dispatchEvent(progressEvent);
        }
      });
      properties.client.on("end", () => {
        clearTimeout(xhr[xhrSymbols.flag].timeoutId);
        xhr[xhrSymbols.flag].timeoutFn = null;
        xhr[xhrSymbols.flag].timeoutStart = 0;
        properties.client = null;
        _readyStateChange(xhr, XMLHttpRequest.DONE);
        const loadEvent = new ProgressEvent("load");
        const loadEndEvent = new ProgressEvent("loadend", {
          lengthComputable: xhr.lengthComputable,
          total: xhr.total,
          loaded: xhr.loaded
        });
        xhr.dispatchEvent(loadEvent);
        xhr.dispatchEvent(loadEndEvent);
      });
    }

    function _setDispatchProgressEvents(xhr) {
      const client = xhr[xhrSymbols.properties].client;

      client.on("request", req => {
        xhr.upload.dispatchEvent(new ProgressEvent("loadstart"));
        req.on("response", () => {
          let total = 0;
          let lengthComputable = false;
          const length = parseInt(xhrUtils.getRequestHeader(client.headers, "content-length"), 10);
          if (length) {
            total = length;
            lengthComputable = true;
          }
          const progress = {
            lengthComputable,
            total,
            loaded: total
          };
          const progressEvent = new ProgressEvent("progress", progress);
          xhr.upload.dispatchEvent(progressEvent);

          const loadEvent = new ProgressEvent("load");
          const loadEndEvent = new ProgressEvent("loadend");
          xhr.upload.dispatchEvent(loadEvent);
          xhr.upload.dispatchEvent(loadEndEvent);
        });
      });
    }

    return XMLHttpRequest;
  };
};
