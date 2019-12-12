"use strict";

const HTTP_STATUS_CODES = require("http").STATUS_CODES;
const { spawnSync } = require("child_process");
const { URL } = require("whatwg-url");
const whatwgEncoding = require("whatwg-encoding");
const tough = require("tough-cookie");
const MIMEType = require("whatwg-mimetype");
const conversions = require("webidl-conversions");

const xhrUtils = require("./xhr-utils");
const DOMException = require("domexception");
const { addConstants } = require("../../utils");
const { documentBaseURLSerialized } = require("../helpers/document-base-url");
const { asciiCaseInsensitiveMatch } = require("../helpers/strings");
const idlUtils = require("../generated/utils");
const Document = require("../generated/Document");
const Blob = require("../generated/Blob");
const FormData = require("../generated/FormData");
const XMLHttpRequestEventTargetImpl = require("./XMLHttpRequestEventTarget-impl").implementation;
const XMLHttpRequestUpload = require("../generated/XMLHttpRequestUpload");
const ProgressEvent = require("../generated/ProgressEvent");
const { parseIntoDocument } = require("../../browser/parser");
const { fragmentSerialization } = require("../domparsing/serialization");
const { setupForSimpleEventAccessors } = require("../helpers/create-event-accessor");
const { parseJSONFromBytes } = require("../helpers/json");
const { fireAnEvent } = require("../helpers/events");

/**
 * @typedef {import("../file-api/Blob-impl.js").implementation} BlobImpl
 * @typedef {import("./FormData-impl.js").implementation} FormDataImpl
 * @typedef {import("../nodes/Document-impl.js")["implementation"]["prototype"]} DocumentImpl
 *
 * @typedef {string | BlobImpl | BufferSource | FormDataImpl } BodyInitImpl
 * @typedef {import("events").EventEmitter & {
  statusCode?: number;
  rawHeaders?: string[];
  headers?: { [header: string]: string };
  request?: { uri: import("whatwg-url").URL };
  abort?(): void;
  response?: import("request").Response;
}} Client
 */

const syncWorkerFile = require.resolve ? require.resolve("./xhr-sync-worker.js") : null;

const tokenRegexp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
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

/** @type {ReadonlySet<XMLHttpRequestResponseType>} */
const XMLHttpRequestResponseType = new Set([
  "",
  "arraybuffer",
  "blob",
  "document",
  "json",
  "text"
]);

/** @type {() => never} */
const ThrowTypeError = (function () {
  return Object.getOwnPropertyDescriptor(arguments, "callee").get;
}());

class XMLHttpRequest extends XMLHttpRequestEventTargetImpl {
  constructor(window) {
    super(window);

    /** @type {import("../../browser/Window")} */
    this._globalObject = window;
    /** @type {import("./XMLHttpRequestUpload-impl.js").implementation} */
    this.upload = XMLHttpRequestUpload.createImpl(window);
    this.upload._ownerDocument = this._ownerDocument;

    /** @type {number} */
    this.readyState = XMLHttpRequest.UNSENT;
    this.responseURL = "";
    this.status = 0;
    this.statusText = "";

    this.flag = {
      synchronous: false,
      withCredentials: false,
      mimeType: null,
      /** @type {{user: string, pass: string} | null} */
      auth: null,
      /** @type {string | undefined} */
      method: undefined,
      /** @type {XMLHttpRequestResponseType} */
      responseType: "",
      requestHeaders: {},
      referrer: this._ownerDocument.URL,
      uri: "",
      timeout: 0,
      /** @type {*} */
      body: undefined,
      formData: false,
      preflight: false,
      requestManager: this._ownerDocument._requestManager,
      strictSSL: window._resourceLoader._strictSSL,
      proxy: window._resourceLoader._proxy,
      /** @type {import("tough-cookie").CookieJar} */
      cookieJar: this._ownerDocument._cookieJar,
      encoding: this._ownerDocument._encoding,
      origin: this._ownerDocument.origin,
      userAgent: window.navigator.userAgent
    };

    this.properties = {
      beforeSend: false,
      send: false,
      /** @type {Client | null} */
      client: null,

      timeoutStart: 0,
      timeoutId: 0,
      timeoutFn: null,

      /** @type {Buffer | null} */
      responseBuffer: null,
      responseCache: null,
      /** @type {string | null} */
      responseTextCache: null,
      /** @type {DocumentImpl | null} */
      responseXMLCache: null,

      responseHeaders: {},
      filteredResponseHeaders: [],

      /** @type {string | Error} */
      error: "",
      uploadComplete: false,
      uploadListener: false,

      // Signifies that we're calling abort() from xhr-utils.js because of a window shutdown.
      // In that case the termination reason is "fatal", not "end-user abort".
      abortError: false,

      /** @type {import("tough-cookie").CookieJar} */
      cookieJar: this._ownerDocument._cookieJar,
      bufferStepSize: 1 * 1024 * 1024, // pre-allocate buffer increase step size. init value is 1MB
      totalReceivedChunkSize: 0
    };

    Object.defineProperties(this, {
      flag: { writable: false },
      properties: { writable: false }
    });

    Object.defineProperties(this.properties, {
      readyState: { configurable: true, get: ThrowTypeError, set: ThrowTypeError },
      responseURL: { configurable: true, get: ThrowTypeError, set: ThrowTypeError },
      status: { configurable: true, get: ThrowTypeError, set: ThrowTypeError },
      statusText: { configurable: true, get: ThrowTypeError, set: ThrowTypeError }
    });
  }

