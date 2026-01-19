"use strict";

const { spawnSync } = require("child_process");
const { URL, serializeURL, parseURL } = require("whatwg-url");
const { getBOMEncoding, labelToName, legacyHookDecode } = require("@exodus/bytes/encoding.js");
const MIMEType = require("whatwg-mimetype");
const { utf8Encode } = require("../helpers/encoding");
const { isHeaderName, isHeaderValue, normalizeHeaderValue } = require("../fetch/Headers-impl");
const DOMException = require("../generated/DOMException");
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
const { copyToArrayBufferInTargetRealmDestructively, concatTypedArrays } = require("../helpers/binary-data");
const { serializeEntryList } = require("./multipart-form-data.js");
const { isForbidden: isForbiddenRequestHeader } = require("../fetch/header-types");
const { isArrayBuffer } = require("../generated/utils");
const {
  READY_STATES,
  headerListCombine,
  headerListSet,
  headerListGet,
  headerListSortAndCombine,
  sortByLegacyUppercase,
  extractLength,
  extractMIMEType
} = require("./xhr-utils");
const { fetching, incrementallyRead, makeNetworkErrorResponse } = require("./xhr-fetch");

const syncWorkerFile = require.resolve ? require.resolve("./xhr-sync-worker.js") : null;

const tokenRegexp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const utf8Decoder = new TextDecoder();
const FAILURE = Symbol("failure");

class XMLHttpRequestImpl extends XMLHttpRequestEventTargetImpl {
  constructor(window) {
    super(window);

    const { _ownerDocument } = this;

    this.upload = XMLHttpRequestUpload.createImpl(window);

    this.readyState = READY_STATES.UNSENT;

    this._sendFlag = false;
    this._timeout = 0;
    this._crossOriginCredentials = false;
    this._requestMethod = null;
    this._requestURL = null;
    this._authorRequestHeaders = [];
    this._requestBody = null;
    this._synchronousFlag = false;
    this._uploadCompleteFlag = false;
    this._uploadListenerFlag = false;
    this._timedOutFlag = false;
    this._response = makeNetworkErrorResponse();
    this._receivedBytes = new Uint8Array(0);
    this._rawReceivedLength = 0;
    this._lastProgressLoaded = null;
    this._responseType = "";
    this._responseObject = null;
    this._fetchController = null;
    this._overrideMimeType = null;
    this._responseTextCache = null;
    this._responseXMLCache = null;

    this._resourceLoader = window._resourceLoader;
    this._requestManager = _ownerDocument?._requestManager || null;
    this._cookieJar = _ownerDocument?._cookieJar || null;
    this._origin = window._origin || "null";
    this._userAgent = window.navigator.userAgent;
    this._referrer = _ownerDocument?.URL || "";

    this._timeoutId = 0;
    this._timeoutStart = 0;
  }

  get responseURL() {
    if (!this._response.url) {
      return "";
    }
    return serializeURL(this._response.url, true);
  }

  get status() {
    return this._response.status;
  }

  get statusText() {
    return this._response.statusMessage;
  }

  get responseType() {
    return this._responseType;
  }

  set responseType(value) {
    if (!isWindowGlobalObject(this)) {
      if (value === "document") {
        return;
      }
    }

    if (this.readyState === READY_STATES.LOADING || this.readyState === READY_STATES.DONE) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (isWindowGlobalObject(this) && this._synchronousFlag) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }

