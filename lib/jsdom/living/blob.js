"use strict";

const blobSymbols = require("./blob-symbols");

class Blob {
  constructor() {
    if (!(this instanceof Blob)) {
      throw new TypeError("DOM object constructor cannot be called as a function.");
    }
    const parts = arguments[0];
    const properties = arguments[1];
    if (arguments.length > 0) {
      if (!parts || typeof parts !== "object" || parts instanceof Date || parts instanceof RegExp) {
        throw new TypeError("blobParts should be nor a non-objects nor Dates nor RegExps nor null");
      }
    }

    const buffers = [];

    if (parts) {
      const l = +parts.length;
      for (let i = 0; i < l; i++) {
        const part = parts[i];
        let buffer;
        if (part instanceof ArrayBuffer) {
          buffer = new Buffer(new Uint8Array(part));
        } else if (part instanceof Buffer) {
          buffer = part;
        } else if (part instanceof Blob) {
          buffer = part[blobSymbols.buffer];
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

    this[blobSymbols.buffer] = Buffer.concat(buffers);

    this[blobSymbols.type] = properties && properties.type ? String(properties.type).toLowerCase() : "";
    if (!this[blobSymbols.type].match(/^ *[a-z0-9-]+(?:\/[a-z0-9-]+)? *(; *charset *= *[a-z0-9-]+ *)?$/)) {
      this[blobSymbols.type] = "";
    }
    this[blobSymbols.lastModified] = properties && properties.lastModified ? properties.lastModified : null;
    this[blobSymbols.closed] = false;
  }
  get size() {
    return this[blobSymbols.buffer].length;
  }
  get type() {
    return this[blobSymbols.type];
  }
  get lastModified() {
    return this[blobSymbols.lastModified];
  }
  slice() {
    return new Blob(
      [
        this[blobSymbols.buffer].slice.apply(this[blobSymbols.buffer],
        Array.from(arguments).slice(0, 2))
      ],
      { type: arguments[2] || this[blobSymbols.type] });
  }
  close() {
    this[blobSymbols.closed] = true;
  }
  toString() {
    return "[object Blob]";
  }
}

module.exports = function (core) {
  core.Blob = Blob;
};
