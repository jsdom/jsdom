"use strict";

const HTTP_STATUS_CODES = require("http").STATUS_CODES;
const { spawnSync } = require("child_process");
const { URL } = require("whatwg-url");
const { getBOMEncoding, labelToName, legacyHookDecode } = require("@exodus/bytes/encoding.js");
const { utf8Encode } = require("../helpers/encoding");
const tough = require("tough-cookie");
const MIMEType = require("whatwg-mimetype");
const { isHeaderName, isHeaderValue, normalizeHeaderValue } = require("../fetch/Headers-impl");
const HeaderList = require("../fetch/header-list");
const xhrUtils = require("./xhr-utils");
const DOMException = require("../generated/DOMException");
const { asciiCaseInsensitiveMatch } = require("../helpers/strings");
const idlUtils = require("../generated/utils");
const Document = require("../generated/Document");
const Blob = require("../generated/Blob");
const FormData = require("../generated/FormData");
const XMLHttpRequestEventTargetImpl = require("./XMLHttpRequestEventTarget-impl").implementation;
const XMLHttpRequestUpload = require("../generated/XMLHttpRequestUpload");
const ProgressEvent = require("../generated/ProgressEvent");
const { isArrayBuffer } = require("../generated/utils");
const { parseIntoDocument } = require("../../browser/parser");
const { fragmentSerialization } = require("../domparsing/serialization");
const { setupForSimpleEventAccessors } = require("../helpers/create-event-accessor");
const { parseJSONFromBytes } = require("../helpers/json");
const { fireAnEvent } = require("../helpers/events");
const { copyToArrayBufferInTargetRealmDestructively, concatTypedArrays } = require("../helpers/binary-data");
const { serializeEntryList } = require("./multipart-form-data.js");
const { isForbidden: isForbiddenRequestHeader } = require("../fetch/header-types");

const { READY_STATES, headerListSeparatorRegexp, simpleHeaders } = xhrUtils;

const syncWorkerFile = require.resolve ? require.resolve("./xhr-sync-worker.js") : null;

const tokenRegexp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

const utf8Decoder = new TextDecoder();

const forbiddenResponseHeaders = new Set([
  "set-cookie",
  "set-cookie2"
]);
const corsSafeResponseHeaders = new Set([
  "cache-control",
  "content-language",
  "content-length",
  "content-type",
  "expires",
  "last-modified",
  "pragma"
]);

const allowedRequestMethods = new Set(["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE"]);
const forbiddenRequestMethods = new Set(["TRACK", "TRACE", "CONNECT"]);

// Helper functions for error handling (moved from xhr-utils.js since they fire DOM events)

function dispatchError(xhr, errMessage) {
  // Store the error message for sync XHR worker to serialize
  xhr.properties.error = errMessage;
  requestErrorSteps(xhr, "error", DOMException.create(xhr._globalObject, [errMessage, "NetworkError"]));
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

  properties.responseBytes =
    properties.responseCache =
    properties.responseTextCache =
    properties.responseXMLCache = null;

  properties.responseHeaders = new HeaderList();
  xhr.status = 0;
  xhr.statusText = "";
}

class XMLHttpRequestImpl extends XMLHttpRequestEventTargetImpl {
  constructor(window) {
    super(window);

    // Avoid running `_ownerDocument` getter multiple times in the constructor:
    const { _ownerDocument } = this;

    this.upload = XMLHttpRequestUpload.createImpl(window);

    this.readyState = READY_STATES.UNSENT;
    this.responseURL = "";
    this.status = 0;
    this.statusText = "";

    this.flag = {
      synchronous: false,
      withCredentials: false,
      mimeType: null,
      auth: null,
      method: undefined,
      responseType: "",
      requestHeaders: new HeaderList(),
      referrer: _ownerDocument.URL,
      uri: "",
      timeout: 0,
      body: undefined,
      preflight: false,
      requestManager: _ownerDocument._requestManager,
      resourceLoader: window._resourceLoader,
      cookieJar: _ownerDocument._cookieJar,
      encoding: _ownerDocument._encoding,
      origin: window._origin,
      userAgent: window.navigator.userAgent
    };

    this.properties = {
      beforeSend: false,
      send: false,
      controller: null,

      timeoutStart: 0,
      timeoutId: 0,
      timeoutFn: null,

      responseBytes: null,
      responseCache: null,
      responseTextCache: null,
      responseXMLCache: null,

      responseHeaders: new HeaderList(),
      filteredResponseHeaders: new Set(),

      error: "",
      uploadComplete: false,
      uploadListener: false,

      // Signifies that we're calling abort() from xhr-utils.js because of a window shutdown.
      // In that case the termination reason is "fatal", not "end-user abort".
      abortError: false,

      cookieJar: _ownerDocument._cookieJar,
      bufferStepSize: 1 * 1024 * 1024, // pre-allocate buffer increase step size. init value is 1MB
      totalReceivedChunkSize: 0
    };
  }

