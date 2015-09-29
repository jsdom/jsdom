"use strict";

const resolveHref = require("../utils").resolveHref;
const fs = require("fs");
const request = require("request");
const documentBaseURL = require("../living/helpers/document-base-url").documentBaseURL;
const internalConstants = require("../living/helpers/internal-constants");
const NODE_TYPE = require("../living/node-type");

/* eslint-disable no-restricted-modules */
// TODO: stop using the built-in URL in favor of the spec-compliant whatwg-url package
// This legacy usage is in the process of being purged.
const URL = require("url");
/* eslint-enable no-restricted-modules */

const IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";

function createResourceLoadHandler(element, resourceUrl, document, loadCallback) {
  return function (err, data) {
    const ev = document.createEvent("HTMLEvents");

    if (!err) {
      try {
        loadCallback.call(element, data, resourceUrl);
        ev.initEvent("load", false, false);
      } catch (e) {
        err = e;
      }
    }

    if (err) {
      ev.initEvent("error", false, false);
      ev.error = err;

      const error = new Error(`Could not load ${element.localName}: "${resourceUrl}"`);
      error.detail = err;
      document._defaultView._virtualConsole.emit("jsdomError", error);
    }

    element.dispatchEvent(ev);
  };
}

exports.readFile = function (filePath, callback) {
  const readableStream = fs.createReadStream(filePath);

  readableStream.setEncoding("utf8");

  let data = "";

  readableStream.on("error", callback);

  readableStream.on("data", chunk => {
    data += chunk;
  });

  readableStream.on("end", () => {
    callback(null, data);
  });

  return {
    abort(emitEvent) {
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
  const jarWrapper = request.jar();
  jarWrapper._jar = cookieJar;
  return jarWrapper;
}

function fetch(element, urlObj, cookieJar, referrer, requestManager, callback) {
  let req;
  const wrappedCallback = requestManager ? function () {
    requestManager.remove(req);
    callback.apply(this, arguments);
  } : callback;
  if (urlObj.protocol === "data:") {
    process.nextTick(() => {
      const pathname = urlObj.href.match(/^data:(.+?)(?:;(base64))?,(.*)$/);
      const buffer = pathname[2] === "base64" ? new Buffer(pathname[3], "base64") : new Buffer(pathname[3]);
      callback(null, buffer.toString());
    });
  } else if (urlObj.hostname) {
    const requestOptions = {};
    if (requestManager) {
      requestOptions.pool = requestManager.pool;
      requestOptions.agentOptions = requestManager.agentOptions;
      requestOptions.headers = {
        "User-Agent": requestManager.userAgent
      };
      if (element[internalConstants.accept]) {
        requestOptions.headers.Accept = element[internalConstants.accept];
      }
    }
    req = exports.download(urlObj, requestOptions, cookieJar, referrer, wrappedCallback);
  } else {
    const filePath = urlObj.pathname
      .replace(/^file:\/\//, "")
      .replace(/^\/([a-z]):\//i, "$1:/")
      .replace(/%20/g, " ");
    req = exports.readFile(filePath, wrappedCallback);
  }
  if (requestManager && req) {
    requestManager.add(req);
  }
  return req;
}

exports.enqueue = function (element, resourceUrl, callback) {
  const document = element.nodeType === NODE_TYPE.DOCUMENT_NODE ? element : element._ownerDocument;

  if (document._queue) {
    const loadHandler = createResourceLoadHandler(element, resourceUrl || document.URL, document, callback);
    return document._queue.push(loadHandler);
  }

  return function () { };
};

exports.resolveResourceUrl = function (document, url) {
  // if getAttribute returns null, there is no href
  // lets resolve to an empty string (nulls are not expected farther up)
  if (url === null) {
    return "";
  }

  const baseUrl = documentBaseURL(document);
  return resolveHref(baseUrl, url);
};


function objGetter(obj, prop) {
  const lprop = prop.toLowerCase();
  for (const p in obj) {
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

  const req = request(url, options, (error, response, data) => callback(error, data, response));
  return {
    abort(emitEvent) {
      req.abort();
      if (emitEvent) {
        callback(new Error("request cancelled by user"));
      }
    }
  };
};

exports.load = function (element, url, callback) {
  const document = element._ownerDocument;
  const documentImpl = document.implementation;

  if (!documentImpl._hasFeature("FetchExternalResources", element.tagName.toLowerCase())) {
    return;
  }

  // if getAttribute returns null, there is no href
  // lets resolve to an empty string (nulls are not expected farther up)
  const resourceUrl = exports.resolveResourceUrl(document, url);

  if (documentImpl._hasFeature("SkipExternalResources", resourceUrl)) {
    return;
  }

  const urlObj = URL.parse(resourceUrl);
  const baseUrl = documentBaseURL(document);
  const cookieJar = document._cookieJar;
  const enqueued = exports.enqueue(element, resourceUrl, callback);
  const customLoader = document._customResourceLoader;
  const requestManager = document[internalConstants.requestManager];

  if (typeof customLoader === "function") {
    let req = null;
    function wrappedEnqueued() {
      if (req && requestManager) {
        requestManager.remove(req);
      }
      enqueued.apply(this, arguments);
    }
    req = customLoader({
      element,
      url: urlObj,
      cookie: cookieJar.getCookieStringSync(urlObj, { http: true }),
      baseUrl,
      defaultFetch(fetchCallback) {
        return fetch(element, urlObj, cookieJar, baseUrl, requestManager, fetchCallback);
      }
    },
    wrappedEnqueued);
    if (req && requestManager) {
      requestManager.add(req);
    }
  } else {
    fetch(element, urlObj, cookieJar, baseUrl, requestManager, enqueued);
  }
};
