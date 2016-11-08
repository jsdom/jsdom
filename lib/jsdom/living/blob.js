"use strict";

const conversions = require("webidl-conversions");
const blobSymbols = require("./blob-symbols");

function getType(type) {
  if (type === null || type === undefined) {
    return "";
  }

  type = conversions.DOMString(type); // eslint-disable-line new-cap
  if (/[^\u0020-\u007E]/.test(type)) {
    type = "";
  }
  return type.toLowerCase();
}

module.exports = class Blob {
  constructor(blobParts = undefined, options = undefined) {
    this[blobSymbols.closed] = false;
    this[blobSymbols.type] = "";

    if (arguments.length === 0) {
      this[blobSymbols.buffer] = new Buffer(0);
      return;
    }

    if (!Array.isArray(blobParts) && blobParts[Symbol.iterator]) {
      blobParts = Array.from(blobParts);
    }
    if (!Array.isArray(blobParts)) {
      throw new TypeError("Blob parts must be an iterable object");
    }

    const buffers = [];

    if (blobParts) {
      const length = blobParts.length;
      for (let i = 0; i < length; i++) {
        const element = blobParts[i];
        let buffer;
        if (element instanceof Buffer) {
          buffer = element;
        } else if (ArrayBuffer.isView(element)) {
          buffer = new Buffer(new Uint8Array(element.buffer, element.byteOffset, element.byteLength));
        } else if (element instanceof ArrayBuffer) {
          buffer = new Buffer(new Uint8Array(element));
        } else if (element instanceof Blob) {
          buffer = element[blobSymbols.buffer];
        } else {
          const str = typeof element === "string" ? element : String(element);
          buffer = new Buffer(conversions.USVString(str));
        }
        buffers.push(buffer);
      }
    }

    this[blobSymbols.buffer] = Buffer.concat(buffers);

    if (options !== undefined && options !== null && typeof options !== "object") {
      throw new TypeError("Blob options must be undefined, null, or an object");
    }
    if (options) {
      this[blobSymbols.type] = getType(options.type);
    }
  }
  get size() {
    return this[blobSymbols.closed] ? 0 : this[blobSymbols.buffer].length;
  }
  get type() {
    return this[blobSymbols.type];
  }
  get isClosed() {
    return this[blobSymbols.closed];
  }
  slice(start = undefined, end = undefined, contentType = undefined) {
    if (start !== undefined) {
      start = conversions["long long"](start, { clamp: true });
    }
    if (end !== undefined) {
      end = conversions["long long"](end, { clamp: true });
    }

    const size = this.size;

    let relativeStart;
    let relativeEnd;
    if (start === undefined) {
      relativeStart = 0;
    } else if (start < 0) {
      relativeStart = Math.max(size + start, 0);
    } else {
      relativeStart = Math.min(start, size);
    }
    if (end === undefined) {
      relativeEnd = size;
    } else if (end < 0) {
      relativeEnd = Math.max(size + end, 0);
    } else {
      relativeEnd = Math.min(end, size);
    }

    const span = Math.max(relativeEnd - relativeStart, 0);

    const buffer = this[blobSymbols.buffer];
    const slicedBuffer = buffer.slice(
      relativeStart,
      relativeStart + span
    );
    const blob = new Blob();
    blob[blobSymbols.buffer] = slicedBuffer;
    blob[blobSymbols.closed] = this[blobSymbols.closed];
    blob[blobSymbols.type] = getType(contentType);
    return blob;
  }
  close() {
    this[blobSymbols.closed] = true;
  }
  toString() {
    return "[object Blob]";
  }
};
