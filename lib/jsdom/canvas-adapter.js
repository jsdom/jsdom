"use strict";

/**
 * Canvas Adapter - Provides unified interface for both @napi-rs/canvas and canvas (node-canvas)
 *
 * This adapter allows jsdom to support both canvas libraries with a preference for @napi-rs/canvas.
 * It normalizes API differences and provides compatibility wrappers where needed.
 */

let canvasLib = null;
let libraryName = null;
let _createCanvas = null;
let _Image = null;

// Try to load @napi-rs/canvas first (preferred for better installation experience)
try {
  canvasLib = require("@napi-rs/canvas");
  libraryName = "@napi-rs/canvas";
  _createCanvas = canvasLib.createCanvas.bind(canvasLib);
  _Image = canvasLib.Image;
} catch {
  // Fall back to canvas (node-canvas) if @napi-rs/canvas is not available
  try {
    canvasLib = require("canvas");
    libraryName = "canvas";
    _createCanvas = canvasLib.createCanvas.bind(canvasLib);
    _Image = canvasLib.Image;
  } catch {
    // Neither library is available - jsdom will gracefully degrade
    libraryName = null;
  }
}

/**
 * Create a canvas element with the specified dimensions
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Canvas} Canvas instance
 */
function createCanvas(width, height) {
  if (!_createCanvas) {
    return null;
  }
  return _createCanvas(width, height);
}

/**
 * Wraps a canvas instance to provide compatibility between libraries
 * Specifically handles toBuffer callback API differences
 *
 * @param {Canvas} canvas - Canvas instance to wrap
 * @returns {Canvas} Wrapped canvas instance
 */
function wrapCanvas(canvas) {
  if (!canvas) {
    return canvas;
  }

  // For @napi-rs/canvas, we need to wrap toBuffer to provide callback-based API
  if (libraryName === "@napi-rs/canvas") {
    const originalToBuffer = canvas.toBuffer;

    // Store reference to original for potential direct access
    canvas._originalToBuffer = originalToBuffer;

    // Override toBuffer to support both callback and direct call patterns
    canvas.toBuffer = function (callbackOrMime, mimeOrQuality, optionsOrUndefined) {
      // Detect if first argument is a callback function
      if (typeof callbackOrMime === "function") {
        // Callback-based API: toBuffer(callback, mimeType, options)
        const callback = callbackOrMime;
        const mimeType = mimeOrQuality || "image/png";
        const { quality } = optionsOrUndefined || {};

        // @napi-rs/canvas toBuffer is synchronous, but we wrap it in setTimeout
        // to maintain async behavior expected by jsdom's toBlob implementation
        setTimeout(() => {
          try {
            // @napi-rs/canvas signature: toBuffer(mime, quality?)
            // quality is passed as second parameter, not in options object
            let buffer;

            if (quality !== undefined) {
              buffer = originalToBuffer.call(canvas, mimeType, quality);
            } else {
              buffer = originalToBuffer.call(canvas, mimeType);
            }

            callback(null, buffer);
          } catch (err) {
            callback(err);
          }
        }, 0);

        // Callback-based API doesn't return a value
        return undefined;
      }

      // Direct call API: toBuffer(mimeType, quality?)
      // Pass through to original @napi-rs/canvas method
      return originalToBuffer.call(canvas, callbackOrMime, mimeOrQuality);
    };
  }
  // For node-canvas, toBuffer already supports callback API - no wrapping needed

  return canvas;
}

// Export unified interface
// When no canvas library is available, export null to match the old behavior
// This ensures checks like `if (!Canvas)` and `if (Canvas && ...)` work correctly
if (libraryName === null) {
  module.exports = null;
} else {
  module.exports = {
    // Factory function for creating canvas
    createCanvas,

    // Image constructor
    Image: _Image,

    // Canvas wrapper for compatibility
    wrapCanvas,

    // Name of the loaded library
    libraryName
  };
}
