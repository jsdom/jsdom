"use strict";
const idlUtils = require("../../living/generated/utils");
const { fireAnEvent } = require("../../living/helpers/events");

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
    if (!this._resourceLoader) {
      return null;
    }

    // Create an AbortController for this request
    const abortController = new AbortController();

    const fetchPromise = this._resourceLoader.fetch(url, {
      cookieJar: this._document._cookieJar,
      referrer: this._document.URL,
      signal: abortController.signal,
      element: idlUtils.wrapperForImpl(element)
    });

    // Add the abort controller to the request manager (it has an abort() method)
    this._requestManager.add(abortController);

    const onErrorWrapped = cause => {
      this._requestManager.remove(abortController);

      // If the request was aborted, don't fire error events
      if (cause && cause.name === "AbortError") {
        return Promise.resolve();
      }

      if (onError) {
        onError(cause);
      }

      fireAnEvent("error", element);

      const jsomError = new Error(`Could not load ${element.localName}: "${url}"`, { cause });
      jsomError.type = "resource-loading";
      jsomError.url = url;

      this._document._defaultView._virtualConsole.emit("jsdomError", jsomError);

      return Promise.resolve();
    };

    const onLoadWrapped = dataAndResponse => {
      this._requestManager.remove(abortController);

      const { data, response } = dataAndResponse;

      // Cookies are already handled by ResourceLoader._fetchHTTP

      try {
        const result = onLoad ? onLoad(data, response) : undefined;

        return Promise.resolve(result)
          .then(() => {
            fireAnEvent("load", element);

            return Promise.resolve();
          })
          .catch(err => {
            return onErrorWrapped(err);
          });
      } catch (err) {
        return onErrorWrapped(err);
      }
    };

    // Convert the Promise<Response> to a promise that extracts the body
    const bodyPromise = fetchPromise
      .then(async response => {
        // Get the body as Uint8Array
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);

        return { data, response };
      });

    // Create a wrapper object that can be used by the queue system
    // The queue stores a single value and passes it to onLoad, so we use { data, response }
    const request = {
      then: (onFulfilled, onRejected) => bodyPromise.then(onFulfilled, onRejected),
      catch: onRejected => bodyPromise.catch(onRejected)
    };

    if (element.localName === "script" && element.hasAttributeNS(null, "async")) {
      this._asyncQueue.push(request, onLoadWrapped, onErrorWrapped, this._queue.getLastScript());
    } else if (
      element.localName === "script" &&
        element.hasAttributeNS(null, "defer") &&
        this._document.readyState !== "interactive") {
      this._deferQueue.push(request, onLoadWrapped, onErrorWrapped, false, element);
    } else {
      this._queue.push(request, onLoadWrapped, onErrorWrapped, false, element);
    }

    return request;
  }
};
