"use strict";
const conversions = require("webidl-conversions");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { Canvas, reflectURLAttribute } = require("../../utils");

class HTMLImageElementImpl extends HTMLElementImpl {
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

  get src() {
    return reflectURLAttribute(this, "src");
  }

  set src(value) {
    this.setAttributeNS(null, "src", value);
  }

  get srcset() {
    return conversions.USVString(this.getAttributeNS(null, "srcset"));
  }

  set srcset(value) {
    this.setAttributeNS(null, "srcset", value);
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
    return Boolean(this._image && this._image.complete);
  }

  get currentSrc() {
    return this._currentSrc || "";
  }

  get lowsrc() {
    return reflectURLAttribute(this, "lowsrc");
  }

  set lowsrc(value) {
    this.setAttributeNS(null, "lowsrc", value);
  }

  get longDesc() {
    return reflectURLAttribute(this, "longdesc");
  }

  set longDesc(value) {
    this.setAttributeNS(null, "longdesc", value);
  }

  _updateTheImageData() {
    const document = this._ownerDocument;

    if (!document._defaultView) {
      return;
    }

    if (!Canvas) {
      return;
    }

    let error;
    if (!this._image) {
      this._image = new Canvas.Image();
      // Install an error handler that just remembers the error. It is then
      // thrown in the callback of resourceLoader.fetch() below.
      this._image.onerror = function (err) {
        error = err;
      };
    }
    this._currentSrc = null;
    const srcAttributeValue = this.getAttributeNS(null, "src");
    if (srcAttributeValue !== null && srcAttributeValue !== "") {
      const resourceLoader = document._resourceLoader;
      let request;

      const onLoadImage = data => {
        const { response } = request;

        if (response && response.statusCode !== undefined && response.statusCode !== 200) {
          throw new Error("Status code: " + response.statusCode);
        }
        error = null;
        this._image.src = data;
        if (error) {
          throw new Error(error);
        }
        this._currentSrc = srcAttributeValue;
      };

      request = resourceLoader.fetch(this.src, {
        element: this,
        onLoad: onLoadImage
      });
    } else {
      this._image.src = "";
    }
  }
}

module.exports = {
  implementation: HTMLImageElementImpl
};