    this._responseType = value;
  }

  get response() {
    if (this._responseType === "" || this._responseType === "text") {
      if (this.readyState !== READY_STATES.LOADING && this.readyState !== READY_STATES.DONE) {
        return "";
      }
      return getTextResponse(this);
    }

    if (this.readyState !== READY_STATES.DONE) {
      return null;
    }

    if (this._responseObject === FAILURE) {
      return null;
    }

    if (this._responseObject !== null) {
      return idlUtils.tryWrapperForImpl(this._responseObject);
    }

    if (this._responseType === "arraybuffer") {
      try {
        const buffer = copyToArrayBufferInTargetRealmDestructively(
          getReceivedBytes(this).buffer,
          this._globalObject
        );
        this._responseObject = buffer;
      } catch {
        this._responseObject = FAILURE;
        return null;
      }
    } else if (this._responseType === "blob") {
      const bytes = getReceivedBytes(this);
      this._responseObject = Blob.createImpl(this._globalObject, [
        [bytes],
        { type: getFinalMIMEType(this)?.toString() || "" }
      ]);
    } else if (this._responseType === "document") {
      setDocumentResponse(this);
    } else {
      const bytes = getReceivedBytes(this);
      if (!bytes || bytes.length === 0) {
        return null;
      }
      try {
        const jsonObject = parseJSONFromBytes(bytes);
        this._responseObject = jsonObject;
      } catch {
        return null;
      }
    }

    return idlUtils.tryWrapperForImpl(this._responseObject);
  }

  get responseText() {
    if (this._responseType !== "" && this._responseType !== "text") {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (this.readyState !== READY_STATES.LOADING && this.readyState !== READY_STATES.DONE) {
      return "";
    }

    return getTextResponse(this);
  }

  get responseXML() {
    if (this._responseType !== "" && this._responseType !== "document") {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (this.readyState !== READY_STATES.DONE) {
      return null;
    }

    if (this._responseObject === FAILURE) {
      return null;
    }

    if (this._responseObject !== null) {
      return idlUtils.tryWrapperForImpl(this._responseObject);
    }

    setDocumentResponse(this);
    return idlUtils.tryWrapperForImpl(this._responseObject);
  }

  get timeout() {
    return this._timeout;
  }

  set timeout(value) {
    if (this._synchronousFlag && isWindowGlobalObject(this)) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }

    this._timeout = value;

    clearTimeout(this._timeoutId);
    if (value > 0 && this._timeoutStart !== 0) {
      const elapsed = Date.now() - this._timeoutStart;
      this._timeoutId = setTimeout(() => this._onTimeout(), Math.max(0, value - elapsed));
    } else {
      this._timeoutStart = 0;
    }
  }

  get withCredentials() {
    return this._crossOriginCredentials;
  }

  set withCredentials(value) {
    if (!(this.readyState === READY_STATES.UNSENT || this.readyState === READY_STATES.OPENED)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    if (this._sendFlag) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }
    this._crossOriginCredentials = value;
  }

  abort() {
    if (this._fetchController) {
      this._fetchController.terminate();
    }

    if ((this.readyState === READY_STATES.OPENED && this._sendFlag) ||
        this.readyState === READY_STATES.HEADERS_RECEIVED ||
        this.readyState === READY_STATES.LOADING) {
      requestErrorSteps(this, "abort", DOMException.create(this._globalObject, [
        "The operation was aborted.",
        "AbortError"
      ]));
    }

    if (this.readyState === READY_STATES.DONE) {
      this.readyState = READY_STATES.UNSENT;
      this._response = makeNetworkErrorResponse();
    }
  }

  getResponseHeader(name) {
    return headerListGet(this._response.headerList, name);
  }

  getAllResponseHeaders() {
    const initialHeaders = headerListSortAndCombine(this._response.headerList);
    const headers = sortByLegacyUppercase(initialHeaders);

    let output = "";
    for (const header of headers) {
      output += `${header.name}: ${header.value}\r\n`;
    }

    return output;
  }

  open(method, url, async = true, username = null, password = null) {
    if (isWindowGlobalObject(this) && !this._ownerDocument) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (!tokenRegexp.test(method)) {
      throw DOMException.create(this._globalObject, [
        "The string did not match the expected pattern.",
        "SyntaxError"
      ]);
    }

    const upperMethod = method.toUpperCase();
    if (["CONNECT", "TRACE", "TRACK"].includes(upperMethod)) {
      throw DOMException.create(this._globalObject, ["The operation is insecure.", "SecurityError"]);
    }

    method = normalizeMethod(upperMethod);

    let parsedURL;
    try {
      parsedURL = new URL(url, this._ownerDocument.baseURLSerialized());
    } catch {
      throw DOMException.create(this._globalObject, [
        "The string did not match the expected pattern.",
        "SyntaxError"
      ]);
    }

    if (arguments.length < 3) {
      async = true;
      username = null;
      password = null;
    }

    if (parsedURL.host) {
      if (username !== null) {
        parsedURL.username = username;
      }
      if (password !== null) {
        parsedURL.password = password;
      }
    }

    if (async === false && isWindowGlobalObject(this) && (this._timeout !== 0 || this._responseType !== "")) {
      throw DOMException.create(this._globalObject, [
        "The object does not support the operation or argument.",
        "InvalidAccessError"
      ]);
    }

    if (this._fetchController) {
      this._fetchController.terminate();
    }

    this._sendFlag = false;
    this._uploadListenerFlag = false;
    this._requestMethod = method;
    this._requestURL = parsedURL;
    this._synchronousFlag = async === false;
    this._authorRequestHeaders = [];
    this._requestBody = null;
    this._response = makeNetworkErrorResponse();
    this._receivedBytes = new Uint8Array(0);
    this._rawReceivedLength = 0;
    this._lastProgressLoaded = null;
    this._responseObject = null;
    this._responseTextCache = null;
    this._responseXMLCache = null;

    if (this.readyState !== READY_STATES.OPENED) {
      setState(this, READY_STATES.OPENED);
    }
  }

  overrideMimeType(mime) {
    if (this.readyState === READY_STATES.LOADING || this.readyState === READY_STATES.DONE) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    let parsed = MIMEType.parse(mime);
    if (!parsed) {
      parsed = MIMEType.parse("application/octet-stream");
    }

    this._overrideMimeType = parsed;
  }

  send(body = null) {
    if (!this._ownerDocument) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (this.readyState !== READY_STATES.OPENED) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (this._sendFlag) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (this._requestMethod === "GET" || this._requestMethod === "HEAD") {
      body = null;
    }

    if (body !== null) {
      let extractedContentType = null;

      if (Document.isImpl(body)) {
        this._requestBody = utf8Encode(fragmentSerialization(body, { requireWellFormed: false }));
      } else {
        const bodyWithType = extractBody(body);
        this._requestBody = bodyWithType.body;
        extractedContentType = bodyWithType.type;
      }

      const originalAuthorContentType = headerListGet(this._authorRequestHeaders, "Content-Type");
      if (originalAuthorContentType !== null) {
        if (Document.isImpl(body) || typeof body === "string") {
          const contentTypeRecord = MIMEType.parse(originalAuthorContentType);
          if (contentTypeRecord && contentTypeRecord.parameters.has("charset")) {
            const charset = contentTypeRecord.parameters.get("charset");
            if (charset && charset.toLowerCase() !== "utf-8") {
              contentTypeRecord.parameters.set("charset", "UTF-8");
              headerListSet(this._authorRequestHeaders, "Content-Type", contentTypeRecord.toString());
            }
          }
        }
      } else {
        if (Document.isImpl(body)) {
          const isHTML = body._parsingMode === "html";
          const type = isHTML ? "text/html;charset=UTF-8" : "application/xml;charset=UTF-8";
          headerListSet(this._authorRequestHeaders, "Content-Type", type);
        } else if (extractedContentType !== null) {
          headerListSet(this._authorRequestHeaders, "Content-Type", extractedContentType);
        }
      }
    }

    if (this._requestBody && this._requestBody.byteLength === 0) {
      this._requestBody = null;
    }

    if (Object.keys(this.upload._eventListeners).length > 0) {
      this._uploadListenerFlag = true;
    }

    const request = {
      method: this._requestMethod,
      url: this._requestURL,
      headerList: this._authorRequestHeaders,
      body: this._requestBody,
      client: this._ownerDocument._globalObject,
      mode: "cors",
      useCORSPreflightFlag: this._uploadListenerFlag,
      credentialsMode: this._crossOriginCredentials ? "include" : "same-origin",
      useURLCredentialsFlag: !!(this._requestURL.username || this._requestURL.password),
      initiatorType: "xmlhttprequest",
      origin: this._origin,
      referrer: this._referrer,
      cookieJar: this._cookieJar,
      resourceLoader: this._resourceLoader,
      requestManager: this._requestManager,
      userAgent: this._userAgent,
      uploadListenerFlag: this._uploadListenerFlag,
      authCache: this._globalObject._xhrAuthCache || (this._globalObject._xhrAuthCache = {})
    };

    this._uploadCompleteFlag = false;
    this._timedOutFlag = false;
    if (request.body === null) {
      this._uploadCompleteFlag = true;
    }

    this._sendFlag = true;

    if (!this._synchronousFlag) {
      fireProgressEvent(this, "loadstart", 0, 0);

      this._lastProgressLoaded = null;
      let requestBodyTransmitted = 0;
      const requestBodyLength = request.body ? request.body.byteLength : 0;

      if (!this._uploadCompleteFlag && this._uploadListenerFlag) {
        fireProgressEvent(this.upload, "loadstart", requestBodyTransmitted, requestBodyLength);
      }

      if (this.readyState !== READY_STATES.OPENED || !this._sendFlag) {
        return;
      }

      let lastUploadProgress = 0;
      let lastBodyProgress = 0;
      const processRequestBodyChunkLength = bytesLength => {
        requestBodyTransmitted += bytesLength;
        if (Date.now() - lastUploadProgress < 50) {
          return;
        }
        lastUploadProgress = Date.now();
        if (this._uploadListenerFlag) {
          fireProgressEvent(this.upload, "progress", requestBodyTransmitted, requestBodyLength);
        }
      };

      const processRequestEndOfBody = () => {
        this._uploadCompleteFlag = true;
        if (!this._uploadListenerFlag) {
          return;
        }
        fireProgressEvent(this.upload, "progress", requestBodyTransmitted, requestBodyLength);
        fireProgressEvent(this.upload, "load", requestBodyTransmitted, requestBodyLength);
        fireProgressEvent(this.upload, "loadend", requestBodyTransmitted, requestBodyLength);
      };

      const processResponse = response => {
        this._response = response;

        handleErrors(this);
        if (isNetworkError(this._response)) {
          return;
        }

        setState(this, READY_STATES.HEADERS_RECEIVED);

        if (this.readyState !== READY_STATES.HEADERS_RECEIVED) {
          return;
        }

        if (!this._response.body) {
          handleResponseEndOfBody(this);
          return;
        }

        let length = extractLength(this._response.headerList);
        if (length === "failure" || !Number.isInteger(length)) {
          length = 0;
        }

        this._rawReceivedLength = 0;
        if (this._response.rawBody) {
          this._response.rawBody.on("data", chunk => {
            this._rawReceivedLength += chunk.length;
          });
        }

        const processBodyChunk = bytes => {
          this._receivedBytes = concatTypedArrays([this._receivedBytes, bytes]);
          this._responseObject = null;
          this._responseTextCache = null;
          this._responseXMLCache = null;

          if (Date.now() - lastBodyProgress < 50) {
            return;
          }
          lastBodyProgress = Date.now();

          if (this.readyState === READY_STATES.HEADERS_RECEIVED) {
            this.readyState = READY_STATES.LOADING;
          }
          fireReadyStateChange(this);
          const loaded = this._rawReceivedLength || this._receivedBytes.length;
          if (this._lastProgressLoaded !== loaded) {
            fireProgressEvent(this, "progress", loaded, length);
            this._lastProgressLoaded = loaded;
          }
        };

        const processEndOfBody = () => {
          handleResponseEndOfBody(this);
        };

        const processBodyError = () => {
          this._response = makeNetworkErrorResponse();
          handleErrors(this);
        };

        incrementallyRead(this._response.body, processBodyChunk, processEndOfBody, processBodyError);
      };

      this._fetchController = fetching(request, {
        processRequestBodyChunkLength,
        processRequestEndOfBody,
        processResponse
      });

      if (this._timeout > 0) {
        this._timeoutStart = Date.now();
        this._timeoutId = setTimeout(() => this._onTimeout(), this._timeout);
      }
      return;
    }

    const payload = serializeSyncRequest(this, request);
    const res = spawnSync(process.execPath, [syncWorkerFile], { input: payload, maxBuffer: Infinity });

    if (res.error) {
      throw res.error;
    }

    if (res.status !== 0) {
      const stderr = res.stderr ? res.stderr.toString() : "";
      throw new Error(stderr || "XMLHttpRequest sync worker failed");
    }

    const stdout = res.stdout ? res.stdout.toString() : "";
    const syncResponse = JSON.parse(stdout);
    applySyncResponse(this, syncResponse);
  }

  setRequestHeader(name, value) {
    if (this.readyState !== READY_STATES.OPENED) {
      throw DOMException.create(
        this._globalObject,
        ["setRequestHeader() can only be called in the OPENED state.", "InvalidStateError"]
      );
    }
    if (this._sendFlag) {
      throw DOMException.create(
        this._globalObject,
        ["setRequestHeader() cannot be called after send()", "InvalidStateError"]
      );
    }

    value = normalizeHeaderValue(value);

    if (!isHeaderName(name)) {
      throw DOMException.create(this._globalObject, ["Invalid header name", "SyntaxError"]);
    }
    if (!isHeaderValue(value)) {
      throw DOMException.create(this._globalObject, ["Invalid header value", "SyntaxError"]);
    }

    if (isForbiddenRequestHeader(name, value)) {
      return;
    }

    headerListCombine(this._authorRequestHeaders, name, value);
  }

  _onTimeout() {
    if (!this._sendFlag) {
      return;
    }
    this._timedOutFlag = true;
    this._fetchController?.terminate();
    requestErrorSteps(this, "timeout", DOMException.create(this._globalObject, [
      "The operation timed out.",
      "TimeoutError"
    ]));
  }
}