  get responseType() {
    return this.flag.responseType;
  }
  set responseType(responseType) {
    const { flag } = this;
    if (this.readyState === XMLHttpRequest.LOADING || this.readyState === XMLHttpRequest.DONE) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }
    if (this.readyState === XMLHttpRequest.OPENED && flag.synchronous) {
      throw new DOMException("The object does not support the operation or argument.", "InvalidAccessError");
    }
    if (!XMLHttpRequestResponseType.has(responseType)) {
      responseType = "";
    }
    flag.responseType = responseType;
  }

  get response() {
    const { properties } = this;
    if (properties.responseCache) {
      return idlUtils.tryWrapperForImpl(properties.responseCache);
    }
    /** @type {any} */
    let res = "";

    const responseBuffer = properties.responseBuffer ?
      properties.responseBuffer.slice(0, properties.totalReceivedChunkSize) :
      null;

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
        res = Blob.createImpl(this._globalObject, [
          [new Uint8Array(responseBuffer)],
          { type: contentType || "" }
        ]);
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

        try {
          res = parseJSONFromBytes(responseBuffer);
        } catch (e) {
          res = null;
        }
        break;
      }
    }
    properties.responseCache = res;
    // For whatever reason, WebIDL2JS doesn't generate
    // the following for the `any` type:
    return idlUtils.tryWrapperForImpl(res);
  }
  get responseText() {
    const { properties } = this;
    if (this.responseType !== "" && this.responseType !== "text") {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }
    if (this.readyState !== XMLHttpRequest.LOADING && this.readyState !== XMLHttpRequest.DONE) {
      return "";
    }
    if (properties.responseTextCache) {
      return properties.responseTextCache;
    }
    const responseBuffer = properties.responseBuffer ?
      properties.responseBuffer.slice(0, properties.totalReceivedChunkSize) :
      null;

    if (!responseBuffer) {
      return "";
    }

    const fallbackEncoding = finalCharset(this) || whatwgEncoding.getBOMEncoding(responseBuffer) || "UTF-8";
    const res = whatwgEncoding.decode(responseBuffer, fallbackEncoding);

    properties.responseTextCache = res;
    return res;
  }
  get responseXML() {
    const { flag, properties } = this;
    if (this.responseType !== "" && this.responseType !== "document") {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }
    if (this.readyState !== XMLHttpRequest.DONE) {
      return null;
    }
    if (properties.responseXMLCache) {
      return properties.responseXMLCache;
    }
    const responseBuffer = properties.responseBuffer ?
      properties.responseBuffer.slice(0, properties.totalReceivedChunkSize) :
      null;

    if (!responseBuffer) {
      return null;
    }

    const contentType = finalMIMEType(this);
    let isHTML = false;
    let isXML = false;
    const parsed = MIMEType.parse(contentType);
    if (parsed) {
      isHTML = parsed.isHTML();
      isXML = parsed.isXML();
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
    /** @type {DocumentImpl} */
    const res = Document.createImpl(this._globalObject, [], {
      options: {
        url: flag.uri,
        lastModified: new Date(getResponseHeader(this, "last-modified")),
        parsingMode: isHTML ? "html" : "xml",
        cookieJar: { setCookieSync: () => undefined, getCookieStringSync: () => "" },
        encoding,
        parseOptions: this._ownerDocument._parseOptions
      }
    });
    try {
      parseIntoDocument(resText, res);
    } catch (e) {
      properties.responseXMLCache = null;
      return null;
    }
    res.close();
    properties.responseXMLCache = res;
    return res;
  }

  get timeout() {
    return this.flag.timeout;
  }
  set timeout(val) {
    const { flag, properties } = this;
    if (flag.synchronous) {
      throw new DOMException("The object does not support the operation or argument.", "InvalidAccessError");
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
    return this.flag.withCredentials;
  }
  set withCredentials(val) {
    const { flag, properties } = this;
    if (!(this.readyState === XMLHttpRequest.UNSENT || this.readyState === XMLHttpRequest.OPENED)) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }
    if (properties.send) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }
    flag.withCredentials = val;
  }

  abort() {
    const { properties } = this;
    // Terminate the request
    clearTimeout(properties.timeoutId);
    properties.timeoutFn = null;
    properties.timeoutStart = 0;

    const { client } = properties;
    if (client) {
      client.abort();
      properties.client = null;
    }

    if (properties.abortError) {
      // Special case that ideally shouldn't be going through the public API at all.
      // Run the https://xhr.spec.whatwg.org/#handle-errors "fatal" steps.
      this.readyState = XMLHttpRequest.DONE;
      properties.send = false;
      xhrUtils.setResponseToNetworkError(this);
      return;
    }

    if ((this.readyState === XMLHttpRequest.OPENED && properties.send) ||
        this.readyState === XMLHttpRequest.HEADERS_RECEIVED ||
        this.readyState === XMLHttpRequest.LOADING) {
      xhrUtils.requestErrorSteps(this, "abort");
    }

    if (this.readyState === XMLHttpRequest.DONE) {
      this.readyState = XMLHttpRequest.UNSENT;

      xhrUtils.setResponseToNetworkError(this);
    }
  }
  getAllResponseHeaders() {
    const { properties, readyState } = this;
    if (readyState === XMLHttpRequest.UNSENT || readyState === XMLHttpRequest.OPENED) {
      return "";
    }
    return Object.keys(properties.responseHeaders)
      .filter(key => properties.filteredResponseHeaders.indexOf(key) === -1)
      .map(key => [conversions.ByteString(key).toLowerCase(), properties.responseHeaders[key]].join(": "))
      .join("\r\n");
  }

  /** @param {string} header */
  getResponseHeader(header) {
    const { properties, readyState } = this;
    if (readyState === XMLHttpRequest.UNSENT || readyState === XMLHttpRequest.OPENED) {
      return null;
    }
    const lcHeader = conversions.ByteString(header).toLowerCase();
    if (properties.filteredResponseHeaders.find(filtered => lcHeader === filtered.toLowerCase())) {
      return null;
    }
    return getResponseHeader(this, lcHeader);
  }

  /**
   * @param {string} method
   * @param {string} uri
   * @param {boolean} [asynchronous]
   * @param {string | null} [user]
   * @param {string | null} [password]
   */
  open(method, uri, asynchronous, user, password) {
    if (!this._ownerDocument) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }
    const { flag, properties } = this;

    if (!tokenRegexp.test(method)) {
      throw new DOMException("The string did not match the expected pattern.", "SyntaxError");
    }
    const upperCaseMethod = method.toUpperCase();
    if (forbiddenRequestMethods.has(upperCaseMethod)) {
      throw new DOMException("The operation is insecure.", "SecurityError");
    }

    const { client } = properties;
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
      throw new DOMException("The object does not support the operation or argument.", "InvalidAccessError");
    }
    if (flag.synchronous && flag.timeout) {
      throw new DOMException("The object does not support the operation or argument.", "InvalidAccessError");
    }
    flag.method = method;

    let urlObj;
    try {
      urlObj = new URL(uri, documentBaseURLSerialized(this._ownerDocument));
    } catch (e) {
      throw new DOMException("The string did not match the expected pattern.", "SyntaxError");
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
    properties.uploadListener = false;
    properties.abortError = false;
    this.responseURL = "";
    readyStateChange(this, XMLHttpRequest.OPENED);
  }

  /** @param {string} mime */
  overrideMimeType(mime) {
    const { readyState } = this;
    if (readyState === XMLHttpRequest.LOADING || readyState === XMLHttpRequest.DONE) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }

    this.flag.overrideMIMEType = "application/octet-stream";

    // Waiting for better spec: https://github.com/whatwg/xhr/issues/157
    const parsed = MIMEType.parse(mime);
    if (parsed) {
      this.flag.overrideMIMEType = parsed.essence;

      const charset = parsed.parameters.get("charset");
      if (charset) {
        this.flag.overrideCharset = whatwgEncoding.labelToName(charset);
      }
    }
  }

  /** @param {DocumentImpl | BodyInitImpl | null} body */
  send(body) {
    // Not per spec, but per tests: https://github.com/whatwg/xhr/issues/65
    if (!this._ownerDocument) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }

    const { flag, properties, upload } = this;

    if (this.readyState !== XMLHttpRequest.OPENED || properties.send) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
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
          flag.body = fragmentSerialization(body, { requireWellFormed: false });
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
          // Waiting for better spec: https://github.com/whatwg/xhr/issues/188. This seems like a good guess at what
          // the spec will be, in the meantime.
          const parsed = MIMEType.parse(existingContentType);
          if (parsed) {
            const charset = parsed.parameters.get("charset");
            if (charset && !asciiCaseInsensitiveMatch(charset, encoding) && encoding !== null) {
              parsed.parameters.set("charset", encoding);
              xhrUtils.updateRequestHeader(flag.requestHeaders, "content-type", parsed.toString());
            }
          }
        }
      }
    } finally {
      if (properties.beforeSend) {
        properties.beforeSend = false;
      } else {
        throw new DOMException("The object is in an invalid state.", "InvalidStateError");
      }
    }

    if (Object.keys(upload._eventListeners).length > 0) {
      properties.uploadListener = true;
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
        { input: flagStr, maxBuffer: Infinity }
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

      /** @type {{ responseURL: string; status: number; statusText: string; properties: any }} */
      const response = JSON.parse(res.stdout.toString());
      if (response.properties.responseBuffer && response.properties.responseBuffer.data) {
        response.properties.responseBuffer = Buffer.from(response.properties.responseBuffer.data);
      }
      if (response.properties.cookieJar) {
        response.properties.cookieJar = tough.CookieJar.deserializeSync(
          response.properties.cookieJar,
          this._ownerDocument._cookieJar.store
        );
      }

      this.readyState = XMLHttpRequest.LOADING;
      this.status = response.status;
      this.statusText = response.statusText;
      this.responseURL = response.responseURL;
      Object.assign(this.properties, response.properties);

      if (response.properties.error) {
        xhrUtils.dispatchError(this);
        throw new DOMException(response.properties.error, "NetworkError");
      } else {
        const { responseBuffer } = this.properties;
        const contentLength = getResponseHeader(this, "content-length") || "0";
        const bufferLength = parseInt(contentLength) || responseBuffer.length;
        const progressObj = { lengthComputable: false };
        if (bufferLength !== 0) {
          progressObj.total = bufferLength;
          progressObj.loaded = bufferLength;
          progressObj.lengthComputable = true;
        }
        fireAnEvent("progress", this, ProgressEvent, progressObj);
        readyStateChange(this, XMLHttpRequest.DONE);
        fireAnEvent("load", this, ProgressEvent, progressObj);
        fireAnEvent("loadend", this, ProgressEvent, progressObj);
      }
    } else {
      properties.send = true;

      fireAnEvent("loadstart", this, ProgressEvent);

      /** @type {Client} */
      const client = xhrUtils.createClient(this);

      properties.client = client;
      // For new client, reset totalReceivedChunkSize and bufferStepSize
      properties.totalReceivedChunkSize = 0;
      properties.bufferStepSize = 1 * 1024 * 1024;

      properties.origin = flag.origin;

      client.on("error", err => {
        client.removeAllListeners();
        properties.error = err;
        xhrUtils.dispatchError(this);
      });

      client.on("response", res => receiveResponse(this, res));

      client.on("redirect", () => {
        const { response } = client;
        const destUrlObj = new URL(response.request.headers.Referer);

        const urlObj = new URL(response.request.uri.href);

        if (destUrlObj.origin !== urlObj.origin && destUrlObj.origin !== flag.origin) {
          properties.origin = "null";
        }

        response.request.headers.Origin = properties.origin;

        if (flag.origin !== destUrlObj.origin &&
            destUrlObj.protocol !== "data:") {
          if (!xhrUtils.validCORSHeaders(this, response, flag, properties, flag.origin)) {
            return;
          }
          if (urlObj.username || urlObj.password) {
            properties.error = "Userinfo forbidden in cors redirect";
            xhrUtils.dispatchError(this);
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
            if (!properties.uploadComplete) {
              fireAnEvent("progress", upload, ProgressEvent);
              readyStateChange(this, XMLHttpRequest.DONE);
              fireAnEvent("timeout", upload, ProgressEvent);
              fireAnEvent("loadend", upload, ProgressEvent);
              stateChanged = true;
            }
            fireAnEvent("progress", this, ProgressEvent);
            if (!stateChanged) {
              readyStateChange(this, XMLHttpRequest.DONE);
            }
            fireAnEvent("timeout", this, ProgressEvent);
            fireAnEvent("loadend", this, ProgressEvent);
          }
          this.readyState = XMLHttpRequest.UNSENT;
        };
        properties.timeoutId = setTimeout(properties.timeoutFn, this.timeout);
      }
    }
  }

  /**
   * @param {string} header
   * @param {string} value
   */
  setRequestHeader(header, value) {
    const { flag, properties } = this;

    if (arguments.length !== 2) {
      throw new TypeError("2 arguments required for setRequestHeader");
    }
    header = conversions.ByteString(header);
    value = conversions.ByteString(value);

    if (this.readyState !== XMLHttpRequest.OPENED || properties.send) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }

    value = normalizeHeaderValue(value);

    if (!tokenRegexp.test(header) || !fieldValueRegexp.test(value)) {
      throw new DOMException("The string did not match the expected pattern.", "SyntaxError");
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

  /** @return {DocumentImpl} */
  get _ownerDocument() {
    return idlUtils.implForWrapper(this._globalObject._document);
  }
}

