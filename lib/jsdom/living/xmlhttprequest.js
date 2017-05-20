"use strict";

const HTTP_STATUS_CODES = require("http").STATUS_CODES;
const spawnSync = require("child_process").spawnSync;
const URL = require("whatwg-url").URL;
const whatwgEncoding = require("whatwg-encoding");
const tough = require("tough-cookie");
const parseContentType = require("content-type-parser");
const conversions = require("webidl-conversions");

const xhrUtils = require("./xhr-utils");
const DOMException = require("../web-idl/DOMException");
const xhrSymbols = require("./xmlhttprequest-symbols");
const addConstants = require("../utils").addConstants;
const documentBaseURLSerialized = require("./helpers/document-base-url").documentBaseURLSerialized;
const idlUtils = require("./generated/utils");
const Document = require("./generated/Document");
const Blob = require("./generated/Blob");
const FormData = require("./generated/FormData");
const domToHtml = require("../browser/domtohtml").domToHtml;

const syncWorkerFile = require.resolve ? require.resolve("./xhr-sync-worker.js") : null;

const tokenRegexp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const headerListSeparatorRegexp = /,[ \t]*/;
const fieldValueRegexp = /^[ \t]*(?:[\x21-\x7E\x80-\xFF](?:[ \t][\x21-\x7E\x80-\xFF])?)*[ \t]*$/;

const forbiddenRequestHeaders = new Set([
  "accept-charset",
  "accept-encoding",
  "access-control-request-headers",
  "access-control-request-method",
  "connection",
  "content-length",
  "cookie",
  "cookie2",
  "date",
  "dnt",
  "expect",
  "host",
  "keep-alive",
  "origin",
  "referer",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "via"
]);
const forbiddenResponseHeaders = new Set([
  "set-cookie",
  "set-cookie2"
]);
const uniqueResponseHeaders = new Set([
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
]);
const corsSafeResponseHeaders = new Set([
  "cache-control",
  "content-language",
  "content-type",
  "expires",
  "last-modified",
  "pragma"
]);


const allowedRequestMethods = new Set(["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE"]);
const forbiddenRequestMethods = new Set(["TRACK", "TRACE", "CONNECT"]);

const XMLHttpRequestResponseType = new Set([
  "",
  "arraybuffer",
  "blob",
  "document",
  "json",
  "text"
]);

const simpleHeaders = xhrUtils.simpleHeaders;

