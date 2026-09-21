"use strict";
const conversions = require("webidl-conversions");
const { serializeURL } = require("whatwg-url");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { Canvas } = require("../../utils");
const { fireAnEvent } = require("../helpers/events");
const { fetchCollected } = require("../../browser/resources/jsdom-dispatcher");
const { reportResourceError } = require("../helpers/resource-errors");
const { linkAbortController } = require("../helpers/abort-controller");

class HTMLImageElementImpl extends HTMLElementImpl {
  #requestController = null;
  constructor(...args) {
    super(...args);
    this._currentRequestState = "unavailable";
  }

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    // TODO: handle crossorigin
    if (namespace === null &&
        (localName === "src" ||
         ((localName === "srcset" || localName === "width" || localName === "sizes") && value !== oldValue))) {
      this.#updateTheImageData();
    }
  }

  get height() {
    // Just like on browsers, if no width / height is defined, we fall back on the
    // dimensions of the internal image data.
    return this.hasAttributeNS(null, "height") ?
           conversions["unsigned long"](this.getAttributeNS(null, "height")) :
           this.naturalHeight;
  }

  set height(V) {
    this.setAttributeNS(null, "height", String(V));
  }

  get width() {
    return this.hasAttributeNS(null, "width") ?
           conversions["unsigned long"](this.getAttributeNS(null, "width")) :
           this.naturalWidth;
  }

  set width(V) {
    this.setAttributeNS(null, "width", String(V));
  }

  get naturalHeight() {
    return this._image ? this._image.naturalHeight : 0;
  }

  get naturalWidth() {
    return this._image ? this._image.naturalWidth : 0;
  }

  get complete() {
    const srcAttributeValue = this.getAttributeNS(null, "src");
    return srcAttributeValue === null ||
      srcAttributeValue === "" ||
      this._currentRequestState === "broken" ||
      this._currentRequestState === "completely available";
  }

  get currentSrc() {
    return this._currentSrc || "";
  }

  // https://html.spec.whatwg.org/multipage/images.html#updating-the-image-data
  #updateTheImageData() {
    const document = this._ownerDocument;

    if (!document._defaultView) {
      return;
    }

    if (!Canvas) {
      return;
    }

    if (this.#requestController !== null) {
      this.#requestController.abort();
    }

    if (!this._image) {
      this._image = new Canvas.Image();
    }
    this._currentSrc = null;
    this._currentRequestState = "unavailable";
    const srcAttributeValue = this.getAttributeNS(null, "src");
    let urlString = null;
    if (srcAttributeValue !== null && srcAttributeValue !== "") {
      const urlRecord = this._ownerDocument.encodingParseAURL(srcAttributeValue);
      if (urlRecord === null) {
        return;
      }
      urlString = serializeURL(urlRecord);
    }
    if (urlString !== null) {
      this.#fetchImage(urlString, srcAttributeValue);
    } else {
      this._image.src = "";
    }
  }

  async #fetchImage(url, srcAttributeValue) {
    const document = this._ownerDocument;
    if (!document._defaultView._settings.loadSubresources) {
      return;
    }
    const controller = this.#requestController = new AbortController();
    const unlink = linkAbortController(controller, document._fetchSignal);
    const { signal } = controller;
    const stopDelayingLoadEvent = document._delayLoadEvent();
    try {
      const { body } = await fetchCollected(document._defaultView._settings.dispatcher, {
        url, headers: { Referer: document.URL }, signal, element: this
      });
      await this._globalObject._document._queueATask(() => {
        let error = null;
        this._image.onerror = err => {
          error = err;
        };
        // eslint-disable-next-line no-restricted-globals -- The canvas package expects a Node.js `Buffer`.
        this._image.src = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        if (error) {
          throw new Error(error);
        }
        this._currentSrc = srcAttributeValue;
        this._currentRequestState = "completely available";
        fireAnEvent("load", this);
      }, { signal });
    } catch (error) {
      await this._globalObject._document._queueATask(() => {
        this._currentRequestState = "broken";
        fireAnEvent("error", this);
        reportResourceError(this, url, error);
      }, { signal });
    } finally {
      unlink();
      if (this.#requestController === controller) {
        this.#requestController = null;
      }
      stopDelayingLoadEvent();
    }
  }
}

module.exports = {
  implementation: HTMLImageElementImpl
};