setupForSimpleEventAccessors(XMLHttpRequest.prototype, ["readystatechange"]);

addConstants(XMLHttpRequest, {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
});

/**
 * @param {XMLHttpRequest} xhr
 * @param {number} readyState
 */
function readyStateChange(xhr, readyState) {
  if (xhr.readyState === readyState) {
    return;
  }

  xhr.readyState = readyState;

  fireAnEvent("readystatechange", xhr);
}

/**
 * @param {XMLHttpRequest} xhr
 * @param {{ statusCode: number; rawHeaders: string[]; headers: {[k: string]: any}, request: { uri: any } }} response
 */
function receiveResponse(xhr, response) {
  const { flag, properties } = xhr;
  const { statusCode } = response;

  let byteOffset = 0;

  const headers = {};
  const filteredResponseHeaders = [];
  const headerMap = {};
  const { rawHeaders } = response;
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
    if (!xhrUtils.validCORSHeaders(xhr, response, flag, properties, properties.origin)) {
      return;
    }
    const acehStr = response.headers["access-control-expose-headers"];
    const aceh = new Set(acehStr ? acehStr.trim().toLowerCase().split(xhrUtils.headerListSeparatorRegexp) : []);
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

  xhr.responseURL = destUrlObj.href;

  xhr.status = statusCode;
  xhr.statusText = response.statusMessage || HTTP_STATUS_CODES[statusCode] || "";

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
      properties.responseBuffer.copy(tmpBuf, 0, 0, properties.responseBuffer.length);
      properties.responseBuffer = tmpBuf;
    }
    chunk.copy(properties.responseBuffer, properties.totalReceivedChunkSize - chunk.length, 0, chunk.length);
    properties.responseCache = null;
    properties.responseTextCache = null;
    properties.responseXMLCache = null;

    if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      xhr.readyState = XMLHttpRequest.LOADING;
    }
    fireAnEvent("readystatechange", xhr);

    if (progressObj.total !== progressObj.loaded || properties.totalReceivedChunkSize === byteOffset) {
      if (lastProgressReported !== progressObj.loaded) {
        // This is a necessary check in the gzip case where we can be getting new data from the client, as it
        // un-gzips, but no new data has been gotten from the response, so we should not fire a progress event.
        lastProgressReported = progressObj.loaded;
        fireAnEvent("progress", xhr, ProgressEvent, progressObj);
      }
    }
  });
  properties.client.on("end", () => {
    clearTimeout(properties.timeoutId);
    properties.timeoutFn = null;
    properties.timeoutStart = 0;
    properties.client = null;
    fireAnEvent("progress", xhr, ProgressEvent, progressObj);
    readyStateChange(xhr, XMLHttpRequest.DONE);
    fireAnEvent("load", xhr, ProgressEvent, progressObj);
    fireAnEvent("loadend", xhr, ProgressEvent, progressObj);
  });
}