setupForSimpleEventAccessors(XMLHttpRequestImpl.prototype, ["readystatechange"]);

function isWindowGlobalObject(xhr) {
  return xhr._globalObject && xhr._globalObject.window === xhr._globalObject;
}

function normalizeMethod(method) {
  if (["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"].includes(method)) {
    return method;
  }
  return method;
}

function setState(xhr, state) {
  xhr.readyState = state;
  if (state !== READY_STATES.UNSENT) {
    fireReadyStateChange(xhr);
  }
}

function fireReadyStateChange(xhr) {
  fireAnEvent("readystatechange", xhr);
}

function fireProgressEvent(target, name, loaded, total) {
  const lengthComputable = Number.isInteger(total) && total !== 0;
  const eventInit = {
    lengthComputable,
    loaded: lengthComputable ? loaded : 0,
    total: lengthComputable ? total : 0
  };
  fireAnEvent(name, target, ProgressEvent, eventInit);
}

function isNetworkError(response) {
  return response && response.type === "error";
}

function handleErrors(xhr) {
  if (!xhr._sendFlag) {
    return;
  }

  if (xhr._timedOutFlag) {
    requestErrorSteps(xhr, "timeout", DOMException.create(xhr._globalObject, [
      "The operation timed out.",
      "TimeoutError"
    ]));
    return;
  }

  if (xhr._response.aborted) {
    requestErrorSteps(xhr, "abort", DOMException.create(xhr._globalObject, [
      "The operation was aborted.",
      "AbortError"
    ]));
    return;
  }

  if (isNetworkError(xhr._response)) {
    requestErrorSteps(xhr, "error", DOMException.create(xhr._globalObject, [
      "A network error occurred.",
      "NetworkError"
    ]));
  }
}

