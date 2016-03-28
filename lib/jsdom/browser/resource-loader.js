"use strict";

const resolveHref = require("../utils").resolveHref;
const parseDataUrl = require("../utils").parseDataUrl;
const fs = require("fs");
const request = require("request");
const documentBaseURL = require("../living/helpers/document-base-url").documentBaseURL;
const NODE_TYPE = require("../living/node-type");

/* eslint-disable no-restricted-modules */
// TODO: stop using the built-in URL in favor of the spec-compliant whatwg-url package
// This legacy usage is in the process of being purged.
const URL = require("url");
/* eslint-enable no-restricted-modules */

const IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";

function createResourceLoadHandler(element, resourceUrl, document, loadCallback) {
  return (err, data, response) => {
    const ev = document.createEvent("HTMLEvents");

    if (!err) {
      try {
        loadCallback.call(element, data, resourceUrl, response);
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

exports.readFile = function (filePath, callback, encoding) {
  const readableStream = fs.createReadStream(filePath);

  let data = new Buffer(0);

  readableStream.on("error", callback);

  readableStream.on("data", chunk => {
    data = Buffer.concat([data, chunk]);
  });

  readableStream.on("end", () => {
    // Passing null for encoding means binary, otherwise the default is utf8
    callback(null, encoding === null ? data : data.toString(encoding || "utf8"));
  });

  return {
    abort() {
      readableStream.destroy();
      callback(new Error("request canceled by user"));
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

function fetch(element, urlObj, cookieJar, referrer, pool, agentOptions, strictSSL, userAgent, callback, encoding) {
  let req = null;
  if (urlObj.protocol === "data:") {
    try {
      const data = parseDataUrl(urlObj.href);
      // If encoding is null, pass on binary data.
      callback(null, encoding === null ? data.buffer : data.buffer.toString(encoding), {
        headers: { "content-type": data.type }
      });
    } catch (err) {
      callback(err, null);
    }
  } else if (urlObj.hostname) {
    const requestOptions = {
      pool,
      agentOptions,
      strictSSL,
      headers: {
        "User-Agent": userAgent
      }
    };
    if (encoding !== undefined) {
      requestOptions.encoding = encoding;
    }
    if (element._accept) {
      requestOptions.headers.Accept = element._accept;
    }
    req = exports.download(urlObj, requestOptions, cookieJar, referrer, callback);
  } else {
    const filePath = urlObj.pathname
      .replace(/^file:\/\//, "")
      .replace(/^\/([a-z]):\//i, "$1:/")
      .replace(/%20/g, " ");
    req = exports.readFile(filePath, callback, encoding);
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
    abort() {
      req.abort();
      callback(new Error("request canceled by user"));
    }
  };
};

exports.load = function (element, url, callback, encoding) {
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
  const requestManager = document._requestManager;
  const pool = document._pool;
  const agentOptions = document._agentOptions;
  const strictSSL = document._strictSSL;
  const userAgent = document._defaultView.navigator.userAgent;
  let req = null;
  function wrappedEnqueued() {
    if (req && requestManager) {
      requestManager.remove(req);
    }
    // do not trigger if the window is closed
    if (element._ownerDocument && element._ownerDocument.defaultView.document) {
      enqueued.apply(this, arguments);
    }
  }
  if (typeof customLoader === "function") {
    req = customLoader({
      element,
      url: urlObj,
      cookie: cookieJar.getCookieStringSync(urlObj, { http: true }),
      baseUrl,
      defaultFetch(fetchCallback) {
        return fetch(element, urlObj, cookieJar, baseUrl, pool, agentOptions,
            strictSSL, userAgent, fetchCallback, encoding);
      }
    },
    wrappedEnqueued);
  } else {
    req = fetch(element, urlObj, cookieJar, baseUrl, pool, agentOptions,
        strictSSL, userAgent, wrappedEnqueued, encoding);
  }
  if (req && requestManager) {
    requestManager.add(req);
  }
};