  get responseType() {
    return this.flag.responseType;
  }
  set responseType(responseType) {
    const { flag } = this;
    if (this.readyState === READY_STATES.LOADING || this.readyState === READY_STATES.DONE) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this.readyState === READY_STATES.OPENED && flag.synchronous) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }
    flag.responseType = responseType;
  }

  get response() {
    const { properties } = this;
    if (properties.responseCache) {
      // Needed because of: https://github.com/jsdom/webidl2js/issues/149
      return idlUtils.tryWrapperForImpl(properties.responseCache);
    }
    let res;

    const responseBytes = properties.responseBytes?.slice(0, properties.totalReceivedChunkSize) ?? null;

    switch (this.responseType) {
      case "":
      case "text": {
        res = this.responseText;
        break;
      }
      case "arraybuffer": {
        if (!responseBytes) {
          return null;
        }
        res = copyToArrayBufferInTargetRealmDestructively(responseBytes.buffer, this._globalObject);
        break;
      }
      case "blob": {
        if (!responseBytes) {
          return null;
        }
        const contentType = finalMIMEType(this);
        res = Blob.createImpl(this._globalObject, [
          [new Uint8Array(responseBytes)],
          { type: contentType || "" }
        ]);
        break;
      }
      case "document": {
        res = this.responseXML;
        break;
      }
      case "json": {
        if (this.readyState !== READY_STATES.DONE || !responseBytes) {
          res = null;
        }

        try {
          res = parseJSONFromBytes(responseBytes);
        } catch {
          res = null;
        }
        break;
      }
    }
    properties.responseCache = res;
    // Needed because of: https://github.com/jsdom/webidl2js/issues/149
    return idlUtils.tryWrapperForImpl(res);
  }
  get responseText() {
    const { properties } = this;
    if (this.responseType !== "" && this.responseType !== "text") {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this.readyState !== READY_STATES.LOADING && this.readyState !== READY_STATES.DONE) {
      return "";
    }
    if (properties.responseTextCache) {
      return properties.responseTextCache;
    }
    const responseBytes = properties.responseBytes?.slice(0, properties.totalReceivedChunkSize) ?? null;
    if (!responseBytes) {
      return "";
    }

    const fallbackEncodingLabel = finalCharset(this) || getBOMEncoding(responseBytes) || "UTF-8";
    const res = legacyHookDecode(responseBytes, fallbackEncodingLabel);

    properties.responseTextCache = res;
    return res;
  }
  get responseXML() {
    const { flag, properties } = this;
    if (this.responseType !== "" && this.responseType !== "document") {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this.readyState !== READY_STATES.DONE) {
      return null;
    }
    if (properties.responseXMLCache) {
      return properties.responseXMLCache;
    }
    const responseBytes = properties.responseBytes?.slice(0, properties.totalReceivedChunkSize) ?? null;
    if (!responseBytes) {
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

    const encoding = finalCharset(this) || labelToName(getBOMEncoding(responseBytes)) || "UTF-8";
    const resText = legacyHookDecode(responseBytes, encoding);

    if (!resText) {
      return null;
    }
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
    } catch {
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
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
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
    if (!(this.readyState === READY_STATES.UNSENT || this.readyState === READY_STATES.OPENED)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (properties.send) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    flag.withCredentials = val;
  }

  abort() {
    const { properties } = this;
    // Terminate the request
    clearTimeout(properties.timeoutId);
    properties.timeoutFn = null;
    properties.timeoutStart = 0;

    const { controller } = properties;
    if (controller) {
      controller.abort();
      properties.controller = null;
    }

    if (properties.abortError) {
      // Special case that ideally shouldn't be going through the public API at all.
      // Run the https://xhr.spec.whatwg.org/#handle-errors "fatal" steps.
      this.readyState = READY_STATES.DONE;
      properties.send = false;
      setResponseToNetworkError(this);
      return;
    }

    if ((this.readyState === READY_STATES.OPENED && properties.send) ||
        this.readyState === READY_STATES.HEADERS_RECEIVED ||
        this.readyState === READY_STATES.LOADING) {
      requestErrorSteps(this, "abort");
    }

    if (this.readyState === READY_STATES.DONE) {
      this.readyState = READY_STATES.UNSENT;

      setResponseToNetworkError(this);
    }
  }
  getAllResponseHeaders() {
    const { properties, readyState } = this;
    if (readyState === READY_STATES.UNSENT || readyState === READY_STATES.OPENED) {
      return "";
    }
    const result = [];
    for (const [key, value] of properties.responseHeaders) {
      const lcKey = key.toLowerCase();
      if (!properties.filteredResponseHeaders.has(lcKey)) {
        result.push(`${lcKey}: ${value}`);
      }
    }
    return result.join("\r\n");
  }

  getResponseHeader(header) {
    const { properties, readyState } = this;
    if (readyState === READY_STATES.UNSENT || readyState === READY_STATES.OPENED) {
      return null;
    }
    const lcHeader = header.toLowerCase();
    if (properties.filteredResponseHeaders.has(lcHeader)) {
      return null;
    }
    return getResponseHeader(this, lcHeader);
  }

  open(method, uri, asynchronous, user, password) {
    const { flag, properties, _ownerDocument } = this;
    if (!_ownerDocument) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (!tokenRegexp.test(method)) {
      throw DOMException.create(this._globalObject, [
        "The string did not match the expected pattern.",
        "SyntaxError"
      ]);
    }
    const upperCaseMethod = method.toUpperCase();
    if (forbiddenRequestMethods.has(upperCaseMethod)) {
      throw DOMException.create(this._globalObject, ["The operation is insecure.", "SecurityError"]);
    }

    const { controller } = properties;
    if (controller && typeof controller.abort === "function") {
      controller.abort();
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
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }
    if (flag.synchronous && flag.timeout) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }
    flag.method = method;

    let urlObj;
    try {
      urlObj = new URL(uri, _ownerDocument.baseURLSerialized());
    } catch {
      throw DOMException.create(this._globalObject, [
        "The string did not match the expected pattern.",
        "SyntaxError"
      ]);
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
    flag.requestHeaders = new HeaderList();
    flag.preflight = false;

    properties.send = false;
    properties.uploadListener = false;
    properties.abortError = false;
    this.responseURL = "";
    readyStateChange(this, READY_STATES.OPENED);
  }

  overrideMimeType(mime) {
    const { readyState } = this;
    if (readyState === READY_STATES.LOADING || readyState === READY_STATES.DONE) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    this.flag.overrideMIMEType = "application/octet-stream";

    // Waiting for better spec: https://github.com/whatwg/xhr/issues/157
    const parsed = MIMEType.parse(mime);
    if (parsed) {
      this.flag.overrideMIMEType = parsed.essence;

      const charset = parsed.parameters.get("charset");
      if (charset) {
        this.flag.overrideCharset = labelToName(charset);
      }
    }
  }

  // TODO: Add support for URLSearchParams and ReadableStream
  send(body) {
    const { flag, properties, upload, _ownerDocument } = this;
    // Not per spec, but per tests: https://github.com/whatwg/xhr/issues/65
    if (!_ownerDocument) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (this.readyState !== READY_STATES.OPENED || properties.send) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
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

          // Note that the spec has separate `USVString` conversion and UTF-8 encode operations, but our `utf8Encode()`
          // does both.
          flag.body = utf8Encode(fragmentSerialization(body, { requireWellFormed: false }));
        } else {
          if (typeof body === "string") {
            encoding = "UTF-8";
          }
          const { body: extractedBody, type } = extractBody(body);
          mimeType = type;
          flag.body = extractedBody;
        }

        const existingContentType = flag.requestHeaders.get("content-type");
        if (mimeType !== null && existingContentType === null) {
          flag.requestHeaders.set("Content-Type", mimeType);
        } else if (existingContentType !== null && encoding !== null) {
          // Waiting for better spec: https://github.com/whatwg/xhr/issues/188. This seems like a good guess at what
          // the spec will be, in the meantime.
          const parsed = MIMEType.parse(existingContentType);
          if (parsed) {
            const charset = parsed.parameters.get("charset");
            if (charset && !asciiCaseInsensitiveMatch(charset, encoding) && encoding !== null) {
              parsed.parameters.set("charset", encoding);
              flag.requestHeaders.set("Content-Type", parsed.toString());
            }
          }
        }
      }
    } finally {
      if (properties.beforeSend) {
        properties.beforeSend = false;
      } else {
        throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
      }
    }

    if (Object.keys(upload._eventListeners).length > 0) {
      properties.uploadListener = true;
    }

    // request doesn't like zero-length bodies
    if (flag.body && flag.body.byteLength === 0) {
      flag.body = null;
    }

    // Per XHR spec step 11: "If req's body is null, then set this's upload complete flag."
    // This prevents upload events from firing for GET/HEAD and other bodyless requests.
    // Note: flag.body may be undefined (for GET/HEAD) or null (for zero-length bodies).
    if (!flag.body) {
      properties.uploadComplete = true;
    }

    if (flag.synchronous) {
      const flagStr = JSON.stringify(flag, function (k, v) {
        if (this === flag && k === "requestManager") {
          return null;
        }
        if (this === flag && k === "resourceLoader") {
          // Can't serialize ResourceLoader; sync worker will use default
          return null;
        }
        if (this === flag && k === "pool" && v) {
          return { maxSockets: v.maxSockets };
        }
        if (v instanceof Uint8Array) {
          return { type: "Uint8Array", data: Array.from(v) };
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

      const response = JSON.parse(res.stdout.toString());
      const resProp = response.properties;
      if (resProp.responseBytes?.data) {
        resProp.responseBytes = new Uint8Array(resProp.responseBytes.data);
      }
      if (resProp.cookieJar) {
        resProp.cookieJar = tough.CookieJar.deserializeSync(
          resProp.cookieJar,
          _ownerDocument._cookieJar.store
        );
      }
      // Convert responseHeaders back to HeaderList
      if (resProp.responseHeaders) {
        resProp.responseHeaders = HeaderList.fromJSON(resProp.responseHeaders);
      }
      // Convert filteredResponseHeaders back to Set
      if (resProp.filteredResponseHeaders) {
        resProp.filteredResponseHeaders = new Set(resProp.filteredResponseHeaders);
      }

      this.readyState = READY_STATES.LOADING;
      this.status = response.status;
      this.statusText = response.statusText;
      this.responseURL = response.responseURL;
      Object.assign(this.properties, response.properties);

      if (resProp.error) {
        dispatchError(this, resProp.error);
        throw DOMException.create(this._globalObject, [resProp.error, "NetworkError"]);
      } else {
        const { responseBytes } = properties;
        const contentLength = getResponseHeader(this, "content-length") || "0";
        const byteLength = parseInt(contentLength) || responseBytes.length;
        const progressObj = { lengthComputable: false };
        if (byteLength !== 0) {
          progressObj.total = byteLength;
          progressObj.loaded = byteLength;
          progressObj.lengthComputable = true;
        }
        fireAnEvent("progress", this, ProgressEvent, progressObj);
        readyStateChange(this, READY_STATES.DONE);
        fireAnEvent("load", this, ProgressEvent, progressObj);
        fireAnEvent("loadend", this, ProgressEvent, progressObj);
      }
    } else {
      properties.send = true;
      properties.totalReceivedChunkSize = 0;
      properties.bufferStepSize = 1 * 1024 * 1024;
      properties.origin = flag.origin;

      if (body !== null && body !== "") {
        properties.uploadComplete = false;
      } else {
        properties.uploadComplete = true;
      }

      // State for response processing (captured in hook closures)
      let byteOffset = 0;
      let lastProgressReported;
      const progressObj = { lengthComputable: false, loaded: 0, total: 0 };

      // State for upload progress - use flag.body which is the processed Uint8Array
      const uploadTotal = flag.body ? flag.body.byteLength : 0;
      const uploadProgress = {
        lengthComputable: uploadTotal > 0,
        total: uploadTotal,
        loaded: 0
      };

      // Create the controller BEFORE firing loadstart,
      // so that abort() called from the loadstart handler can properly abort.
      const controller = xhrUtils.performFetch(
        {
          url: flag.uri,
          method: flag.method,
          requestHeaders: flag.requestHeaders,
          body: flag.body,
          origin: flag.origin,
          referrer: flag.referrer,
          userAgent: flag.userAgent,
          withCredentials: flag.withCredentials,
          auth: flag.auth,
          cookieJar: flag.cookieJar,
          uploadListener: properties.uploadListener,
          resourceLoader: flag.resourceLoader,
          requestManager: flag.requestManager,
          globalObject: this._globalObject,
          onAbortError: () => {
            properties.abortError = true;
          }
        },
        {
          processPreflightResponse: response => {
            // CORS preflight validation
            const acaoStr = response.headers.get("access-control-allow-origin");
            const acao = acaoStr ? acaoStr.trim() : null;
            if (acao !== "*" && acao !== properties.origin) {
              dispatchError(this, "Cross origin " + properties.origin + " forbidden");
              return false;
            }
            if (flag.withCredentials) {
              const acacStr = response.headers.get("access-control-allow-credentials");
              const acac = acacStr ? acacStr.trim() : null;
              if (acac !== "true") {
                dispatchError(this, "Credentials forbidden");
                return false;
              }
            }
            // Check allowed headers
            const acahStr = response.headers.get("access-control-allow-headers");
            const acah = new Set(acahStr ? acahStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
            const forbiddenHeaders = acah.has("*") ?
              [] :
              flag.requestHeaders.headerNamesNotIn(new Set([...simpleHeaders, ...acah]));
            if (forbiddenHeaders.length > 0) {
              dispatchError(this, "Headers " + forbiddenHeaders + " forbidden");
              return false;
            }
            return true;
          },

          processRedirect: ({ response, requestHeaders, sourceURL, targetURL }) => {
            const sourceUrlObj = new URL(sourceURL);
            const targetUrlObj = new URL(targetURL);
            const isCrossOriginRedirect = sourceUrlObj.origin !== targetUrlObj.origin;

            // Step 11: If status is 301/302 and method is POST, or 303 and method is not GET/HEAD,
            // set method to GET and remove request-body-header names
            const { status } = response;
            const methodWillChange = ((status === 301 || status === 302) && flag.method === "POST") ||
                                     (status === 303 && !["GET", "HEAD"].includes(flag.method));
            if (methodWillChange) {
              requestHeaders.delete("Content-Type");
              requestHeaders.delete("Content-Length");
              requestHeaders.delete("Content-Encoding");
              requestHeaders.delete("Content-Language");
              requestHeaders.delete("Content-Location");
            }

            // Step 14: Set origin to "null" if the redirect crosses origins and the source is cross-origin
            if (isCrossOriginRedirect && sourceUrlObj.origin !== flag.origin) {
              properties.origin = "null";
            }
            requestHeaders.set("Origin", properties.origin);

            // Step 15: If cross-origin redirect, remove Authorization
            if (isCrossOriginRedirect) {
              requestHeaders.delete("Authorization");
            }

            // If the redirect source was cross-origin, validate CORS headers
            if (flag.origin !== sourceUrlObj.origin &&
                sourceUrlObj.protocol !== "data:") {
              const acaoStr = response.headers.get("access-control-allow-origin");
              const acao = acaoStr ? acaoStr.trim() : null;
              if (acao !== "*" && acao !== flag.origin) {
                dispatchError(this, "Cross origin " + flag.origin + " forbidden");
                return false;
              }
              if (flag.withCredentials) {
                const acacStr = response.headers.get("access-control-allow-credentials");
                const acac = acacStr ? acacStr.trim() : null;
                if (acac !== "true") {
                  dispatchError(this, "Credentials forbidden");
                  return false;
                }
              }
              if (targetUrlObj.username || targetUrlObj.password) {
                dispatchError(this, "Userinfo forbidden in cors redirect");
                return false;
              }
            }
            return true;
          },

          processUploadComplete: () => {
            // For bodyless requests (GET/HEAD), uploadComplete is already true.
            // Don't fire upload events in that case.
            if (properties.uploadComplete) {
              return;
            }
            properties.uploadComplete = true;

            if (properties.uploadListener) {
              uploadProgress.loaded = uploadProgress.total;
              fireAnEvent("progress", upload, ProgressEvent, uploadProgress);
              fireAnEvent("load", upload, ProgressEvent, uploadProgress);
              fireAnEvent("loadend", upload, ProgressEvent, uploadProgress);
            }
          },

          processResponse: response => {
            const { headers } = response;

            // Build list of filtered headers for CORS
            const filteredResponseHeaders = new Set();

            const destUrlObj = new URL(response.url);
            if (properties.origin !== destUrlObj.origin &&
                destUrlObj.protocol !== "data:") {
              // CORS validation for final response
              const acaoStr = headers.get("access-control-allow-origin");
              const acao = acaoStr ? acaoStr.trim() : null;
              if (acao !== "*" && acao !== properties.origin) {
                dispatchError(this, "Cross origin " + properties.origin + " forbidden");
                return false;
              }
              if (flag.withCredentials) {
                const acacStr = headers.get("access-control-allow-credentials");
                const acac = acacStr ? acacStr.trim() : null;
                if (acac !== "true") {
                  dispatchError(this, "Credentials forbidden");
                  return false;
                }
              }
              const acehStr = headers.get("access-control-expose-headers");
              const aceh = new Set(acehStr ? acehStr.trim().toLowerCase().split(headerListSeparatorRegexp) : []);
              for (const [header] of headers) {
                const lcHeader = header.toLowerCase();
                if (!corsSafeResponseHeaders.has(lcHeader) && !aceh.has(lcHeader) && !aceh.has("*")) {
                  filteredResponseHeaders.add(lcHeader);
                }
              }
            }

            for (const [header] of headers) {
              const lcHeader = header.toLowerCase();
              if (forbiddenResponseHeaders.has(lcHeader)) {
                filteredResponseHeaders.add(lcHeader);
              }
            }

            this.responseURL = response.url;
            this.status = response.status;
            this.statusText = response.statusText || HTTP_STATUS_CODES[response.status] || "";

            properties.responseHeaders = headers;
            properties.filteredResponseHeaders = filteredResponseHeaders;

            const contentLength = headers.get("content-length") || "0";
            const bufferLength = parseInt(contentLength) || 0;
            if (bufferLength !== 0) {
              progressObj.total = bufferLength;
              progressObj.lengthComputable = true;
            }

            // Pre-allocate buffer
            properties.responseBytes = new Uint8Array(properties.bufferStepSize);
            properties.responseCache = null;
            properties.responseTextCache = null;
            properties.responseXMLCache = null;
            readyStateChange(this, READY_STATES.HEADERS_RECEIVED);

            return true;
          },

          processRawBodyChunk: chunk => {
            // Track raw bytes for progress (pre-decompression)
            byteOffset += chunk.length;
            progressObj.loaded = byteOffset;
          },

          processBodyChunk: chunk => {
            // Check if aborted
            if (!properties.controller) {
              return;
            }

            // Store decompressed bytes
            properties.totalReceivedChunkSize += chunk.length;
            if (properties.totalReceivedChunkSize >= properties.bufferStepSize) {
              properties.bufferStepSize *= 2;
              while (properties.totalReceivedChunkSize >= properties.bufferStepSize) {
                properties.bufferStepSize *= 2;
              }
              const tmpBuf = new Uint8Array(properties.bufferStepSize);
              tmpBuf.set(properties.responseBytes);
              properties.responseBytes = tmpBuf;
            }
            properties.responseBytes.set(chunk, properties.totalReceivedChunkSize - chunk.length);
            properties.responseCache = null;
            properties.responseTextCache = null;
            properties.responseXMLCache = null;

            if (this.readyState === READY_STATES.HEADERS_RECEIVED) {
              this.readyState = READY_STATES.LOADING;
            }
            fireAnEvent("readystatechange", this);

            if (progressObj.total !== progressObj.loaded || properties.totalReceivedChunkSize === byteOffset) {
              if (lastProgressReported !== progressObj.loaded) {
                lastProgressReported = progressObj.loaded;
                fireAnEvent("progress", this, ProgressEvent, progressObj);
              }
            }
          },

          processEndOfBody: () => {
            clearTimeout(properties.timeoutId);
            properties.timeoutFn = null;
            properties.timeoutStart = 0;
            properties.controller = null;

            if (flag.requestManager) {
              // Clean up from request manager - already handled by performFetch
            }

            if (lastProgressReported !== progressObj.loaded) {
              fireAnEvent("progress", this, ProgressEvent, progressObj);
            }
            readyStateChange(this, READY_STATES.DONE);
            fireAnEvent("load", this, ProgressEvent, progressObj);
            fireAnEvent("loadend", this, ProgressEvent, progressObj);
          },

          processBodyError: err => {
            properties.controller = null;
            dispatchError(this, err.message || String(err));
          }
        }
      );
      properties.controller = controller;

      // Per XHR spec, fire loadstart on xhr first, then on upload.
      fireAnEvent("loadstart", this, ProgressEvent);

      if (!properties.uploadComplete && properties.uploadListener) {
        fireAnEvent("loadstart", upload, ProgressEvent, uploadProgress);
      }

      // Per XHR spec: "If this's state is not opened or this's send() flag is unset, return."
      if (this.readyState !== READY_STATES.OPENED || !properties.send) {
        return;
      }

      if (this.timeout > 0) {
        properties.timeoutStart = (new Date()).getTime();
        properties.timeoutFn = () => {
          controller.abort();
          if (!(this.readyState === READY_STATES.UNSENT ||
              (this.readyState === READY_STATES.OPENED && !properties.send) ||
              this.readyState === READY_STATES.DONE)) {
            properties.send = false;
            let stateChanged = false;
            if (!properties.uploadComplete) {
              fireAnEvent("progress", upload, ProgressEvent);
              readyStateChange(this, READY_STATES.DONE);
              fireAnEvent("timeout", upload, ProgressEvent);
              fireAnEvent("loadend", upload, ProgressEvent);
              stateChanged = true;
            }
            fireAnEvent("progress", this, ProgressEvent);
            if (!stateChanged) {
              readyStateChange(this, READY_STATES.DONE);
            }
            fireAnEvent("timeout", this, ProgressEvent);
            fireAnEvent("loadend", this, ProgressEvent);
          }
          this.readyState = READY_STATES.UNSENT;
        };
        properties.timeoutId = setTimeout(properties.timeoutFn, this.timeout);
      }
    }
  }

  setRequestHeader(header, value) {
    if (this.readyState !== READY_STATES.OPENED) {
      throw DOMException.create(
        this._globalObject,
        ["setRequestHeader() can only be called in the OPENED state.", "InvalidStateError"]
      );
    }
    if (this.properties.send) {
      throw DOMException.create(
        this._globalObject,
        ["setRequestHeader() cannot be called after send()", "InvalidStateError"]
      );
    }

    value = normalizeHeaderValue(value);

    if (!isHeaderName(header)) {
      throw DOMException.create(this._globalObject, ["Invalid header name", "SyntaxError"]);
    }
    if (!isHeaderValue(value)) {
      throw DOMException.create(this._globalObject, ["Invalid header value", "SyntaxError"]);
    }

    if (isForbiddenRequestHeader(header, value)) {
      return;
    }

    this.flag.requestHeaders.combine(header, value);
  }
}

setupForSimpleEventAccessors(XMLHttpRequestImpl.prototype, ["readystatechange"]);

function readyStateChange(xhr, readyState) {
  if (xhr.readyState === readyState) {
    return;
  }

  xhr.readyState = readyState;

  fireAnEvent("readystatechange", xhr);
}

function finalMIMEType(xhr) {
  const { flag } = xhr;
  return flag.overrideMIMEType || getResponseHeader(xhr, "content-type");
}

function finalCharset(xhr) {
  const { flag } = xhr;
  if (flag.overrideCharset) {
    return flag.overrideCharset;
  }
  const parsedContentType = MIMEType.parse(getResponseHeader(xhr, "content-type"));
  if (parsedContentType) {
    return labelToName(parsedContentType.parameters.get("charset"));
  }
  return null;
}

function getResponseHeader(xhr, lcHeader) {
  const { properties } = xhr;
  return properties.responseHeaders.get(lcHeader);
}

function extractBody(bodyInit) {
  // https://fetch.spec.whatwg.org/#concept-bodyinit-extract
  // We represent the body as a `Uint8Array`.

  if (Blob.isImpl(bodyInit)) {
    return {
      body: bodyInit._bytes,
      type: bodyInit.type === "" ? null : bodyInit.type
    };
  } else if (isArrayBuffer(bodyInit)) {
    return {
      body: new Uint8Array(bodyInit).slice(0),
      type: null
    };
  } else if (ArrayBuffer.isView(bodyInit)) {
    return {
      body: new Uint8Array(bodyInit),
      type: null
    };
  } else if (FormData.isImpl(bodyInit)) {
    const { boundary, outputChunks } = serializeEntryList(bodyInit._entries);

    return {
      body: concatTypedArrays(outputChunks),
      type: "multipart/form-data; boundary=" + utf8Decoder.decode(boundary)
    };
  }

  // Must be a string
  return {
    body: utf8Encode(bodyInit),
    type: "text/plain;charset=UTF-8"
  };
}

exports.implementation = XMLHttpRequestImpl;
