"use strict";
const { utf8fromString } = require("@exodus/bytes/utf8.js");
const Blob = require("../generated/Blob");
const { isArrayBuffer } = require("../generated/utils");
const { concatTypedArrays } = require("../helpers/binary-data");

function convertLineEndingsToNative(s) {
  // jsdom always pretends to be *nix, for consistency.
  // See also https://github.com/jsdom/jsdom/issues/2396.
  return s.replace(/\r\n|\r|\n/g, "\n");
}

exports.implementation = class BlobImpl {
  constructor(globalObject, args) {
    const parts = args[0];
    const properties = args[1];

    const chunks = [];

    if (parts !== undefined) {
      for (const part of parts) {
        let chunk;
        if (isArrayBuffer(part)) {
          // Create a wrapper. The copying will happen in concatTypedArrays.
          chunk = new Uint8Array(part);
        } else if (ArrayBuffer.isView(part)) {
          // Use the part as-is. The copying will happen in concatTypedArrays.
          chunk = part;
        } else if (Blob.isImpl(part)) {
          // Use the existing buffer as-is. The copying will happen in concatTypedArrays.
          chunk = part._buffer;
        } else {
          let s = part;
          if (properties.endings === "native") {
            s = convertLineEndingsToNative(s);
          }
          chunk = utf8fromString(s);
        }
        chunks.push(chunk);
      }
    }

    this._buffer = concatTypedArrays(chunks);
    this._globalObject = globalObject;

    this.type = properties.type;
    if (/[^\u0020-\u007E]/.test(this.type)) {
      this.type = "";
    } else {
      this.type = this.type.toLowerCase();
    }
  }

  get size() {
    return this._buffer.length;
  }

  slice(start, end, contentType) {
    const { size } = this;

    let relativeStart, relativeEnd, relativeContentType;

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

    if (contentType === undefined) {
      relativeContentType = "";
    } else {
      // sanitization (lower case and invalid char check) is done in the
      // constructor
      relativeContentType = contentType;
    }

    const span = Math.max(relativeEnd - relativeStart, 0);

    const slicedBuffer = this._buffer.slice(relativeStart, relativeStart + span);

    const blob = Blob.createImpl(this._globalObject, [[], { type: relativeContentType }], {});
    blob._buffer = slicedBuffer;
    return blob;
  }
};
