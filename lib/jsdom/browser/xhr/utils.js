"use strict";

var request = require("request");
var url = require("url");
var EventEmitter = require("events").EventEmitter;
var fs = require("fs");

var FormData = require("./formdata");
var Blob = require("../file/blob");

var utils = {};

function wrapCookieJarForRequest(cookieJar) {
  var jarWrapper = request.jar();
  jarWrapper._jar = cookieJar;
  return jarWrapper;
}

function getRequestHeader(requestHeaders, header) {
  var keys = Object.keys(requestHeaders);
  var n = keys.length;
  while (n--) {
    var key = keys[n];
    if (key.toLowerCase() === header.toLowerCase()) {
      return requestHeaders[key];
    }
  }
  return null;
}

utils.getRequestHeader = getRequestHeader;

var base64Regexp = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

utils.createClient = function createClient(settings, body, callback, callbackError) {
  var xhr = this;
  var window = settings.options.window;
  var baseUrl = window.document.URL === "about:blank" ? window.parent.document.URL : window.document.URL;
  var uri = url.resolve(baseUrl.toString(), settings.uri);
  var urlObj = url.parse(uri);
  var response;
  var client;
  var req;
  var rmReq;

  var requestManager = window.document._requestManager;

  if (urlObj.protocol === "file:") {
    response = new EventEmitter();
    response.statusCode = 200;
    response.rawHeaders = [];
    response.headers = {};
    var filePath = urlObj.pathname
      .replace(/^file:\/\//, "")
      .replace(/^\/([a-z]):\//i, "$1:/")
      .replace(/%20/g, " ");

    client = new EventEmitter();

    var readableStream = fs.createReadStream(filePath);

    readableStream.setEncoding("utf8");

    readableStream.on("data", function (chunk) {
      response.emit("data", new Buffer(chunk));
      client.emit("data", new Buffer(chunk));
    });

    readableStream.on("end", function () {
      response.emit("end");
      client.emit("end");
    });

    readableStream.on("error", function (err) {
      response.emit("error", err);
      client.emit("error", err);
    });

    client.abort = function () {
      readableStream.destroy();
      client.emit("abort");
    };

    if (requestManager) {
      req = {
        abort: function (emitEvent) {
          if (!emitEvent) {
            client.abort();
            clearTimeout(xhr._flag.timeoutId);
            xhr._flag.timeoutFn = null;
            xhr._flag.timeoutStart = 0;
          } else {
            xhr.abort();
          }
        }
      };
      requestManager.add(req);
      rmReq = requestManager.remove.bind(requestManager, req);
      client.on("abort", rmReq);
      client.on("error", rmReq);
      client.on("end", rmReq);
    }

    process.nextTick(function () {
      callback(response);
    });

    return client;
  }

  if (urlObj.protocol === "data:") {
    response = new EventEmitter();

    var pathname = decodeURI(uri).match(/^data:(.+?)(?:;(base64))?,(.*)$/);
    var buffer;
    if (settings.method !== "GET") {
      buffer =  new Buffer("");
    } else if (pathname[2] === "base64") {
      if (!base64Regexp.test(pathname[3])) {
        process.nextTick(function () {
          callbackError(new Error("Not a base64 string"));
        });
        return;
      }
      buffer = new Buffer(pathname[3], "base64");
    } else {
      buffer = new Buffer(pathname[3]);
    }

    response.statusCode = settings.method !== "GET" ? 0 : 200;
    response.rawHeaders = settings.method !== "GET" ? {} : (pathname[1] ? ["Content-Type", pathname[1]] : {});
    response.headers = settings.method !== "GET" ? {} : (pathname[1] ? {"content-type": pathname[1] } : {});

    client = new EventEmitter();

    client.abort = function () {};

    process.nextTick(function () {
      callback(response);
      process.nextTick(function () {
        response.emit("data", buffer);
        client.emit("data", buffer);
        response.emit("end");
        client.emit("end");
      });
    });

    return client;
  }

  if (!getRequestHeader(settings.requestHeaders, "Referer")) {
    settings.requestHeaders.Referer = baseUrl;
  }
  if (!getRequestHeader(settings.requestHeaders, "User-Agent")) {
    settings.requestHeaders["User-Agent"] = window.navigator.userAgent;
  }
  if (!getRequestHeader(settings.requestHeaders, "Accept-Language")) {
    settings.requestHeaders["Accept-Language"] = "en";
  }
  if (!getRequestHeader(settings.requestHeaders, "Accept")) {
    settings.requestHeaders.Accept = "*/*";
  }

  var options = {
    uri: uri,
    method: settings.method,
    headers: settings.requestHeaders,
    gzip: true,
    maxRedirects: 21,
    followAllRedirects: true
  };
  if (settings.auth) {
    options.auth = settings.auth;
    delete urlObj.auth;
    options.uri = url.format(urlObj);
  }
  if (window.document._cookieJar) {
    options.jar = wrapCookieJarForRequest(window.document._cookieJar);
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
      options.formData = body._formData;
    } else if (body instanceof Blob) {
      options.body = body._buffer;
    } else if (body instanceof ArrayBuffer) {
      options.body = new Buffer(new Uint8Array(body));
    } else if (typeof body !== "string") {
      options.body = String(body);
    } else {
      options.body = body;
    }
  }
  try {
    client = request(options)
    .on("response", callback)
    .on("error", callbackError);
  } catch (e) {
    process.nextTick(function () {
      callbackError(e);
    });
  }

  if (requestManager) {
    req = {
      abort: function (emitEvent) {
        if (!emitEvent) {
          client.abort();
          clearTimeout(xhr._flag.timeoutId);
          xhr._flag.timeoutFn = null;
          xhr._flag.timeoutStart = 0;
        } else {
          xhr.abort();
        }
      }
    };
    requestManager.add(req);
    rmReq = requestManager.remove.bind(requestManager, req);
    client.on("abort", rmReq);
    client.on("error", rmReq);
    client.on("end", rmReq);
  }

  return client;
};

module.exports = utils;

