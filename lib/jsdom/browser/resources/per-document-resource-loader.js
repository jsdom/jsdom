"use strict";
const wrapCookieJarForRequest = require("../../living/helpers/wrap-cookie-jar-for-request");

module.exports = class PerDocumentResourceLoader {
  constructor(document) {
    this._document = document;
    this._defaultEncoding = document._encoding;
    this._resourceLoader = document._defaultView ? document._defaultView._resourceLoader : null;
    this._requestManager = document._requestManager;
    this._queue = document._queue;
    this._deferQueue = document._deferQueue;
    this._asyncQueue = document._asyncQueue;
  }

  fetch(url, options) {
    const { element } = options;

    const requestOptions = {
      jar: wrapCookieJarForRequest(this._document._cookieJar),
      proxy: this._document._proxy,
      strictSSL: typeof this._document._strictSSL === "boolean" ? this._document._strictSSL : true
    };

    options = Object.assign({}, options, { requestOptions, referrer: this._document.URL });

    const request = this._resourceLoader.fetch(
      url,
      options
    );

    if (request === null) {
      return null;
    }

    this._requestManager.add(request);

    const ev = this._document.createEvent("HTMLEvents");

    const onError = error => {
      this._requestManager.remove(request);

      if (options.onError) {
        options.onError(error);
      }

      // TODO: Create events in the modern way https://github.com/jsdom/jsdom/pull/2279#discussion_r199969734
      ev.initEvent("error", false, false);
      element.dispatchEvent(ev);

      const err = new Error(`Could not load ${element.localName}: "${url}"`);
      err.type = "resource loading";
      err.detail = error;

      this._document._defaultView._virtualConsole.emit("jsdomError", err);

      return Promise.resolve();
    };

    const onLoad = data => {
      this._requestManager.remove(request);

      this._addCookies(url, request.response ? request.response.headers : {});

      try {
        const result = options.onLoad ? options.onLoad(data) : undefined;

        return Promise.resolve(result)
          .then(() => {
            // TODO: Create events in the modern way https://github.com/jsdom/jsdom/pull/2279#discussion_r199969734
            ev.initEvent("load", false, false);
            element.dispatchEvent(ev);

            return Promise.resolve();
          })
          .catch(err => {
            return onError(err);
          });
      } catch (err) {
        return onError(err);
      }
    };

    if (element.localName === "script" && element.hasAttribute("async")) {
      this._asyncQueue.push(request, onLoad, onError);
    } else if (element.localName === "script" && element.hasAttribute("defer")) {
      this._deferQueue.push(request, onLoad, onError, false, element);
    } else {
      this._queue.push(request, onLoad, onError, false, element);
    }

    return request;
  }

  _addCookies(url, headers) {
    let cookies = headers["set-cookie"];

    if (!cookies) {
      return;
    }

    if (!Array.isArray(cookies)) {
      cookies = [cookies];
    }

    cookies.forEach(cookie => {
      this._document._cookieJar.setCookieSync(cookie, url, { http: true, ignoreError: true });
    });
  }
};
