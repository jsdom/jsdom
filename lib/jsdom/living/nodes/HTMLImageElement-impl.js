"use strict";
const conversions = require("webidl-conversions");
const { serializeURL } = require("whatwg-url");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { Canvas } = require("../../utils");

class HTMLImageElementImpl extends HTMLElementImpl {
  constructor(...args) {
    super(...args);
    this._currentRequestState = "unavailable";
    this._loadPromise = null;
    this._loadPromiseResolve = null;
  }

  _attrModified(name, value, oldVal) {
    // TODO: handle crossorigin
    if (name === "src" || ((name === "srcset" || name === "width" || name === "sizes") && value !== oldVal)) {
      this._updateTheImageData();
    }

    super._attrModified(name, value, oldVal);
  }

  get _accept() {
    return "image/png,image/*;q=0.8,*/*;q=0.5";
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

  // https://html.spec.whatwg.org/multipage/images.html#dom-img-decode
  decode() {
    const performDecode = () => {
      // Per spec, decode() must reject if the image is in a broken state
      if (this._currentRequestState === "broken") {
        return Promise.reject(new DOMException("The image could not be decoded", "EncodingError"));
      }
      if (this._image && typeof this._image.decode === "function") {
        return this._image.decode();
      }
      // If no canvas library or decode not supported, resolve immediately
      return Promise.resolve();
    };

    // If we're still loading, wait for that first
    if (this._loadPromise) {
      return this._loadPromise.then(() => performDecode());
    }

    return performDecode();
  }

  // https://html.spec.whatwg.org/multipage/images.html#updating-the-image-data
  _updateTheImageData() {
    const document = this._ownerDocument;

    if (!document._defaultView) {
      return;
    }

    if (!Canvas) {
      return;
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
      const resourceLoader = document._resourceLoader;

      // If there's an existing load in progress, resolve its promise to avoid hanging decode()
      if (this._loadPromiseResolve) {
        this._loadPromiseResolve();
      }

      // Create a promise that decode() can wait on
      this._loadPromise = new Promise(resolve => {
        this._loadPromiseResolve = resolve;
      });

      // Capture the current load's resolver so callbacks don't interfere with newer loads
      const currentLoadPromise = this._loadPromise;
      const currentLoadPromiseResolve = this._loadPromiseResolve;

      const finishLoading = () => {
        this._currentSrc = srcAttributeValue;
        this._currentRequestState = "completely available";
        currentLoadPromiseResolve();
        if (this._loadPromise === currentLoadPromise) {
          this._loadPromise = null;
          this._loadPromiseResolve = null;
        }
      };

      const handleError = () => {
        this._currentRequestState = "broken";
        currentLoadPromiseResolve();
        if (this._loadPromise === currentLoadPromise) {
          this._loadPromise = null;
          this._loadPromiseResolve = null;
        }
      };

      const onLoadImage = data => {
        let error = null;
        this._image.onerror = err => {
          error = err;
        };

        // eslint-disable-next-line no-restricted-globals -- The canvas package expects a Node.js `Buffer`.
        this._image.src = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
        if (error) {
          throw new Error(error);
        }

        // For @napi-rs/canvas, we need to wait for decode() before the image can be drawn
        // Return a Promise so resource loader waits for decode before firing load event
        if (typeof this._image.decode === "function") {
          return this._image.decode().then(() => {
            // Check if the image is actually valid after decoding
            // An image with 0x0 dimensions is considered broken
            if (this._image.naturalWidth === 0 || this._image.naturalHeight === 0) {
              handleError();
              throw new Error("The image could not be decoded");
            }
            finishLoading();
          });
        }

        // For libraries without decode (like node-canvas), finish immediately
        finishLoading();
        return undefined;
      };

      resourceLoader.fetch(urlString, {
        element: this,
        onLoad: onLoadImage,
        onError: handleError,
        allowNon2xx: true
      });
    } else {
      this._image.src = "";
    }
  }
}

module.exports = {
  implementation: HTMLImageElementImpl
};