/**
 * @param {XMLHttpRequest} xhr
 */
function setDispatchProgressEvents(xhr) {
  const { properties, upload } = xhr;
  const { client } = properties;

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

  if (properties.uploadListener) {
    fireAnEvent("loadstart", upload, ProgressEvent, initProgress);
  }

  client.on("request", req => {
    req.on("response", () => {
      properties.uploadComplete = true;

      if (!properties.uploadListener) {
        return;
      }

      const progress = {
        lengthComputable,
        total,
        loaded: total
      };
      fireAnEvent("progress", upload, ProgressEvent, progress);
      fireAnEvent("load", upload, ProgressEvent, progress);
      fireAnEvent("loadend", upload, ProgressEvent, progress);
    });
  });
}

/** @param {XMLHttpRequest} xhr */
function finalMIMEType(xhr) {
  const { flag } = xhr;
  return flag.overrideMIMEType || getResponseHeader(xhr, "content-type");
}

/** @param {XMLHttpRequest} xhr */
function finalCharset(xhr) {
  const { flag } = xhr;
  if (flag.overrideCharset) {
    return flag.overrideCharset;
  }
  const parsedContentType = MIMEType.parse(getResponseHeader(xhr, "content-type"));
  if (parsedContentType) {
    return whatwgEncoding.labelToName(parsedContentType.parameters.get("charset"));
  }
  return null;
}

/** @param {XMLHttpRequest} xhr */
function getResponseHeader(xhr, lcHeader) {
  const { properties } = xhr;
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

/** @param {BodyInitImpl} bodyInit */
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
      buffer: Buffer.from(bodyInit),
      contentType: null
    };
  } else if (ArrayBuffer.isView(bodyInit)) {
    return {
      buffer: Buffer.from(bodyInit.buffer, bodyInit.byteOffset, bodyInit.byteLength),
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
    buffer: Buffer.from(bodyInit, "utf-8"),
    contentType: "text/plain;charset=UTF-8"
  };
}

exports.implementation = XMLHttpRequest;
