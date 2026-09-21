"use strict";
const idlUtils = require("../../../generated/idl/utils");
const { fireAnEvent } = require("../../living/helpers/events");
const { fetchCollected } = require("./jsdom-dispatcher");

module.exports = class PerDocumentResourceLoader {
  constructor(document) {
    this._document = document;
    const defaultView = document._defaultView;
    this._settings = defaultView ? defaultView._settings : null;
    this._requestManager = document._requestManager;
    this._queue = document._queue;
    this._deferQueue = document._deferQueue;
    this._asyncQueue = document._asyncQueue;
  }

  fetch(url, { element, onLoad, onError }) {
    if (!this._settings?.loadSubresources || this._document._isDestroyed) {
      return null;
    }

    const abortController = new AbortController();
    // Suppress frame completion when its child document is destroyed, even if the containing document survives.
    const resourceDocument = element._contentDocument ?? this._document;

    // Add it to the request manager. The request manager is very old code, but it works with the contract of "has an
    // `abort()` method". One day this whole subsystem will be refactored to use `AbortController`s natively, but for
    // now this just happens to work.
    //
    // Note that we add the controller now, before calling `fetchCollected()`, so that if any interceptors or other code
    // calls `window.close()`, the abort controller is already registered and will see the abort.
    this._requestManager.add(abortController);

    const fetchPromise = fetchCollected(this._settings.dispatcher, {
      url,
      headers: { Referer: this._document.URL },
      signal: abortController.signal,
      element: idlUtils.wrapperForImpl(element)
    });

    const onErrorWrapped = cause => {
      this._requestManager.remove(abortController);

      // If the request was aborted, don't fire error events
      if (resourceDocument._isDestroyed || (cause && cause.name === "AbortError")) {
        return Promise.resolve();
      }

      if (onError) {
        onError(cause);
      }

      fireAnEvent("error", element);

      const jsomError = new Error(`Could not load ${element.localName}: "${url}"`, { cause });
      jsomError.type = "resource-loading";
      jsomError.url = url;

      this._settings.virtualConsole.emit("jsdomError", jsomError);

      return Promise.resolve();
    };

    const onLoadWrapped = response => {
      this._requestManager.remove(abortController);
      if (resourceDocument._isDestroyed) {
        return Promise.resolve();
      }

      // Extract data and create a response-like object for compatibility
      const { body: data, status, headers, url: responseURL } = response;
      const responseObj = {
        ok: status >= 200 && status < 300,
        status,
        headers: {
          get(name) {
            return headers[name.toLowerCase()] ?? null;
          }
        },
        url: responseURL
      };

      try {
        const result = onLoad ? onLoad(data, responseObj) : undefined;

        return Promise.resolve(result)
          .then(() => {
            // A script's `load` completes its already-running execution algorithm, without another activity check
            // after evaluation or its cleanup microtasks. Frame completion still depends on its document's lifetime.
            // https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element
            if (element.localName === "script" || !resourceDocument._isDestroyed) {
              fireAnEvent("load", element);
            }

            return Promise.resolve();
          })
          .catch(err => {
            return onErrorWrapped(err);
          });
      } catch (err) {
        return onErrorWrapped(err);
      }
    };

    // Create a wrapper object that can be used by the queue system
    const request = {
      then: (onFulfilled, onRejected) => fetchPromise.then(onFulfilled, onRejected),
      catch: onRejected => fetchPromise.catch(onRejected)
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
