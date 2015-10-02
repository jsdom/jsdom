"use strict";

const request = require("request");
const EventEmitter = require("events").EventEmitter;
const fs = require("fs");

const utils = require("../utils");
const xhrSymbols = require("./xmlhttprequest-symbols");
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
exports.createClient = function createClient(xhr, callback) {
  const properties = xhr[xhrSymbols.properties];
  const flag = xhr[xhrSymbols.flag];
  const urlObj = new utils.URL(flag.uri);
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
        abort() {
          xhr.abort();
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
    if (flag.method !== "GET") {
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

    if (flag.method === "GET") {
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

  const requestHeaders = {};

  for (const header in flag.requestHeaders) {
    requestHeaders[header] = flag.requestHeaders[header];
  }

  if (!getRequestHeader(flag.requestHeaders, "Referer")) {
    requestHeaders.Referer = flag.baseUrl;
  }
  if (!getRequestHeader(flag.requestHeaders, "User-Agent")) {
    requestHeaders["User-Agent"] = flag.userAgent;
  }
  if (!getRequestHeader(flag.requestHeaders, "Accept-Language")) {
    requestHeaders["Accept-Language"] = "en";
  }
  if (!getRequestHeader(flag.requestHeaders, "Accept")) {
    requestHeaders.Accept = "*/*";
  }

  const options = {
    uri,
    method: flag.method,
    headers: requestHeaders,
    gzip: true,
    maxRedirects: 21,
    followAllRedirects: true
  };
  if (flag.auth) {
    options.auth = {
      user: flag.auth.user || "",
      pass: flag.auth.pass || "",
      sendImmediately: false
    };
  }
  if (xhr._ownerDocument._cookieJar) {
    options.jar = wrapCookieJarForRequest(xhr._ownerDocument._cookieJar);
  }

  if (requestManager) {
    options.pool = requestManager.pool;
    options.agentOptions = requestManager.agentOptions;
  }
  const body = flag.body;
  if (body !== undefined &&
      body !== null &&
      body !== "" &&
      !(flag.method === "HEAD" || flag.method === "GET")) {
    if (flag.formData) {
      options.formData = body;
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
        abort() {
          xhr.abort();
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

