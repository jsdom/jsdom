"use strict";

function Blob() {
  if (!(this instanceof Blob)) {
    throw new TypeError("DOM object constructor cannot be called as a function.");
  }
  var parts = arguments[0];
  var properties = arguments[1];
  if (arguments.length > 0) {
    if (!parts || typeof parts !== "object" || parts instanceof Date || parts instanceof RegExp) {
      throw new TypeError("blobParts should be nor a non-objects nor Dates nor RegExps nor null");
    }
  }

  const buffers = [];

  if (parts) {
    var l = +parts.length;
    for (var i = 0; i < l; i++) {
      var part = parts[i];
      var buffer;
      if (part instanceof ArrayBuffer) {
        buffer = new Buffer(new Uint8Array(part));
      } else if (part instanceof Buffer) {
        buffer = part;
      } else if (part instanceof Blob) {
        buffer = part._buffer;
      } else if (part instanceof Int8Array ||
        part instanceof Uint8Array ||
        part instanceof Uint8ClampedArray ||
        part instanceof Int16Array ||
        part instanceof Uint16Array ||
        part instanceof Int32Array ||
        part instanceof Uint32Array ||
        part instanceof Float32Array ||
        part instanceof Float64Array) {
        buffer = new Buffer(new Uint8Array(part.buffer, part.byteOffset, part.byteLength));
      } else {
        buffer = new Buffer(typeof part === "string" ? part : String(part));
      }
      buffers.push(buffer);
    }
  }

  this._buffer = Buffer.concat(buffers);

  this._type = properties && properties.type ? String(properties.type).toLowerCase() : "";
  if (!this._type.match(/^ *[a-z0-9-]+(?:\/[a-z0-9-]+)? *(; *charset *= *[a-z0-9-]+ *)?$/)) {
    this._type = "";
  }
  this._lastModified = properties && properties.lastModified ? properties.lastModified : null;
  this._closed = false;
}

Blob.prototype = {
  get size() {
    return this._buffer.length;
  },
  get type() {
    return this._type;
  },
  get lastModified() {
    return this._lastModified;
  },
  slice: function () {
    return new Blob([this._buffer.slice.apply(this._buffer, Array.from(arguments).slice(0, 2))], {
      type: arguments[2] || this._type
    });
  },
  close: function () {
    this._closed = true;
  },
  toString: function () {
    return "[object Blob]";
  }
};

module.exports = Blob;