module.exports = function createXMLHttpRequest(window) {
  const Event = window.Event;
  const ProgressEvent = window.ProgressEvent;
  const XMLHttpRequestEventTarget = window.XMLHttpRequestEventTarget;
  const XMLHttpRequestUpload = window.XMLHttpRequestUpload;

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
        mimeType: null,
        auth: null,
        method: undefined,
        responseType: "",
        requestHeaders: {},
        referrer: this._ownerDocument.URL,
        uri: "",
        timeout: 0,
        body: undefined,
        formData: false,
        preflight: false,
        requestManager: this._ownerDocument._requestManager,
        pool: this._ownerDocument._pool,
        agentOptions: this._ownerDocument._agentOptions,
        strictSSL: this._ownerDocument._strictSSL,
        proxy: this._ownerDocument._proxy,
        cookieJar: this._ownerDocument._cookieJar,
        encoding: this._ownerDocument._encoding,
        origin: this._ownerDocument.origin,
        userAgent: this._ownerDocument._defaultView.navigator.userAgent
      };

      this[xhrSymbols.properties] = {
        beforeSend: false,
        send: false,
        timeoutStart: 0,
        timeoutId: 0,
        timeoutFn: null,
        client: null,
        responseHeaders: {},
        filteredResponseHeaders: [],
        responseBuffer: null,
        responseCache: null,
        responseTextCache: null,
        responseXMLCache: null,
        responseURL: "",
        readyState: XMLHttpRequest.UNSENT,
        status: 0,
        statusText: "",
        error: "",
        uploadComplete: true,
        abortError: false,
        cookieJar: this._ownerDocument._cookieJar,
        bufferStepSize: 1 * 1024 * 1024, // pre-allocate buffer increase step size. init value is 1MB
        totalReceivedChunkSize: 0
      };
      this.onreadystatechange = null;
    }
    get readyState() {
      return this[xhrSymbols.properties].readyState;
    }
    get status() {
      return this[xhrSymbols.properties].status;
    }
    get statusText() {
      return this[xhrSymbols.properties].statusText;
    }
    get responseType() {
      return this[xhrSymbols.flag].responseType;
    }
    set responseType(responseType) {
      const flag = this[xhrSymbols.flag];
      if (this.readyState === XMLHttpRequest.LOADING || this.readyState === XMLHttpRequest.DONE) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      if (this.readyState === XMLHttpRequest.OPENED && flag.synchronous) {
        throw new DOMException(DOMException.INVALID_ACCESS_ERR);
      }
      if (!XMLHttpRequestResponseType.has(responseType)) {
        responseType = "";
      }
      flag.responseType = responseType;
    }
    get response() {
      const properties = this[xhrSymbols.properties];
      if (properties.responseCache) {
        return properties.responseCache;
      }
      let res = "";

      const responseBuffer = !properties.responseBuffer ? null :
            properties.responseBuffer.slice(0, properties.totalReceivedChunkSize);

      switch (this.responseType) {
        case "":
        case "text": {
          res = this.responseText;
          break;
        }
        case "arraybuffer": {
          if (!responseBuffer) {
            return null;
          }
          res = (new Uint8Array(responseBuffer)).buffer;
          break;
        }
        case "blob": {
          if (!responseBuffer) {
            return null;
          }
          const contentType = finalMIMEType(this);
          res = Blob.create([[new Uint8Array(responseBuffer)], {
            type: contentType && contentType.toString() || ""
          }]);
          break;
        }
        case "document": {
          res = this.responseXML;
          break;
        }
        case "json": {
          if (this.readyState !== XMLHttpRequest.DONE || !responseBuffer) {
            res = null;
          }

          const fallbackEncoding = finalCharset(this) || whatwgEncoding.getBOMEncoding(responseBuffer) || "UTF-8";
          const jsonStr = whatwgEncoding.decode(responseBuffer, fallbackEncoding);

          try {
            res = JSON.parse(jsonStr);
          } catch (e) {
            res = null;
          }
          break;
        }
      }
      properties.responseCache = res;
      return res;
    }
    get responseText() {
      const properties = this[xhrSymbols.properties];
      if (this.responseType !== "" && this.responseType !== "text") {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      if (this.readyState !== XMLHttpRequest.LOADING && this.readyState !== XMLHttpRequest.DONE) {
        return "";
      }
      if (properties.responseTextCache) {
        return properties.responseTextCache;
      }
      const responseBuffer = !properties.responseBuffer ? null :
            properties.responseBuffer.slice(0, properties.totalReceivedChunkSize);

      if (!responseBuffer) {
        return "";
      }

      const fallbackEncoding = finalCharset(this) || whatwgEncoding.getBOMEncoding(responseBuffer) || "UTF-8";
      const res = whatwgEncoding.decode(responseBuffer, fallbackEncoding);

      properties.responseTextCache = res;
      return res;
    }
    get responseXML() {
      const flag = this[xhrSymbols.flag];
      const properties = this[xhrSymbols.properties];
      if (this.responseType !== "" && this.responseType !== "document") {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      if (this.readyState !== XMLHttpRequest.DONE) {
        return null;
      }
      if (properties.responseXMLCache) {
        return properties.responseXMLCache;
      }
      const responseBuffer = !properties.responseBuffer ? null :
            properties.responseBuffer.slice(0, properties.totalReceivedChunkSize);

      if (!responseBuffer) {
        return null;
      }
      const contentType = finalMIMEType(this);
      let isHTML = false;
      let isXML = false;
      if (contentType) {
        isHTML = contentType.isHTML();
        isXML = contentType.isXML();
        if (!isXML && !isHTML) {
          return null;
        }
      }

      if (this.responseType === "" && isHTML) {
        return null;
      }

      const encoding = finalCharset(this) || whatwgEncoding.getBOMEncoding(responseBuffer) || "UTF-8";
      const resText = whatwgEncoding.decode(responseBuffer, encoding);

      if (!resText) {
        return null;
      }
      const res = Document.create([], { core: window._core, options: {
        url: flag.uri,
        lastModified: new Date(getResponseHeader(this, "last-modified")),
        parsingMode: isHTML ? "html" : "xml",
        cookieJar: { setCookieSync: () => undefined, getCookieStringSync: () => "" },
        encoding,
        parseOptions: this._ownerDocument._parseOptions
      } });
      const resImpl = idlUtils.implForWrapper(res);
      try {
        resImpl._htmlToDom.appendToDocument(resText, resImpl);
      } catch (e) {
        properties.responseXMLCache = null;
        return null;
      }
      res.close();
      properties.responseXMLCache = res;
      return res;
    }

    get responseURL() {
      return this[xhrSymbols.properties].responseURL;
    }

    get timeout() {
      return this[xhrSymbols.flag].timeout;
    }
    set timeout(val) {
      const flag = this[xhrSymbols.flag];
      const properties = this[xhrSymbols.properties];
      if (flag.synchronous) {
        throw new DOMException(DOMException.INVALID_ACCESS_ERR);
      }
      flag.timeout = val;
      clearTimeout(properties.timeoutId);
      if (val > 0 && properties.timeoutFn) {
        properties.timeoutId = setTimeout(
          properties.timeoutFn,
          Math.max(0, val - ((new Date()).getTime() - properties.timeoutStart))
        );
      } else {
        properties.timeoutFn = null;
        properties.timeoutStart = 0;
      }
    }
    get withCredentials() {
      return this[xhrSymbols.flag].withCredentials;
    }
    set withCredentials(val) {
      const flag = this[xhrSymbols.flag];
      const properties = this[xhrSymbols.properties];
      if (!(this.readyState === XMLHttpRequest.UNSENT || this.readyState === XMLHttpRequest.OPENED)) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      if (properties.send) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      flag.withCredentials = val;
    }

    abort() {
      const flag = this[xhrSymbols.flag];
      const properties = this[xhrSymbols.properties];

      // Terminate the request
      clearTimeout(properties.timeoutId);
      properties.timeoutFn = null;
      properties.timeoutStart = 0;

      const client = properties.client;
      if (client) {
        client.abort();
        properties.client = null;
      }

      if ((this.readyState === XMLHttpRequest.OPENED && properties.send) ||
          this.readyState === XMLHttpRequest.HEADERS_RECEIVED ||
          this.readyState === XMLHttpRequest.LOADING) {
        // Run the request error steps for event abort
        properties.readyState = XMLHttpRequest.DONE;
        properties.send = false;

        properties.status = 0;
        properties.statusText = "";
        properties.responseCache = properties.responseTextCache = properties.responseXMLCache = null;

        if (flag.synchronous) {
          throw new DOMException(DOMException.ABORT_ERR);
        }

        this.dispatchEvent(new Event("readystatechange"));

        // TODO: spec says this should only be checking upload complete flag?
        if (!(flag.method === "HEAD" || flag.method === "GET")) {
          properties.uploadComplete = true;

          // TODO upload listener

          this.upload.dispatchEvent(new ProgressEvent("abort"));
          if (properties.abortError) {
            // TODO document what this is about (here and below)
            this.upload.dispatchEvent(new ProgressEvent("error"));
          }
          this.upload.dispatchEvent(new ProgressEvent("loadend"));
        }

        this.dispatchEvent(new ProgressEvent("abort"));
        if (properties.abortError) {
          this.dispatchEvent(new ProgressEvent("error"));
        }
        this.dispatchEvent(new ProgressEvent("loadend"));
      }

      if (this.readyState === XMLHttpRequest.DONE) {
        properties.readyState = XMLHttpRequest.UNSENT;

        properties.status = 0;
        properties.statusText = "";
        properties.responseCache = properties.responseTextCache = properties.responseXMLCache = null;
      }
    }
    getAllResponseHeaders() {
      const properties = this[xhrSymbols.properties];
      const readyState = this.readyState;
      if (readyState === XMLHttpRequest.UNSENT || readyState === XMLHttpRequest.OPENED) {
        return "";
      }
      return Object.keys(properties.responseHeaders)
        .filter(key => properties.filteredResponseHeaders.indexOf(key) === -1)
        .map(key => [toByteString(key).toLowerCase(), properties.responseHeaders[key]].join(": "))
        .join("\r\n");
    }

    getResponseHeader(header) {
      const properties = this[xhrSymbols.properties];
      const readyState = this.readyState;
      if (readyState === XMLHttpRequest.UNSENT || readyState === XMLHttpRequest.OPENED) {
        return null;
      }
      const lcHeader = toByteString(header).toLowerCase();
      if (properties.filteredResponseHeaders.find(filtered => lcHeader === filtered.toLowerCase())) {
        return null;
      }
      return getResponseHeader(this, lcHeader);
    }

    open(method, uri, asynchronous, user, password) {
      if (!this._ownerDocument) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }
      const flag = this[xhrSymbols.flag];
      const properties = this[xhrSymbols.properties];
      const argumentCount = arguments.length;
      if (argumentCount < 2) {
        throw new TypeError("Not enough arguments (expected at least 2)");
      }
      method = toByteString(method);
      if (!tokenRegexp.test(method)) {
        throw new DOMException(DOMException.SYNTAX_ERR);
      }
      const upperCaseMethod = method.toUpperCase();
      if (forbiddenRequestMethods.has(upperCaseMethod)) {
        throw new DOMException(DOMException.SECURITY_ERR);
      }

      const client = properties.client;
      if (client && typeof client.abort === "function") {
        client.abort();
      }

      if (allowedRequestMethods.has(upperCaseMethod)) {
        method = upperCaseMethod;
      }
      if (typeof asynchronous !== "undefined") {
        flag.synchronous = !asynchronous;
      } else {
        flag.synchronous = false;
      }
      if (flag.responseType && flag.synchronous) {
        throw new DOMException(DOMException.INVALID_ACCESS_ERR);
      }
      if (flag.synchronous && flag.timeout) {
        throw new DOMException(DOMException.INVALID_ACCESS_ERR);
      }
      flag.method = method;

      let urlObj;
      try {
        urlObj = new URL(uri, documentBaseURLSerialized(this._ownerDocument));
      } catch (e) {
        throw new DOMException(DOMException.SYNTAX_ERR);
      }

      if (user || (password && !urlObj.username)) {
        flag.auth = {
          user,
          pass: password
        };
        urlObj.username = "";
        urlObj.password = "";
      }

      flag.uri = urlObj.href;
      flag.requestHeaders = {};
      flag.preflight = false;

      properties.send = false;
      properties.requestBuffer = null;
      properties.requestCache = null;
      properties.abortError = false;
      properties.responseURL = "";
      readyStateChange(this, XMLHttpRequest.OPENED);
    }

    overrideMimeType(mime) {
      mime = String(mime);

      const readyState = this.readyState;
      if (readyState === XMLHttpRequest.LOADING || readyState === XMLHttpRequest.DONE) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }

      this[xhrSymbols.flag].overrideMIMEType = "application/octet-stream";

      const parsed = parseContentType(mime);
      if (parsed) {
        this[xhrSymbols.flag].overrideMIMEType = parsed.type + "/" + parsed.subtype;

        const charset = parsed.get("charset");
        if (charset) {
          this[xhrSymbols.flag].overrideCharset = whatwgEncoding.labelToName(charset);
        }
      }
    }

    send(body) {
      body = coerceBodyArg(body);

      // Not per spec, but per tests: https://github.com/whatwg/xhr/issues/65
      if (!this._ownerDocument) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }

      const flag = this[xhrSymbols.flag];
      const properties = this[xhrSymbols.properties];

      if (this.readyState !== XMLHttpRequest.OPENED || properties.send) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }

      properties.beforeSend = true;

      try {
        if (flag.method === "GET" || flag.method === "HEAD") {
          body = null;
        }

        if (body !== null) {
          let encoding = null;
          let mimeType = null;

          if (Document.isImpl(body)) {
            encoding = "UTF-8";
            mimeType = (body._parsingMode === "html" ? "text/html" : "application/xml") + ";charset=UTF-8";
            flag.body = domToHtml([body]);
          } else {
            if (typeof body === "string") {
              encoding = "UTF-8";
            }
            const { buffer, formData, contentType } = extractBody(body);
            mimeType = contentType;
            flag.body = buffer || formData;
            flag.formData = Boolean(formData);
          }

          const existingContentType = xhrUtils.getRequestHeader(flag.requestHeaders, "content-type");
          if (mimeType !== null && existingContentType === null) {
            flag.requestHeaders["Content-Type"] = mimeType;
          } else if (existingContentType !== null && encoding !== null) {
            const parsed = parseContentType(existingContentType);
            if (parsed) {
              for (const param of parsed.parameterList) {
                if (param.key && param.key.toLowerCase() === "charset") {
                  if (param.value.toLowerCase() !== encoding.toLowerCase()) {
                    param.value = encoding;
                  }
                }
              }
              xhrUtils.updateRequestHeader(flag.requestHeaders, "content-type", parsed.toString());
            }
          }
        }
      } finally {
        if (properties.beforeSend) {
          properties.beforeSend = false;
        } else {
          throw new DOMException(DOMException.INVALID_STATE_ERR);
        }
      }

      // request doesn't like zero-length bodies
      if (flag.body && flag.body.byteLength === 0) {
        flag.body = null;
      }

      if (flag.synchronous) {
        const flagStr = JSON.stringify(flag, function (k, v) {
          if (this === flag && k === "requestManager") {
            return null;
          }
          if (this === flag && k === "pool" && v) {
            return { maxSockets: v.maxSockets };
          }
          return v;
        });
        const res = spawnSync(
          process.execPath,
          [syncWorkerFile],
          { input: flagStr }
        );
        if (res.status !== 0) {
          throw new Error(res.stderr.toString());
        }
        if (res.error) {
          if (typeof res.error === "string") {
            res.error = new Error(res.error);
          }
          throw res.error;
        }
        const response = JSON.parse(res.stdout.toString(), (k, v) => {
          if (k === "responseBuffer" && v && v.data) {
            return new Buffer(v.data);
          }
          if (k === "cookieJar" && v) {
            return tough.CookieJar.deserializeSync(v, this._ownerDocument._cookieJar.store);
          }
          return v;
        });
        response.properties.readyState = XMLHttpRequest.LOADING;
        this[xhrSymbols.properties] = response.properties;

        if (response.properties.error) {
          dispatchError(this);
          throw new DOMException(DOMException.NETWORK_ERR, response.properties.error);
        } else {
          const responseBuffer = this[xhrSymbols.properties].responseBuffer;
          const contentLength = getResponseHeader(this, "content-length") || "0";
          const bufferLength = parseInt(contentLength) || responseBuffer.length;
          const progressObj = { lengthComputable: false };
          if (bufferLength !== 0) {
            progressObj.total = bufferLength;
            progressObj.loaded = bufferLength;
            progressObj.lengthComputable = true;
          }
          this.dispatchEvent(new ProgressEvent("progress", progressObj));
          readyStateChange(this, XMLHttpRequest.DONE);
          this.dispatchEvent(new ProgressEvent("load", progressObj));
          this.dispatchEvent(new ProgressEvent("loadend", progressObj));
        }
      } else {
        properties.send = true;

        this.dispatchEvent(new ProgressEvent("loadstart"));

        const client = xhrUtils.createClient(this);

        properties.client = client;
        // For new client, reset totalReceivedChunkSize and bufferStepSize
        properties.totalReceivedChunkSize = 0;
        properties.bufferStepSize = 1 * 1024 * 1024;

        properties.origin = flag.origin;

        client.on("error", err => {
          client.removeAllListeners();
          properties.error = err;
          dispatchError(this);
        });

        client.on("response", res => receiveResponse(this, res));

        client.on("redirect", () => {
          const response = client.response;
          const destUrlObj = new URL(response.request.headers.Referer);

          const urlObj = new URL(response.request.uri.href);

          if (destUrlObj.origin !== urlObj.origin && destUrlObj.origin !== flag.origin) {
            properties.origin = "null";
          }

          response.request.headers.Origin = properties.origin;

          if (flag.origin !== destUrlObj.origin &&
              destUrlObj.protocol !== "data:") {
            if (!validCORSHeaders(this, response, flag, properties, flag.origin)) {
              return;
            }
            if (urlObj.username || urlObj.password) {
              properties.error = "Userinfo forbidden in cors redirect";
              dispatchError(this);
              return;
            }
          }
        });
        if (body !== null && body !== "") {
          properties.uploadComplete = false;
          setDispatchProgressEvents(this);
        } else {
          properties.uploadComplete = true;
        }
        if (this.timeout > 0) {
          properties.timeoutStart = (new Date()).getTime();
          properties.timeoutFn = () => {
            client.abort();
            if (!(this.readyState === XMLHttpRequest.UNSENT ||
                (this.readyState === XMLHttpRequest.OPENED && !properties.send) ||
                this.readyState === XMLHttpRequest.DONE)) {
              properties.send = false;
              let stateChanged = false;
              if (!(flag.method === "HEAD" || flag.method === "GET")) {
                this.upload.dispatchEvent(new ProgressEvent("progress"));
                readyStateChange(this, XMLHttpRequest.DONE);
                this.upload.dispatchEvent(new ProgressEvent("timeout"));
                this.upload.dispatchEvent(new ProgressEvent("loadend"));
                stateChanged = true;
              }
              this.dispatchEvent(new ProgressEvent("progress"));
              if (!stateChanged) {
                readyStateChange(this, XMLHttpRequest.DONE);
              }
              this.dispatchEvent(new ProgressEvent("timeout"));
              this.dispatchEvent(new ProgressEvent("loadend"));
            }
            properties.readyState = XMLHttpRequest.UNSENT;
          };
          properties.timeoutId = setTimeout(properties.timeoutFn, this.timeout);
        }
      }
      flag.body = undefined;
      flag.formData = false;
    }

    setRequestHeader(header, value) {
      const flag = this[xhrSymbols.flag];
      const properties = this[xhrSymbols.properties];

      if (arguments.length !== 2) {
        throw new TypeError("2 arguments required for setRequestHeader");
      }
      header = toByteString(header);
      value = toByteString(value);

      if (this.readyState !== XMLHttpRequest.OPENED || properties.send) {
        throw new DOMException(DOMException.INVALID_STATE_ERR);
      }

      value = normalizeHeaderValue(value);

      if (!tokenRegexp.test(header) || !fieldValueRegexp.test(value)) {
        throw new DOMException(DOMException.SYNTAX_ERR);
      }

      const lcHeader = header.toLowerCase();

      if (forbiddenRequestHeaders.has(lcHeader) || lcHeader.startsWith("sec-") || lcHeader.startsWith("proxy-")) {
        return;
      }

      const keys = Object.keys(flag.requestHeaders);
      let n = keys.length;
      while (n--) {
        const key = keys[n];
        if (key.toLowerCase() === lcHeader) {
          flag.requestHeaders[key] += ", " + value;
          return;
        }
      }
      flag.requestHeaders[header] = value;
    }

    get _ownerDocument() {
      return idlUtils.implForWrapper(window.document);
    }
  }

  Object.defineProperty(XMLHttpRequest.prototype, Symbol.toStringTag, {
    value: "XMLHttpRequest",
    writable: false,
    enumerable: false,
    configurable: true
  });

  addConstants(XMLHttpRequest, {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
  });

  function readyStateChange(xhr, readyState) {
    const properties = xhr[xhrSymbols.properties];
    if (properties.readyState === readyState) {
      return;
    }

    properties.readyState = readyState;

    const readyStateChangeEvent = new Event("readystatechange");
    xhr.dispatchEvent(readyStateChangeEvent);
  }

  function receiveResponse(xhr, response) {
    const properties = xhr[xhrSymbols.properties];
    const flag = xhr[xhrSymbols.flag];

    const statusCode = response.statusCode;

    let byteOffset = 0;

    const headers = {};
    const filteredResponseHeaders = [];
    const headerMap = {};
    const rawHeaders = response.rawHeaders;
    const n = Number(rawHeaders.length);
    for (let i = 0; i < n; i += 2) {
      const k = rawHeaders[i];
      const kl = k.toLowerCase();
      const v = rawHeaders[i + 1];
      if (uniqueResponseHeaders.has(kl)) {
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

    const destUrlObj = new URL(response.request.uri.href);
    if (properties.origin !== destUrlObj.origin &&
        destUrlObj.protocol !== "data:") {
      if (!validCORSHeaders(xhr, response, flag, properties, properties.origin)) {
        return;
      }
      const acehStr = response.headers["access-control-expose-headers"];
      const aceh = new Set(acehStr ? acehStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
      for (const header in headers) {
        const lcHeader = header.toLowerCase();
        if (!corsSafeResponseHeaders.has(lcHeader) && !aceh.has(lcHeader)) {
          filteredResponseHeaders.push(header);
        }
      }
    }

    for (const header in headers) {
      const lcHeader = header.toLowerCase();
      if (forbiddenResponseHeaders.has(lcHeader)) {
        filteredResponseHeaders.push(header);
      }
    }

    properties.responseURL = destUrlObj.href;

    properties.status = statusCode;
    properties.statusText = response.statusMessage || HTTP_STATUS_CODES[statusCode] || "";

    properties.responseHeaders = headers;
    properties.filteredResponseHeaders = filteredResponseHeaders;

    const contentLength = getResponseHeader(xhr, "content-length") || "0";
    const bufferLength = parseInt(contentLength) || 0;
    const progressObj = { lengthComputable: false };
    let lastProgressReported;
    if (bufferLength !== 0) {
      progressObj.total = bufferLength;
      progressObj.loaded = 0;
      progressObj.lengthComputable = true;
    }
    // pre-allocate buffer.
    properties.responseBuffer = Buffer.alloc(properties.bufferStepSize);
    properties.responseCache = null;
    properties.responseTextCache = null;
    properties.responseXMLCache = null;
    readyStateChange(xhr, XMLHttpRequest.HEADERS_RECEIVED);

    if (!properties.client) {
      // The request was aborted in reaction to the readystatechange event.
      return;
    }

    // Can't use the client since the client gets the post-ungzipping bytes (which can be greater than the
    // Content-Length).
    response.on("data", chunk => {
      byteOffset += chunk.length;
      progressObj.loaded = byteOffset;
    });

    properties.client.on("data", chunk => {
      properties.totalReceivedChunkSize += chunk.length;
      if (properties.totalReceivedChunkSize >= properties.bufferStepSize) {
        properties.bufferStepSize *= 2;
        while (properties.totalReceivedChunkSize >= properties.bufferStepSize) {
          properties.bufferStepSize *= 2;
        }
        const tmpBuf = Buffer.alloc(properties.bufferStepSize);
        properties.responseBuffer = Buffer.concat([properties.responseBuffer, chunk]);
        properties.responseBuffer.copy(tmpBuf, 0, 0, properties.responseBuffer.length);
        properties.responseBuffer = tmpBuf;
      } else {
        chunk.copy(properties.responseBuffer, properties.totalReceivedChunkSize - chunk.length, 0, chunk.length);
      }
      properties.responseCache = null;
      properties.responseTextCache = null;
      properties.responseXMLCache = null;

      if (properties.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        properties.readyState = XMLHttpRequest.LOADING;
      }
      xhr.dispatchEvent(new Event("readystatechange"));

      if (progressObj.total !== progressObj.loaded || properties.totalReceivedChunkSize === byteOffset) {
        if (lastProgressReported !== progressObj.loaded) {
          // This is a necessary check in the gzip case where we can be getting new data from the client, as it
          // un-gzips, but no new data has been gotten from the response, so we should not fire a progress event.
          lastProgressReported = progressObj.loaded;
          xhr.dispatchEvent(new ProgressEvent("progress", progressObj));
        }
      }
    });
    properties.client.on("end", () => {
      clearTimeout(properties.timeoutId);
      properties.timeoutFn = null;
      properties.timeoutStart = 0;
      properties.client = null;
      xhr.dispatchEvent(new ProgressEvent("progress", progressObj));
      readyStateChange(xhr, XMLHttpRequest.DONE);
      xhr.dispatchEvent(new ProgressEvent("load", progressObj));
      xhr.dispatchEvent(new ProgressEvent("loadend", progressObj));
    });
  }

  function setDispatchProgressEvents(xhr) {
    const properties = xhr[xhrSymbols.properties];
    const client = properties.client;
    const upload = xhr.upload;

    let total = 0;
    let lengthComputable = false;
    const length = client.headers && parseInt(xhrUtils.getRequestHeader(client.headers, "content-length"));
    if (length) {
      total = length;
      lengthComputable = true;
    }
    const initProgress = {
      lengthComputable,
      total,
      loaded: 0
    };
    upload.dispatchEvent(new ProgressEvent("loadstart", initProgress));

    client.on("request", req => {
      req.on("response", () => {
        properties.uploadComplete = true;
        const progress = {
          lengthComputable,
          total,
          loaded: total
        };
        upload.dispatchEvent(new ProgressEvent("progress", progress));
        upload.dispatchEvent(new ProgressEvent("load", progress));
        upload.dispatchEvent(new ProgressEvent("loadend", progress));
      });
    });
  }

  function dispatchError(xhr) {
    const properties = xhr[xhrSymbols.properties];
    readyStateChange(xhr, XMLHttpRequest.DONE);
    if (!properties.uploadComplete) {
      xhr.upload.dispatchEvent(new ProgressEvent("error"));
      xhr.upload.dispatchEvent(new ProgressEvent("loadend"));
    }
    xhr.dispatchEvent(new ProgressEvent("error"));
    xhr.dispatchEvent(new ProgressEvent("loadend"));
    if (xhr._ownerDocument) {
      const error = new Error(properties.error);
      error.type = "XMLHttpRequest";

      xhr._ownerDocument._defaultView._virtualConsole.emit("jsdomError", error);
    }
  }

  function validCORSHeaders(xhr, response, flag, properties, origin) {
    const acaoStr = response.headers["access-control-allow-origin"];
    const acao = acaoStr ? acaoStr.trim() : null;
    if (acao !== "*" && acao !== origin) {
      properties.error = "Cross origin " + origin + " forbidden";
      dispatchError(xhr);
      return false;
    }
    const acacStr = response.headers["access-control-allow-credentials"];
    const acac = acacStr ? acacStr.trim() : null;
    if (flag.withCredentials && acac !== "true") {
      properties.error = "Credentials forbidden";
      dispatchError(xhr);
      return false;
    }
    const acahStr = response.headers["access-control-allow-headers"];
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

  function toByteString(value) {
    value = String(value);
    if (!/^[\0-\xFF]*$/.test(value)) {
      throw new TypeError("invalid ByteString");
    }
    return value;
  }

  function finalMIMEType(xhr) {
    const flag = xhr[xhrSymbols.flag];
    return parseContentType(flag.overrideMIMEType || getResponseHeader(xhr, "content-type"));
  }

  function finalCharset(xhr) {
    const flag = xhr[xhrSymbols.flag];
    if (flag.overrideCharset) {
      return flag.overrideCharset;
    }
    const parsedContentType = parseContentType(getResponseHeader(xhr, "content-type"));
    if (parsedContentType) {
      return whatwgEncoding.labelToName(parsedContentType.get("charset"));
    }
    return null;
  }

  function getResponseHeader(xhr, lcHeader) {
    const properties = xhr[xhrSymbols.properties];
    const keys = Object.keys(properties.responseHeaders);
    let n = keys.length;
    while (n--) {
      const key = keys[n];
      if (key.toLowerCase() === lcHeader) {
        return properties.responseHeaders[key];
      }
    }
    return null;
  }

  function normalizeHeaderValue(value) {
    return value.replace(/^[\x09\x0A\x0D\x20]+/, "").replace(/[\x09\x0A\x0D\x20]+$/, "");
  }

  return XMLHttpRequest;
};

function coerceBodyArg(body) {
  // Implements the IDL conversion for `optional (Document or BodyInit)? body = null`

  if (body === undefined || body === null) {
    return null;
  }

  if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
    return body;
  }

  const impl = idlUtils.implForWrapper(body);
  if (impl) {
    // TODO: allow URLSearchParams or ReadableStream
    if (Blob.isImpl(impl) || FormData.isImpl(impl) || Document.isImpl(impl)) {
      return impl;
    }
  }

  return conversions.USVString(body);
}

function extractBody(bodyInit) {
  // https://fetch.spec.whatwg.org/#concept-bodyinit-extract
  // except we represent the body as a Node.js Buffer instead,
  // or a special case for FormData since we want request to handle that. Probably it would be
  // cleaner (and allow a future without request) if we did the form encoding ourself.

  if (Blob.isImpl(bodyInit)) {
    return {
      buffer: bodyInit._buffer,
      contentType: bodyInit.type === "" ? null : bodyInit.type
    };
  } else if (bodyInit instanceof ArrayBuffer) {
    return {
      buffer: new Buffer(new Uint8Array(bodyInit)),
      contentType: null
    };
  } else if (ArrayBuffer.isView(bodyInit)) {
    return {
      buffer: new Buffer(bodyInit.buffer, bodyInit.byteOffset, bodyInit.byteLength),
      contentType: null
    };
  } else if (FormData.isImpl(bodyInit)) {
    const formData = [];
    for (const entry of bodyInit._entries) {
      let val;
      if (Blob.isImpl(entry.value)) {
        const blob = entry.value;
        val = {
          name: entry.name,
          value: blob._buffer,
          options: {
            filename: blob.name,
            contentType: blob.type,
            knownLength: blob.size
          }
        };
      } else {
        val = entry;
      }

      formData.push(val);
    }

    return { formData };
  }

  // Must be a string
  return {
    buffer: new Buffer(bodyInit, "utf-8"),
    contentType: "text/plain;charset=UTF-8"
  };
}