function requestErrorSteps(xhr, eventName, exception) {
  xhr.readyState = READY_STATES.DONE;
  xhr._sendFlag = false;
  xhr._response = makeNetworkErrorResponse();
  clearTimeout(xhr._timeoutId);
  xhr._timeoutId = 0;
  xhr._timeoutStart = 0;

  if (xhr._synchronousFlag) {
    throw exception;
  }

  fireReadyStateChange(xhr);

  if (!xhr._uploadCompleteFlag) {
    xhr._uploadCompleteFlag = true;

    if (xhr._uploadListenerFlag) {
      fireProgressEvent(xhr.upload, eventName, 0, 0);
      fireProgressEvent(xhr.upload, "loadend", 0, 0);
    }
  }

  fireProgressEvent(xhr, eventName, 0, 0);
  fireProgressEvent(xhr, "loadend", 0, 0);
}

function handleResponseEndOfBody(xhr) {
  handleErrors(xhr);
  if (isNetworkError(xhr._response)) {
    return;
  }

  const transmitted = xhr._rawReceivedLength || xhr._receivedBytes.length;
  let length = extractLength(xhr._response.headerList);
  if (length === "failure" || !Number.isInteger(length)) {
    length = 0;
  }

  if (!xhr._synchronousFlag && xhr._lastProgressLoaded !== transmitted) {
    fireProgressEvent(xhr, "progress", transmitted, length);
    xhr._lastProgressLoaded = transmitted;
  }

  xhr.readyState = READY_STATES.DONE;
  xhr._sendFlag = false;
  clearTimeout(xhr._timeoutId);
  xhr._timeoutId = 0;
  xhr._timeoutStart = 0;
  fireReadyStateChange(xhr);
  fireProgressEvent(xhr, "load", transmitted, length);
  fireProgressEvent(xhr, "loadend", transmitted, length);
}

