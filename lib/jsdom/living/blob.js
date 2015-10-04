"use strict";

const blobSymbols = require("./blob-symbols");

class Blob {
  constructor(parts, properties) {
    if (!(this instanceof Blob)) {
      throw new TypeError("DOM object constructor cannot be called as a function.");
    }
    if (arguments.length > 0) {
      if (!parts || typeof parts !== "object" || parts instanceof Date || parts instanceof RegExp) {
        throw new TypeError("blobParts should be nor a non-objects nor Dates nor RegExps nor null");
      }
    }

    const buffers = [];

    if (parts) {
      const l = Number(parts.length);
      for (let i = 0; i < l; i++) {
        const part = parts[i];
        let buffer;
        if (part instanceof ArrayBuffer) {
          buffer = new Buffer(new Uint8Array(part));
        } else if (part instanceof Blob) {
          buffer = part[blobSymbols.buffer];
        } else if (ArrayBuffer.isView(part)) {
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
    const buffer = this[blobSymbols.buffer];
    const slicedBuffer = buffer.slice.apply(
      buffer,
      Array.from(arguments).slice(0, 2)
    );
    const blob = new Blob([], { type: arguments[2] || this.type });
    blob[blobSymbols.buffer] = slicedBuffer;
    return blob;
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
