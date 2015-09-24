"use strict";

var resolveHref = require("../utils").resolveHref;
var URL = require("url");
var fs = require("fs");
var request = require("request");
const documentBaseURL = require("../living/helpers/document-base-url").documentBaseURL;
const NODE_TYPE = require("../living/node-type");

var IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";

function createResourceLoadHandler(element, resourceUrl, document, loadCallback) {
  return function (err, data) {
    var ev = document.createEvent("HTMLEvents");

    if (!err) {
      try {
        loadCallback.call(element, data, resourceUrl);
        ev.initEvent("load", false, false);
      }
      catch (e) {
        err = e;
      }
    }

    if (err) {
      ev.initEvent("error", false, false);
      ev.error = err;

      var error = new Error(`Could not load ${element.localName}: "${resourceUrl}"`);
      error.detail = err;
      document._defaultView._virtualConsole.emit("jsdomError", error);
    }

    element.dispatchEvent(ev);
  };
}

exports.readFile = function (filePath, callback) {
  var readableStream = fs.createReadStream(filePath);

  readableStream.setEncoding("utf8");

  var data = "";

  readableStream.on("error", callback);

  readableStream.on("data", function (chunk) {
    data += chunk;
  });

  readableStream.on("end", function () {
    callback(null, data);
  });

  return {
    abort: function (emitEvent) {
      readableStream.destroy();
      if (emitEvent) {
        callback(new Error("request cancelled by user"));
      }
    }
  };
};

// NOTE: request wraps tough-cookie cookie jar
// (see: https://github.com/request/request/blob/master/lib/cookies.js).
// Therefore, to pass our cookie jar to the request, we need to create
// request's wrapper and monkey patch it with our jar.
function wrapCookieJarForRequest(cookieJar) {
  var jarWrapper = request.jar();
  jarWrapper._jar = cookieJar;
  return jarWrapper;
}

function fetch(element, urlObj, cookieJar, referrer, requestManager, callback) {
  var req;
  var _callback = requestManager ? function () {
    requestManager.remove(req);
    callback.apply(this, arguments);
  } : callback;
  if (urlObj.protocol === "data:") {
    process.nextTick(function () {
      var pathname = urlObj.href.match(/^data:(.+?)(?:;(base64))?,(.*)$/);
      var buffer = pathname[2] === "base64" ? new Buffer(pathname[3], "base64") : new Buffer(pathname[3]);
      callback(null, buffer.toString());
    });
  } else if (urlObj.hostname) {
    var requestOptions = {};
    if (requestManager) {
      requestOptions.pool = requestManager.pool;
      requestOptions.agentOptions = requestManager.agentOptions;
      requestOptions.headers = {
        "User-Agent": requestManager.userAgent
      };
      if (element._accept) {
        requestOptions.headers.Accept = element._accept;
      }
    }
    req = exports.download(urlObj, requestOptions, cookieJar, referrer, _callback);
  } else {
    var filePath = urlObj.pathname
      .replace(/^file:\/\//, "")
      .replace(/^\/([a-z]):\//i, "$1:/")
      .replace(/%20/g, " ");
    req = exports.readFile(filePath, _callback);
  }
  if (requestManager && req) {
    requestManager.add(req);
  }
  return req;
}

exports.enqueue = function (element, resourceUrl, callback) {
  var document = element.nodeType === NODE_TYPE.DOCUMENT_NODE ? element : element._ownerDocument;

  if (document._queue) {
    var loadHandler = createResourceLoadHandler(element, resourceUrl || document.URL, document, callback);
    return document._queue.push(loadHandler);
  } else {
    return function () {
    };
  }
};

exports.resolveResourceUrl = function (document, url) {
  // if getAttribute returns null, there is no href
  // lets resolve to an empty string (nulls are not expected farther up)
  if (url === null) {
    return "";
  }

  var baseUrl = documentBaseURL(document);
  return resolveHref(baseUrl, url);
};


function objGetter(obj, prop) {
  var lprop = prop.toLowerCase();
  for (var p in obj) {
    if (obj.hasOwnProperty(p) && lprop === p.toLowerCase()) {
      return obj[p];
    }
  }
  return null;
}

exports.download = function (url, options, cookieJar, referrer, callback) {
  options = options || {};
  options.gzip = true;
  options.jar = wrapCookieJarForRequest(cookieJar);
  options.headers = options.headers || {};
  if (referrer && !IS_BROWSER) {
    options.headers.referer = referrer;
  }
  if (!objGetter(options.headers, "Accept")) {
    options.headers.Accept = "*/*";
  }
  if (!objGetter(options.headers, "Accept-Language")) {
    options.headers["Accept-Language"] = "en";
  }

  var req = request(url, options, function (error, response, data) {
    callback(error, data, response);
  });
  return {
    abort: function (emitEvent) {
      req.abort();
      if (emitEvent) {
        callback(new Error("request cancelled by user"));
      }
    }
  };
};

exports.load = function (element, url, callback) {
  var document = element._ownerDocument;
  var documentImpl = document.implementation;

  if (!documentImpl._hasFeature("FetchExternalResources", element.tagName.toLowerCase())) {
    return;
  }

  // if getAttribute returns null, there is no href
  // lets resolve to an empty string (nulls are not expected farther up)
  var resourceUrl = exports.resolveResourceUrl(document, url);

  if (documentImpl._hasFeature("SkipExternalResources", resourceUrl)) {
    return false;
  }

  var urlObj = URL.parse(resourceUrl);
  var baseUrl = documentBaseURL(document);
  var cookieJar = document._cookieJar;
  var enqueued = exports.enqueue(element, resourceUrl, callback);
  var customLoader = document._customResourceLoader;
  var requestManager = document._requestManager;

  if (typeof customLoader === "function") {
    var req = customLoader.call(null, {
      element: element,
      url: urlObj,
      cookie: cookieJar.getCookieStringSync(urlObj, {http: true}),
      baseUrl: baseUrl,
      defaultFetch: function (callback) {
        return fetch(element, urlObj, cookieJar, baseUrl, requestManager, callback);
      }
    }, function () {
      if (req && requestManager) {
        requestManager.remove(req);
      }
      enqueued.apply(this, arguments);
    });
    if (req && requestManager) {
      requestManager.add(req);
    }
  } else {
    fetch(element, urlObj, cookieJar, baseUrl, requestManager, enqueued);
  }
};
