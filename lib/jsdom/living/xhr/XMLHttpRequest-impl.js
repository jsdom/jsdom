"use strict";

const HTTP_STATUS_CODES = require("http").STATUS_CODES;
const { spawnSync } = require("child_process");
const { URL } = require("whatwg-url");
const { getBOMEncoding, labelToName, legacyHookDecode } = require("@exodus/bytes/encoding.js");
const { utf8Encode, utf8Decode } = require("../helpers/encoding");
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

// Helper functions for error handling

function dispatchError(xhr, errMessage) {
  // Store the error message for sync XHR worker to serialize
  xhr._error = errMessage;
  requestErrorSteps(xhr, "error", DOMException.create(xhr._globalObject, [errMessage, "NetworkError"]));
}

function requestErrorSteps(xhr, event, exception) {
  const { upload } = xhr;

  xhr.readyState = READY_STATES.DONE;
  xhr._send = false;

  setResponseToNetworkError(xhr);

  if (xhr._synchronous) {
    throw exception;
  }

  fireAnEvent("readystatechange", xhr);

  if (!xhr._uploadComplete) {
    xhr._uploadComplete = true;

    if (xhr._uploadListener) {
      fireAnEvent(event, upload, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
      fireAnEvent("loadend", upload, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
    }
  }

  fireAnEvent(event, xhr, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
  fireAnEvent("loadend", xhr, ProgressEvent, { loaded: 0, total: 0, lengthComputable: false });
}

function setResponseToNetworkError(xhr) {
  xhr._responseBytes =
    xhr._responseCache =
    xhr._responseTextCache =
    xhr._responseXMLCache = null;

  xhr._responseHeaders = new HeaderList();
  xhr.status = 0;
  xhr.statusText = "";
}

class XMLHttpRequestImpl extends XMLHttpRequestEventTargetImpl {
  constructor(window) {
    super(window);

    const { _ownerDocument } = this;

    this.upload = XMLHttpRequestUpload.createImpl(window);

    // Public WebIDL properties
    this.readyState = READY_STATES.UNSENT;
    this.responseURL = "";
    this.status = 0;
    this.statusText = "";

    // Request configuration
    this._synchronous = false;
    this._withCredentials = false;
    this._mimeType = null;
    this._auth = null;
    this._method = undefined;
    this._responseType = "";
    this._requestHeaders = new HeaderList();
    this._referrer = _ownerDocument.URL;
    this._url = "";
    this._timeout = 0;
    this._body = undefined;
    this._preflight = false;
    this._overrideMIMEType = null;
    this._overrideCharset = null;
    this._requestManager = _ownerDocument._requestManager;
    this._resourceLoader = window._resourceLoader;
    this._cookieJar = _ownerDocument._cookieJar;
    this._encoding = _ownerDocument._encoding;
    this._origin = window._origin;
    this._userAgent = window.navigator.userAgent;

    // Runtime/response state
    this._beforeSend = false;
    this._send = false;
    this._controller = null;
    this._timeoutStart = 0;
    this._timeoutId = 0;
    this._timeoutFn = null;
    this._responseBytes = null;
    this._responseCache = null;
    this._responseTextCache = null;
    this._responseXMLCache = null;
    this._responseHeaders = new HeaderList();
    this._filteredResponseHeaders = new Set();
    this._error = "";
    this._uploadComplete = false;
    this._uploadListener = false;
    // Signifies that we're calling abort() from xhr-utils.js because of a window shutdown.
    // In that case the termination reason is "fatal", not "end-user abort".
    this._abortError = false;
    this._bufferStepSize = 1 * 1024 * 1024; // pre-allocate buffer increase step size. init value is 1MB
    this._totalReceivedChunkSize = 0;
  }

  get responseType() {
    return this._responseType;
  }
  set responseType(responseType) {
    if (this.readyState === READY_STATES.LOADING || this.readyState === READY_STATES.DONE) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this.readyState === READY_STATES.OPENED && this._synchronous) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }
    this._responseType = responseType;
  }

  get response() {
    if (this._responseCache) {
      // Needed because of: https://github.com/jsdom/webidl2js/issues/149
      return idlUtils.tryWrapperForImpl(this._responseCache);
    }
    let res;

    const responseBytes = this._responseBytes?.slice(0, this._totalReceivedChunkSize) ?? null;

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
    this._responseCache = res;
    // Needed because of: https://github.com/jsdom/webidl2js/issues/149
    return idlUtils.tryWrapperForImpl(res);
  }
  get responseText() {
    if (this.responseType !== "" && this.responseType !== "text") {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this.readyState !== READY_STATES.LOADING && this.readyState !== READY_STATES.DONE) {
      return "";
    }
    if (this._responseTextCache) {
      return this._responseTextCache;
    }
    const responseBytes = this._responseBytes?.slice(0, this._totalReceivedChunkSize) ?? null;
    if (!responseBytes) {
      return "";
    }

    const fallbackEncodingLabel = finalCharset(this) || getBOMEncoding(responseBytes) || "UTF-8";
    const res = legacyHookDecode(responseBytes, fallbackEncodingLabel);

    this._responseTextCache = res;
    return res;
  }
  get responseXML() {
    if (this.responseType !== "" && this.responseType !== "document") {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this.readyState !== READY_STATES.DONE) {
      return null;
    }
    if (this._responseXMLCache) {
      return this._responseXMLCache;
    }
    const responseBytes = this._responseBytes?.slice(0, this._totalReceivedChunkSize) ?? null;
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
        url: this._url,
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
      this._responseXMLCache = null;
      return null;
    }
    res.close();
    this._responseXMLCache = res;
    return res;
  }

  get timeout() {
    return this._timeout;
  }
  set timeout(val) {
    if (this._synchronous) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }
    this._timeout = val;
    clearTimeout(this._timeoutId);
    if (val > 0 && this._timeoutFn) {
      this._timeoutId = setTimeout(
        this._timeoutFn,
        Math.max(0, val - ((new Date()).getTime() - this._timeoutStart))
      );
    } else {
      this._timeoutFn = null;
      this._timeoutStart = 0;
    }
  }

  get withCredentials() {
    return this._withCredentials;
  }
  set withCredentials(val) {
    if (!(this.readyState === READY_STATES.UNSENT || this.readyState === READY_STATES.OPENED)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this._send) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    this._withCredentials = val;
  }

  abort() {
    // Terminate the request
    clearTimeout(this._timeoutId);
    this._timeoutFn = null;
    this._timeoutStart = 0;

    if (this._controller) {
      this._controller.abort();
      this._controller = null;
    }

    if (this._abortError) {
      // Special case that ideally shouldn't be going through the public API at all.
      // Run the https://xhr.spec.whatwg.org/#handle-errors "fatal" steps.
      this.readyState = READY_STATES.DONE;
      this._send = false;
      setResponseToNetworkError(this);
      return;
    }

    if ((this.readyState === READY_STATES.OPENED && this._send) ||
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
    if (this.readyState === READY_STATES.UNSENT || this.readyState === READY_STATES.OPENED) {
      return "";
    }
    const result = [];
    for (const [key, value] of this._responseHeaders) {
      const lcKey = key.toLowerCase();
      if (!this._filteredResponseHeaders.has(lcKey)) {
        result.push(`${lcKey}: ${value}`);
      }
    }
    return result.join("\r\n");
  }

  getResponseHeader(header) {
    if (this.readyState === READY_STATES.UNSENT || this.readyState === READY_STATES.OPENED) {
      return null;
    }
    const lcHeader = header.toLowerCase();
    if (this._filteredResponseHeaders.has(lcHeader)) {
      return null;
    }
    return getResponseHeader(this, lcHeader);
  }

  open(method, uri, asynchronous, user, password) {
    const { _ownerDocument } = this;
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

    if (this._controller && typeof this._controller.abort === "function") {
      this._controller.abort();
    }

    if (allowedRequestMethods.has(upperCaseMethod)) {
      method = upperCaseMethod;
    }
    if (typeof asynchronous !== "undefined") {
      this._synchronous = !asynchronous;
    } else {
      this._synchronous = false;
    }
    if (this._responseType && this._synchronous) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }
    if (this._synchronous && this._timeout) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }
    this._method = method;

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
      this._auth = {
        user,
        pass: password
      };
      urlObj.username = "";
      urlObj.password = "";
    }

    this._url = urlObj.href;
    this._requestHeaders = new HeaderList();
    this._preflight = false;

    this._send = false;
    this._uploadListener = false;
    this._abortError = false;
    this.responseURL = "";
    readyStateChange(this, READY_STATES.OPENED);
  }

  overrideMimeType(mime) {
    if (this.readyState === READY_STATES.LOADING || this.readyState === READY_STATES.DONE) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    this._overrideMIMEType = "application/octet-stream";

    // Waiting for better spec: https://github.com/whatwg/xhr/issues/157
    const parsed = MIMEType.parse(mime);
    if (parsed) {
      this._overrideMIMEType = parsed.essence;

      const charset = parsed.parameters.get("charset");
      if (charset) {
        this._overrideCharset = labelToName(charset);
      }
    }
  }

  // TODO: Add support for URLSearchParams and ReadableStream
  send(body) {
    const { upload, _ownerDocument } = this;
    // Not per spec, but per tests: https://github.com/whatwg/xhr/issues/65
    if (!_ownerDocument) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (this.readyState !== READY_STATES.OPENED || this._send) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    this._beforeSend = true;

    try {
      if (this._method === "GET" || this._method === "HEAD") {
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
          this._body = utf8Encode(fragmentSerialization(body, { requireWellFormed: false }));
        } else {
          if (typeof body === "string") {
            encoding = "UTF-8";
          }
          const { body: extractedBody, type } = extractBody(body);
          mimeType = type;
          this._body = extractedBody;
        }

        const existingContentType = this._requestHeaders.get("content-type");
        if (mimeType !== null && existingContentType === null) {
          this._requestHeaders.set("Content-Type", mimeType);
        } else if (existingContentType !== null && encoding !== null) {
          // Waiting for better spec: https://github.com/whatwg/xhr/issues/188. This seems like a good guess at what
          // the spec will be, in the meantime.
          const parsed = MIMEType.parse(existingContentType);
          if (parsed) {
            const charset = parsed.parameters.get("charset");
            if (charset && !asciiCaseInsensitiveMatch(charset, encoding) && encoding !== null) {
              parsed.parameters.set("charset", encoding);
              this._requestHeaders.set("Content-Type", parsed.toString());
            }
          }
        }
      }
    } finally {
      if (this._beforeSend) {
        this._beforeSend = false;
      } else {
        throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
      }
    }

    if (Object.keys(upload._eventListeners).length > 0) {
      this._uploadListener = true;
    }

    // request doesn't like zero-length bodies
    if (this._body && this._body.byteLength === 0) {
      this._body = null;
    }

    // Per XHR spec step 11: "If req's body is null, then set this's upload complete flag."
    // This prevents upload events from firing for GET/HEAD and other bodyless requests.
    // Note: this._body may be undefined (for GET/HEAD) or null (for zero-length bodies).
    if (!this._body) {
      this._uploadComplete = true;
    }

    if (this._synchronous) {
      const configStr = JSON.stringify(this._serializeRequest());
      const res = spawnSync(
        process.execPath,
        [syncWorkerFile],
        { input: configStr, maxBuffer: Infinity }
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
      this._adoptSerializedResponse(response);

      this.readyState = READY_STATES.LOADING;

      if (this._error) {
        dispatchError(this, this._error);
        throw DOMException.create(this._globalObject, [this._error, "NetworkError"]);
      } else {
        const contentLength = getResponseHeader(this, "content-length") || "0";
        const byteLength = parseInt(contentLength) || this._responseBytes.length;
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
      this._send = true;
      this._totalReceivedChunkSize = 0;
      this._bufferStepSize = 1 * 1024 * 1024;

      // Track the effective origin for CORS (may change during redirects)
      let effectiveOrigin = this._origin;

      if (body !== null && body !== "") {
        this._uploadComplete = false;
      } else {
        this._uploadComplete = true;
      }

      // State for response processing (captured in hook closures)
      let byteOffset = 0;
      let lastProgressReported;
      const progressObj = { lengthComputable: false, loaded: 0, total: 0 };

      // State for upload progress - use this._body which is the processed Uint8Array
      const uploadTotal = this._body ? this._body.byteLength : 0;
      const uploadProgress = {
        lengthComputable: uploadTotal > 0,
        total: uploadTotal,
        loaded: 0
      };

      // Create the controller BEFORE firing loadstart,
      // so that abort() called from the loadstart handler can properly abort.
      const controller = xhrUtils.performFetch(
        {
          url: this._url,
          method: this._method,
          requestHeaders: this._requestHeaders,
          body: this._body,
          origin: this._origin,
          referrer: this._referrer,
          userAgent: this._userAgent,
          withCredentials: this._withCredentials,
          auth: this._auth,
          cookieJar: this._cookieJar,
          uploadListener: this._uploadListener,
          resourceLoader: this._resourceLoader,
          requestManager: this._requestManager,
          globalObject: this._globalObject,
          onAbortError: () => {
            this._abortError = true;
          }
        },
        {
          processPreflightResponse: response => {
            // CORS preflight validation
            const acaoStr = response.headers.get("access-control-allow-origin");
            const acao = acaoStr ? acaoStr.trim() : null;
            if (acao !== "*" && acao !== effectiveOrigin) {
              dispatchError(this, "Cross origin " + effectiveOrigin + " forbidden");
              return false;
            }
            if (this._withCredentials) {
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
              this._requestHeaders.headerNamesNotIn(new Set([...simpleHeaders, ...acah]));
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
            const methodWillChange = ((status === 301 || status === 302) && this._method === "POST") ||
                                     (status === 303 && !["GET", "HEAD"].includes(this._method));
            if (methodWillChange) {
              requestHeaders.delete("Content-Type");
              requestHeaders.delete("Content-Length");
              requestHeaders.delete("Content-Encoding");
              requestHeaders.delete("Content-Language");
              requestHeaders.delete("Content-Location");
            }

            // Step 14: Set origin to "null" if the redirect crosses origins and the source is cross-origin
            if (isCrossOriginRedirect && sourceUrlObj.origin !== this._origin) {
              effectiveOrigin = "null";
            }
            requestHeaders.set("Origin", effectiveOrigin);

            // Step 15: If cross-origin redirect, remove Authorization
            if (isCrossOriginRedirect) {
              requestHeaders.delete("Authorization");
            }

            // If the redirect source was cross-origin, validate CORS headers
            if (this._origin !== sourceUrlObj.origin &&
                sourceUrlObj.protocol !== "data:") {
              const acaoStr = response.headers.get("access-control-allow-origin");
              const acao = acaoStr ? acaoStr.trim() : null;
              if (acao !== "*" && acao !== this._origin) {
                dispatchError(this, "Cross origin " + this._origin + " forbidden");
                return false;
              }
              if (this._withCredentials) {
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
            if (this._uploadComplete) {
              return;
            }
            this._uploadComplete = true;

            if (this._uploadListener) {
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
            if (effectiveOrigin !== destUrlObj.origin &&
                destUrlObj.protocol !== "data:") {
              // CORS validation for final response
              const acaoStr = headers.get("access-control-allow-origin");
              const acao = acaoStr ? acaoStr.trim() : null;
              if (acao !== "*" && acao !== effectiveOrigin) {
                dispatchError(this, "Cross origin " + effectiveOrigin + " forbidden");
                return false;
              }
              if (this._withCredentials) {
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

            this._responseHeaders = headers;
            this._filteredResponseHeaders = filteredResponseHeaders;

            const contentLength = headers.get("content-length") || "0";
            const bufferLength = parseInt(contentLength) || 0;
            if (bufferLength !== 0) {
              progressObj.total = bufferLength;
              progressObj.lengthComputable = true;
            }

            // Pre-allocate buffer
            this._responseBytes = new Uint8Array(this._bufferStepSize);
            this._responseCache = null;
            this._responseTextCache = null;
            this._responseXMLCache = null;
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
            if (!this._controller) {
              return;
            }

            // Store decompressed bytes
            this._totalReceivedChunkSize += chunk.length;
            if (this._totalReceivedChunkSize >= this._bufferStepSize) {
              this._bufferStepSize *= 2;
              while (this._totalReceivedChunkSize >= this._bufferStepSize) {
                this._bufferStepSize *= 2;
              }
              const tmpBuf = new Uint8Array(this._bufferStepSize);
              tmpBuf.set(this._responseBytes);
              this._responseBytes = tmpBuf;
            }
            this._responseBytes.set(chunk, this._totalReceivedChunkSize - chunk.length);
            this._responseCache = null;
            this._responseTextCache = null;
            this._responseXMLCache = null;

            if (this.readyState === READY_STATES.HEADERS_RECEIVED) {
              this.readyState = READY_STATES.LOADING;
            }
            fireAnEvent("readystatechange", this);

            if (progressObj.total !== progressObj.loaded || this._totalReceivedChunkSize === byteOffset) {
              if (lastProgressReported !== progressObj.loaded) {
                lastProgressReported = progressObj.loaded;
                fireAnEvent("progress", this, ProgressEvent, progressObj);
              }
            }
          },

          processEndOfBody: () => {
            clearTimeout(this._timeoutId);
            this._timeoutFn = null;
            this._timeoutStart = 0;
            this._controller = null;

            if (this._requestManager) {
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
            this._controller = null;
            dispatchError(this, err.message || String(err));
          }
        }
      );
      this._controller = controller;

      // Per XHR spec, fire loadstart on xhr first, then on upload.
      fireAnEvent("loadstart", this, ProgressEvent);

      if (!this._uploadComplete && this._uploadListener) {
        fireAnEvent("loadstart", upload, ProgressEvent, uploadProgress);
      }

      // Per XHR spec: "If this's state is not opened or this's send() flag is unset, return."
      if (this.readyState !== READY_STATES.OPENED || !this._send) {
        return;
      }

      if (this.timeout > 0) {
        this._timeoutStart = (new Date()).getTime();
        this._timeoutFn = () => {
          controller.abort();
          if (!(this.readyState === READY_STATES.UNSENT ||
              (this.readyState === READY_STATES.OPENED && !this._send) ||
              this.readyState === READY_STATES.DONE)) {
            this._send = false;
            let stateChanged = false;
            if (!this._uploadComplete) {
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
        this._timeoutId = setTimeout(this._timeoutFn, this.timeout);
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
    if (this._send) {
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

    this._requestHeaders.combine(header, value);
  }

  // Serialization methods for sync XHR worker communication

  // Called in main process before spawning sync worker
  _serializeRequest() {
    let body = this._body;
    if (body instanceof Uint8Array) {
      body = { type: "Uint8Array", data: Array.from(body) };
    }

    return {
      method: this._method,
      url: this._url,
      body,
      requestHeaders: this._requestHeaders.toJSON(),
      withCredentials: this._withCredentials,
      mimeType: this._mimeType,
      auth: this._auth,
      responseType: this._responseType,
      timeout: this._timeout,
      preflight: this._preflight,
      cookieJar: this._cookieJar,
      encoding: this._encoding,
      origin: this._origin,
      referrer: this._referrer,
      userAgent: this._userAgent
    };
  }

  // Called in main process after sync worker returns
  _adoptSerializedResponse(response) {
    this.status = response.status;
    this.statusText = response.statusText;
    this.responseURL = response.responseURL;

    if (response.responseBytes) {
      this._responseBytes = new Uint8Array(response.responseBytes);
    }
    this._responseHeaders = HeaderList.fromJSON(response.responseHeaders);
    this._filteredResponseHeaders = new Set(response.filteredResponseHeaders);
    this._error = response.error || "";
    this._totalReceivedChunkSize = response.totalReceivedChunkSize;
    this._uploadComplete = response.uploadComplete;

    if (response.cookieJar) {
      this._cookieJar = tough.CookieJar.deserializeSync(
        response.cookieJar,
        this._ownerDocument._cookieJar.store
      );
    }
  }

  // Called in worker to set up XHR from serialized config
  _adoptSerializedRequest(config) {
    this._method = config.method;
    this._url = config.url;
    this._body = config.body?.type === "Uint8Array" ?
      new Uint8Array(config.body.data) :
      config.body;
    this._requestHeaders = HeaderList.fromJSON(config.requestHeaders);
    this._synchronous = false; // Run as async in worker
    this._withCredentials = config.withCredentials;
    this._mimeType = config.mimeType;
    this._auth = config.auth;
    this._responseType = config.responseType;
    this._timeout = config.timeout;
    this._preflight = config.preflight;
    this._cookieJar = config.cookieJar ?
      tough.CookieJar.fromJSON(config.cookieJar) :
      null;
    this._encoding = config.encoding;
    this._origin = config.origin;
    this._referrer = config.referrer;
    this._userAgent = config.userAgent;

    this.readyState = READY_STATES.OPENED;
  }

  // Called in worker to serialize response
  _serializeResponse() {
    let responseBytes = this._responseBytes;
    if (responseBytes instanceof Uint8Array) {
      responseBytes = Array.from(responseBytes.slice(0, this._totalReceivedChunkSize));
    }

    let error = this._error;
    if (error && typeof error !== "string") {
      error = error.stack || require("util").inspect(error);
    }

    return {
      status: this.status,
      statusText: this.statusText,
      responseURL: this.responseURL,
      responseBytes,
      responseHeaders: this._responseHeaders.toJSON(),
      filteredResponseHeaders: Array.from(this._filteredResponseHeaders),
      error,
      totalReceivedChunkSize: this._totalReceivedChunkSize,
      uploadComplete: this._uploadComplete,
      cookieJar: this._cookieJar
    };
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
  return xhr._overrideMIMEType || getResponseHeader(xhr, "content-type");
}

function finalCharset(xhr) {
  if (xhr._overrideCharset) {
    return xhr._overrideCharset;
  }
  const parsedContentType = MIMEType.parse(getResponseHeader(xhr, "content-type"));
  if (parsedContentType) {
    return labelToName(parsedContentType.parameters.get("charset"));
  }
  return null;
}

function getResponseHeader(xhr, lcHeader) {
  return xhr._responseHeaders.get(lcHeader);
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
      type: "multipart/form-data; boundary=" + utf8Decode(boundary)
    };
  }

  // Must be a string
  return {
    body: utf8Encode(bodyInit),
    type: "text/plain;charset=UTF-8"
  };
}

exports.implementation = XMLHttpRequestImpl;
