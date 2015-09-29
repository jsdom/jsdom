"use strict";

const request = require("request");
const EventEmitter = require("events").EventEmitter;
const fs = require("fs");

const utils = require("../utils");
const blobSymbols = require("./blob-symbols");
const formDataSymbols = require("./form-data-symbols");
const xhrSymbols = require("./xmlhttprequest-symbols");
const documentBaseURLHelper = require("./helpers/document-base-url");
const internalConstants = require("./helpers/internal-constants");

function wrapCookieJarForRequest(cookieJar) {
  const jarWrapper = request.jar();
  jarWrapper._jar = cookieJar;
  return jarWrapper;
}

function getRequestHeader(requestHeaders, header) {
  const keys = Object.keys(requestHeaders);
  let n = keys.length;
  while (n--) {
    const key = keys[n];
    if (key.toLowerCase() === header.toLowerCase()) {
      return requestHeaders[key];
    }
  }
  return null;
}

exports.getRequestHeader = getRequestHeader;

const base64Regexp = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

// return a "request" client object or an event emitter matching the same behaviour for unsupported protocols
// the callback should be called with a "request" response object or an event emitter matching the same behaviour too
exports.createClient = function createClient(core, xhr, body, callback) {
  const FormData = core.FormData;
  const Blob = core.Blob;

  const settings = xhr[xhrSymbols.properties];
  const urlObj = new utils.URL(settings.uri);
  const uri = urlObj.href;

  const requestManager = xhr._ownerDocument[internalConstants.requestManager];

  if (urlObj.protocol === "file:") {
    const response = new EventEmitter();
    response.statusCode = 200;
    response.rawHeaders = [];
    response.headers = {};
    const filePath = urlObj.pathname
      .replace(/^file:\/\//, "")
      .replace(/^\/([a-z]):\//i, "$1:/")
      .replace(/%20/g, " ");

    const client = new EventEmitter();

    const readableStream = fs.createReadStream(filePath);

    readableStream.setEncoding("utf8");

    readableStream.on("data", chunk => {
      response.emit("data", new Buffer(chunk));
      client.emit("data", new Buffer(chunk));
    });

    readableStream.on("end", () => {
      response.emit("end");
      client.emit("end");
    });

    readableStream.on("error", err => {
      response.emit("error", err);
      client.emit("error", err);
    });

    client.abort = function () {
      readableStream.destroy();
      client.emit("abort");
    };

    if (requestManager) {
      const req = {
        abort(emitEvent) {
          if (!emitEvent) {
            client.abort();
            clearTimeout(xhr[xhrSymbols.flag].timeoutId);
            xhr[xhrSymbols.flag].timeoutFn = null;
            xhr[xhrSymbols.flag].timeoutStart = 0;
          } else {
            xhr.abort();
          }
        }
      };
      requestManager.add(req);
      const rmReq = requestManager.remove.bind(requestManager, req);
      client.on("abort", rmReq);
      client.on("error", rmReq);
      client.on("end", rmReq);
    }

    process.nextTick(() => callback(null, response));

    return client;
  }

  if (urlObj.protocol === "data:") {
    const response = new EventEmitter();

    const pathname = decodeURI(uri).match(/^data:(.+?)(?:;(base64))?,(.*)$/);
    let buffer;
    if (settings.method !== "GET") {
      buffer = new Buffer("");
    } else if (pathname[2] === "base64") {
      if (!base64Regexp.test(pathname[3])) {
        process.nextTick(() => callback(new Error("Not a base64 string"), null));
        return null;
      }
      buffer = new Buffer(pathname[3], "base64");
    } else {
      buffer = new Buffer(pathname[3]);
    }

    if (settings.method === "GET") {
      response.statusCode = 200;
      response.rawHeaders = pathname[1] ? ["Content-Type", pathname[1]] : [];
      response.headers = pathname[1] ? { "content-type": pathname[1] } : {};
    } else {
      response.statusCode = 0;
      response.rawHeaders = {};
      response.headers = {};
    }

    const client = new EventEmitter();

    client.abort = function () {};

    process.nextTick(() => {
      callback(null, response);
      process.nextTick(() => {
        response.emit("data", buffer);
        client.emit("data", buffer);
        response.emit("end");
        client.emit("end");
      });
    });

    return client;
  }

  if (!getRequestHeader(settings.requestHeaders, "Referer")) {
    settings.requestHeaders.Referer = documentBaseURLHelper.documentBaseURL(xhr._ownerDocument);
  }
  if (!getRequestHeader(settings.requestHeaders, "User-Agent")) {
    settings.requestHeaders["User-Agent"] = xhr._ownerDocument._defaultView.navigator.userAgent;
  }
  if (!getRequestHeader(settings.requestHeaders, "Accept-Language")) {
    settings.requestHeaders["Accept-Language"] = "en";
  }
  if (!getRequestHeader(settings.requestHeaders, "Accept")) {
    settings.requestHeaders.Accept = "*/*";
  }

  const options = {
    uri,
    method: settings.method,
    headers: settings.requestHeaders,
    gzip: true,
    maxRedirects: 21,
    followAllRedirects: true
  };
  if (settings.auth) {
    options.auth = settings.auth;
  }
  if (xhr._ownerDocument._cookieJar) {
    options.jar = wrapCookieJarForRequest(xhr._ownerDocument._cookieJar);
  }

  if (requestManager) {
    options.pool = requestManager.pool;
    options.agentOptions = requestManager.agentOptions;
  }
  if (body !== undefined &&
      body !== null &&
      body !== "" &&
      !(settings.method === "HEAD" || settings.method === "GET")) {
    if (body instanceof FormData) {
      options.formData = body[formDataSymbols.formData];
    } else if (body instanceof Blob) {
      options.body = body[blobSymbols.buffer];
    } else if (body instanceof ArrayBuffer) {
      options.body = new Buffer(new Uint8Array(body));
    } else if (typeof body !== "string") {
      options.body = String(body);
    } else {
      options.body = body;
    }
  }
  try {
    const client = request(options)
    .on("response", response => callback(null, response))
    .on("error", callback);

    if (requestManager) {
      const req = {
        abort(emitEvent) {
          if (!emitEvent) {
            client.abort();
            clearTimeout(xhr[xhrSymbols.flag].timeoutId);
            xhr[xhrSymbols.flag].timeoutFn = null;
            xhr[xhrSymbols.flag].timeoutStart = 0;
          } else {
            xhr.abort();
          }
        }
      };
      requestManager.add(req);
      const rmReq = requestManager.remove.bind(requestManager, req);
      client.on("abort", rmReq);
      client.on("error", rmReq);
      client.on("end", rmReq);
    }

    return client;
  } catch (e) {
    process.nextTick(() => callback(e));
    return null;
  }
};