function getResponseMIMEType(xhr) {
  const mimeType = extractMIMEType(xhr._response.headerList);
  if (mimeType === "failure") {
    return MIMEType.parse("text/xml");
  }
  return mimeType;
}

function getFinalMIMEType(xhr) {
  if (!xhr._overrideMimeType) {
    return getResponseMIMEType(xhr);
  }
  return xhr._overrideMimeType;
}

function getFinalEncoding(xhr) {
  let label = null;
  const responseMIME = getResponseMIMEType(xhr);
  if (responseMIME && responseMIME.parameters.has("charset")) {
    label = responseMIME.parameters.get("charset");
  }
  if (xhr._overrideMimeType && xhr._overrideMimeType.parameters.has("charset")) {
    label = xhr._overrideMimeType.parameters.get("charset");
  }
  if (label === null) {
    return null;
  }
  return labelToName(label) || null;
}

function setDocumentResponse(xhr) {
  if (!xhr._response.body) {
    return;
  }

  const finalMIME = getFinalMIMEType(xhr);
  if (!finalMIME || (!finalMIME.isHTML() && !finalMIME.isXML())) {
    return;
  }

  if (xhr._responseType === "" && finalMIME.isHTML()) {
    return;
  }

  const bytes = getReceivedBytes(xhr);
  let charset = getFinalEncoding(xhr);

  if (finalMIME.isHTML()) {
    if (!charset) {
      charset = labelToName(getBOMEncoding(bytes)) || null;
    }
    if (!charset) {
      charset = "UTF-8";
    }
  }

  let document;
  if (finalMIME.isHTML()) {
    document = Document.createImpl(xhr._globalObject, [], {
      options: {
        url: xhr.responseURL,
        contentType: finalMIME.toString(),
        lastModified: new Date(),
        parsingMode: "html",
        cookieJar: { setCookieSync: () => undefined, getCookieStringSync: () => "" },
        encoding: charset,
        parseOptions: xhr._ownerDocument._parseOptions
      }
    });

    parseIntoDocument(legacyHookDecode(bytes, charset), document);
  } else {
    try {
      document = Document.createImpl(xhr._globalObject, [], {
        options: {
          url: xhr.responseURL,
          contentType: finalMIME.toString(),
          lastModified: new Date(),
          parsingMode: "xml",
          cookieJar: { setCookieSync: () => undefined, getCookieStringSync: () => "" },
          encoding: charset || "UTF-8",
          parseOptions: xhr._ownerDocument._parseOptions
        }
      });
      parseIntoDocument(legacyHookDecode(bytes, charset || "UTF-8"), document);
    } catch {
      xhr._responseObject = null;
      return;
    }
  }

  document.close();
  xhr._responseObject = document;
}

