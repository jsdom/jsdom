"use strict";

const resolveHref = require("../utils").resolveHref;
const parseDataUrl = require("../utils").parseDataUrl;
const parseContentType = require("../living/helpers/headers").parseContentType;
const decodeString = require("../living/helpers/encoding").decodeString;
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
  if (loadCallback === undefined) {
    loadCallback = () => {
      // do nothing
    };
  }
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

exports.readFile = function (filePath, options, callback) {
  const readableStream = fs.createReadStream(filePath);

  let data = new Buffer(0);

  readableStream.on("error", callback);

  readableStream.on("data", chunk => {
    data = Buffer.concat([data, chunk]);
  });

  const defaultEncoding = options.defaultEncoding;
  const detectMetaCharset = options.detectMetaCharset;

  readableStream.on("end", () => {
    // Not passing default encoding means binary
    if (defaultEncoding) {
      const decoded = decodeString(data, {
        defaultEncoding,
        detectMetaCharset
      });
      callback(null, decoded.data, { headers: { "content-type": "text/plain;charset=" + decoded.encoding } });
    } else {
      callback(null, data);
    }
  });

  return {
    abort() {
      readableStream.destroy();
      callback(new Error("request canceled by user"));
    }
  };
};

function readDataUrl(dataUrl, options, callback) {
  try {
    const data = parseDataUrl(dataUrl);
    // If default encoding does not exist, pass on binary data.
    if (options.defaultEncoding) {
      const contentType = parseContentType(data.type) || parseContentType("text/plain");
      const decoded = decodeString(data.buffer, {
        contentType,
        defaultEncoding: options.defaultEncoding,
        detectMetaCharset: options.detectMetaCharset
      });
      contentType.set("charset", decoded.encoding);
      data.type = contentType.toString();
      callback(null, decoded.data, { headers: { "content-type": data.type } });
    } else {
      callback(null, data.buffer, { headers: { "content-type": data.type } });
    }
  } catch (err) {
    callback(err, null);
  }
  return null;
}

// NOTE: request wraps tough-cookie cookie jar
// (see: https://github.com/request/request/blob/master/lib/cookies.js).
// Therefore, to pass our cookie jar to the request, we need to create
// request's wrapper and monkey patch it with our jar.
function wrapCookieJarForRequest(cookieJar) {
  const jarWrapper = request.jar();
  jarWrapper._jar = cookieJar;
  return jarWrapper;
}

function fetch(urlObj, options, callback) {
  if (urlObj.protocol === "data:") {
    return readDataUrl(urlObj.href, options, callback);
  } else if (urlObj.hostname) {
    return exports.download(urlObj, options, callback);
  }
  const filePath = urlObj.pathname
    .replace(/^file:\/\//, "")
    .replace(/^\/([a-z]):\//i, "$1:/")
    .replace(/%20/g, " ");
  return exports.readFile(filePath, options, callback);
}

exports.enqueue = function (element, resourceUrl, callback) {
  const document = element.nodeType === NODE_TYPE.DOCUMENT_NODE ? element : element._ownerDocument;

  if (document._queue) {
    const loadHandler = createResourceLoadHandler(element, resourceUrl || document.URL, document, callback);
    return document._queue.push(loadHandler);
  }

  return () => {
    // do nothing in queue-less documents
  };
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


exports.download = function (url, options, callback) {
  const requestOptions = {
    pool: options.pool,
    agentOptions: options.agentOptions,
    strictSSL: options.strictSSL,
    gzip: true,
    jar: wrapCookieJarForRequest(options.cookieJar),
    encoding: null,
    headers: {
      "User-Agent": options.userAgent,
      "Accept-Language": "en",
      Accept: options.accept || "*/*"
    }
  };
  if (options.referrer && !IS_BROWSER) {
    requestOptions.headers.referer = options.referrer;
  }
  if (options.proxy) {
    requestOptions.proxy = options.proxy;
  }
  Object.assign(requestOptions.headers, options.headers);

  const defaultEncoding = options.defaultEncoding;
  const detectMetaCharset = options.detectMetaCharset;

  const req = request(url, requestOptions, (error, response, bufferData) => {
    if (!error) {
      // If default encoding does not exist, pass on binary data.
      if (defaultEncoding) {
        const contentType = parseContentType(response.headers["content-type"]) || parseContentType("text/plain");
        const decoded = decodeString(bufferData, {
          contentType,
          defaultEncoding,
          detectMetaCharset
        });
        contentType.set("charset", decoded.encoding);
        response.headers["content-type"] = contentType.toString();

        callback(null, decoded.data, response);
      } else {
        callback(null, bufferData, response);
      }
    } else {
      callback(error, null, response);
    }
  });
  return {
    abort() {
      req.abort();
      callback(new Error("request canceled by user"));
    }
  };
};

exports.load = function (element, url, options, callback) {
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
  const enqueued = exports.enqueue(element, resourceUrl, callback);
  const customLoader = document._customResourceLoader;
  const requestManager = document._requestManager;
  const cookieJar = document._cookieJar;

  options.accept = element._accept;
  options.cookieJar = cookieJar;
  options.referrer = baseUrl;
  options.pool = document._pool;
  options.agentOptions = document._agentOptions;
  options.strictSSL = document._strictSSL;
  options.userAgent = document._defaultView.navigator.userAgent;

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
        return fetch(urlObj, options, fetchCallback);
      }
    },
    wrappedEnqueued);
  } else {
    req = fetch(urlObj, options, wrappedEnqueued);
  }
  if (req && requestManager) {
    requestManager.add(req);
  }
};
