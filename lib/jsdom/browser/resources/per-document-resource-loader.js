"use strict";
const idlUtils = require("../../living/generated/utils");

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

  fetch(url, { element, onLoad, onError }) {
    const request = this._resourceLoader.fetch(url, {
      cookieJar: this._document._cookieJar,
      element: idlUtils.wrapperForImpl(element),
      referrer: this._document.URL
    });

    if (request === null) {
      return null;
    }

    this._requestManager.add(request);

    const ev = this._document.createEvent("HTMLEvents");

    const onErrorWrapped = error => {
      this._requestManager.remove(request);

      if (onError) {
        onError(error);
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

    const onLoadWrapped = data => {
      this._requestManager.remove(request);

      this._addCookies(url, request.response ? request.response.headers : {});

      try {
        const result = onLoad ? onLoad(data) : undefined;

        return Promise.resolve(result)
          .then(() => {
            // TODO: Create events in the modern way https://github.com/jsdom/jsdom/pull/2279#discussion_r199969734
            ev.initEvent("load", false, false);
            element.dispatchEvent(ev);

            return Promise.resolve();
          })
          .catch(err => {
            return onErrorWrapped(err);
          });
      } catch (err) {
        return onErrorWrapped(err);
      }
    };

    if (element.localName === "script" && element.hasAttribute("async")) {
      this._asyncQueue.push(request, onLoadWrapped, onErrorWrapped, this._queue.getLastScript());
    } else if (element.localName === "script" && element.hasAttribute("defer")) {
      this._deferQueue.push(request, onLoadWrapped, onErrorWrapped, false, element);
    } else {
      this._queue.push(request, onLoadWrapped, onErrorWrapped, false, element);
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
