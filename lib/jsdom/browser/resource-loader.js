"use strict";

const resolveHref = require("../utils").resolveHref;
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

function readFile(url, callback) {
  const filePath = url
    .replace(/^file:\/\//, "")
    .replace(/^\/([a-z]):\//i, "$1:/")
    .replace(/%20/g, " ");

  fs.readFile(filePath, "utf8", callback);
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

function fetch(urlObj, cookieJar, referrer, callback) {
  if (urlObj.hostname) {
    exports.download(urlObj, null, cookieJar, referrer, callback);
  } else {
    readFile(urlObj.pathname, callback);
  }
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

exports.download = function (url, options, cookieJar, referrer, callback) {
  options = options || {};
  options.gzip = true;
  options.jar = wrapCookieJarForRequest(cookieJar);
  options.headers = options.headers || {};
  options.headers.referer = referrer && !IS_BROWSER ? referrer : undefined;

  request(url, options, (error, response, data) => callback(error, data, response));
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

  if (typeof customLoader === "function") {
    customLoader({
      element,
      url: urlObj,
      cookie: cookieJar.getCookieStringSync(urlObj, { http: true }),
      baseUrl,
      defaultFetch(fetchCallback) {
        fetch(urlObj, cookieJar, baseUrl, fetchCallback);
      }
    }, enqueued);
  } else {
    fetch(urlObj, cookieJar, baseUrl, enqueued);
  }
};