function getTextResponse(xhr) {
  if (!xhr._response.body) {
    return "";
  }

  if (xhr._responseTextCache) {
    return xhr._responseTextCache;
  }

  const bytes = getReceivedBytes(xhr);
  if (bytes.length === 0) {
    return "";
  }

  let charset = getFinalEncoding(xhr);
  const finalMIME = getFinalMIMEType(xhr);
  if (xhr._responseType === "" && charset === null && finalMIME && finalMIME.isXML()) {
    charset = labelToName(getBOMEncoding(bytes)) || null;
  }
  if (!charset) {
    charset = "UTF-8";
  }

  xhr._responseTextCache = legacyHookDecode(bytes, charset);
  return xhr._responseTextCache;
}

function getReceivedBytes(xhr) {
  return xhr._receivedBytes || new Uint8Array(0);
}

function extractBody(bodyInit) {
  if (Blob.isImpl(bodyInit)) {
    return {
      body: bodyInit._bytes,
      type: bodyInit.type === "" ? null : bodyInit.type
    };
  }
  if (isArrayBuffer(bodyInit)) {
    return {
      body: new Uint8Array(bodyInit).slice(0),
      type: null
    };
  }
  if (ArrayBuffer.isView(bodyInit)) {
    return {
      body: new Uint8Array(bodyInit),
      type: null
    };
  }
  if (FormData.isImpl(bodyInit)) {
    const { boundary, outputChunks } = serializeEntryList(bodyInit._entries);
    return {
      body: concatTypedArrays(outputChunks),
      type: "multipart/form-data; boundary=" + utf8Decoder.decode(boundary)
    };
  }

  return {
    body: utf8Encode(bodyInit),
    type: "text/plain;charset=UTF-8"
  };
}

