"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { notImplementedMethod } = require("../../browser/not-implemented");
const idlUtils = require("../../../generated/idl/utils");
const { Canvas } = require("../../utils");
const HTMLImageElementImpl = require("./HTMLImageElement-impl").implementation;

class HTMLCanvasElementImpl extends HTMLElementImpl {
  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && this._canvas && (localName === "width" || localName === "height")) {
      this._canvas[localName] = idlUtils.wrapperForImpl(this)[localName];
    }
  }

  _getCanvas() {
    if (Canvas && !this._canvas) {
      const wrapper = idlUtils.wrapperForImpl(this);
      this._canvas = Canvas.createCanvas(wrapper.width, wrapper.height);
    }
    return this._canvas;
  }

  getContext(contextId) {
    const canvas = this._getCanvas();
    if (canvas) {
      if (contextId !== "2d") {
        return null;
      }
      if (!this._context) {
        this._context = canvas.getContext(contextId) || null;
        if (this._context) {
          // Override the native canvas reference with our wrapper. This is the
          // reason why we need to locally cache _context, since each call to
          // canvas.getContext(contextId) would replace this reference again.
          // Perhaps in the longer term, a better solution would be to create a
          // full wrapper for the Context object as well.
          this._context.canvas = idlUtils.wrapperForImpl(this);
          wrapCanvasMethod(this._context, "createPattern", this._ownerDocument._defaultView);
          wrapCanvasMethod(this._context, "drawImage", this._ownerDocument._defaultView);
        }
      }
      return this._context;
    }

    notImplementedMethod(
      this._ownerDocument._defaultView,
      "HTMLCanvasElement",
      "getContext",
      "without installing the @napi-rs/canvas npm package"
    );
    return null;
  }

  toDataURL(type, quality) {
    const canvas = this._getCanvas();
    if (canvas) {
      const wrapper = idlUtils.wrapperForImpl(this);
      if (wrapper.width === 0 || wrapper.height === 0) {
        return "data:,";
      }
      return canvas.toDataURL(normalizeType(type), normalizeQuality(quality));
    }

    notImplementedMethod(
      this._ownerDocument._defaultView,
      "HTMLCanvasElement",
      "toDataURL",
      "without installing the @napi-rs/canvas npm package"
    );
    return null;
  }

  toBlob(callback, type, qualityArgument) {
    const window = this._ownerDocument._defaultView;
    const canvas = this._getCanvas();
    if (canvas) {
      const wrapper = idlUtils.wrapperForImpl(this);
      if (wrapper.width === 0 || wrapper.height === 0) {
        window.setTimeout(() => callback(null), 0);
        return;
      }

      type = normalizeType(type);
      const quality = normalizeQuality(qualityArgument);
      let result;
      try {
        // encode() snapshots the bitmap now, before asynchronous serialization.
        const nativeQuality = quality === undefined ? undefined : Math.round(quality * 100);
        result = canvas.encode(type.slice("image/".length), nativeQuality);
      } catch {
        window.setTimeout(() => callback(null), 0);
        return;
      }
      result.then(
        buffer => new window.Blob([buffer], { type }),
        () => null
      ).then(blob => window.setTimeout(() => callback(blob), 0));
    } else {
      notImplementedMethod(
        this._ownerDocument._defaultView,
        "HTMLCanvasElement",
        "toBlob",
        "without installing the @napi-rs/canvas npm package"
      );
    }
  }
}

// We need to wrap the methods that receive an image or canvas object
// (luckily, always as the first argument), so that these objects can be
// unwrapped an the expected types passed.
function wrapCanvasMethod(ctx, name, window) {
  const prev = ctx[name];
  ctx[name] = function (image, ...rest) {
    const impl = idlUtils.implForWrapper(image);
    if (impl) {
      if (impl instanceof HTMLCanvasElementImpl && !impl._canvas) {
        impl._getCanvas();
      }
      if (impl instanceof HTMLImageElementImpl) {
        if (impl._currentRequestState === "broken") {
          throw new window.DOMException("The image is broken.", "InvalidStateError");
        }
        if (impl._currentRequestState !== "completely available") {
          return name === "createPattern" ? null : undefined;
        }
      }
      image = impl._image || impl._canvas;
    }
    return prev.call(ctx, image, ...rest);
  };
}

function normalizeType(type) {
  type = type === undefined ? "image/png" : type.toLowerCase();
  return ["image/png", "image/jpeg", "image/webp"].includes(type) ? type : "image/png";
}

function normalizeQuality(quality) {
  return typeof quality === "number" && quality >= 0 && quality <= 1 ? quality : undefined;
}

module.exports = {
  implementation: HTMLCanvasElementImpl
};
