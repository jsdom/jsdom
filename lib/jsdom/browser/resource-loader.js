"use strict";

var core = require("../level1/core");
var resolveHref = require("../utils").resolveHref;
var URL = require("url");
var fs = require("fs");
var request = require("request");

var IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";

function getDocumentBaseUrl(document) {
  var baseElements = document.getElementsByTagName("base");
  var baseUrl = document.URL;

  if (baseElements.length > 0) {
    var baseHref = baseElements.item(0).href;

    if (baseHref) {
      baseUrl = resolveHref(baseUrl, baseHref);
    }
  }

  return baseUrl;
}

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
    }

    element.dispatchEvent(ev);
  };
}

function readFile(url, callback) {
  var filePath = url
    .replace(/^file:\/\//, "")
    .replace(/^\/([a-z]):\//i, "$1:/")
    .replace(/%20/g, " ");

  fs.readFile(filePath, "utf8", callback);
}

function download(urlObj, cookieJar, referrer, callback) {
  var options = {
    url: urlObj,
    gzip: true,
    headers: {
      referer: referrer && !IS_BROWSER ? referrer : void 0,
      cookie: cookieJar.getCookieStringSync(urlObj, {http: true})
    }
  };

  request(options, function (error, response, body) {

    if (!error) {
      var cookies = response.headers["set-cookie"];

      if (cookies) {
        cookies = Array.isArray(cookies) ? cookies : [cookies];

        cookies.forEach(function (cookieStr) {
          cookieJar.setCookieSync(cookieStr, urlObj, {
            http: true,
            ignoreError: true
          });
        });
      }
    }

    callback(error, body);
  });
}

function fetch(urlObj, cookieJar, referrer, callback) {
  if (urlObj.hostname) {
    download(urlObj, cookieJar, referrer, callback);
  } else {
    readFile(urlObj.pathname, callback);
  }
}

exports.enqueue = function (element, resourceUrl, callback) {
  var document = element.nodeType === core.Node.DOCUMENT_NODE ? element : element._ownerDocument;

  if (document._queue) {
    var loadHandler = createResourceLoadHandler(element, resourceUrl || document.URL, document, callback);
    return document._queue.push(loadHandler);
  } else {
    return function () { };
  }
};

exports.resolveResourceUrl = function (document, url) {
  // if getAttribute returns null, there is no href
  // lets resolve to an empty string (nulls are not expected farther up)
  if (url === null) {
    return "";
  }

  var baseUrl = getDocumentBaseUrl(document);
  return resolveHref(baseUrl, url);
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
  var baseUrl = getDocumentBaseUrl(document);
  var cookieJar = document._cookieJar;
  var enqueued = exports.enqueue(element, resourceUrl, callback);
  var customLoader = document._customResourceLoader;

  if (typeof customLoader === "function") {
    customLoader.call(null, {
      url: urlObj,
      cookie: cookieJar.getCookieStringSync(urlObj, {http: true}),
      baseUrl: baseUrl,
      defaultFetch: function (callback) {
        fetch(urlObj, cookieJar, baseUrl, callback);
      }
    }, enqueued);
  } else {
    fetch(urlObj, cookieJar, baseUrl, enqueued);
  }
};