function serializeSyncRequest(xhr, request) {
  const payload = {
    method: request.method,
    url: request.url.href,
    headers: request.headerList,
    body: request.body,
    responseType: xhr._responseType,
    timeout: xhr._timeout,
    withCredentials: xhr._crossOriginCredentials,
    overrideMimeType: xhr._overrideMimeType ? xhr._overrideMimeType.toString() : null,
    origin: xhr._origin,
    referrer: xhr._referrer,
    userAgent: xhr._userAgent,
    cookieJar: xhr._cookieJar ? xhr._cookieJar.serializeSync() : null,
    authCache: xhr._globalObject._xhrAuthCache || {}
  };

  return JSON.stringify(payload, (key, value) => {
    if (value instanceof Uint8Array) {
      return { type: "Uint8Array", data: Array.from(value) };
    }
    return value;
  });
}

function applySyncResponse(xhr, response) {
  if (response.error) {
    throw new Error(response.error);
  }

  if (response.receivedBytes?.data) {
    xhr._receivedBytes = new Uint8Array(response.receivedBytes.data);
  } else {
    xhr._receivedBytes = new Uint8Array(0);
  }
  xhr._rawReceivedLength = xhr._receivedBytes.length;

  if (response.response && response.response.url) {
    response.response.url = parseURL(response.response.url);
  }
  if (response.response && xhr._receivedBytes.length > 0) {
    response.response.body = response.response.body || {};
  }
  xhr._response = response.response || makeNetworkErrorResponse();
  xhr._responseObject = null;
  xhr._responseTextCache = null;
  xhr._responseXMLCache = null;
  if (response.authCache) {
    xhr._globalObject._xhrAuthCache = response.authCache;
  }

  handleResponseEndOfBody(xhr);
}

exports.implementation = XMLHttpRequestImpl;
