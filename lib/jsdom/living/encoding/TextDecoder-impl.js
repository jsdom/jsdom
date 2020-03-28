"use strict";

const hasNode10 = process.versions.node && Number(process.versions.node.split(".")[0]) === 10;
const { TextDecoder } = !hasNode10 ? global : require("text-encoding");

exports.implementation = class TextDecoderImpl {
  constructor(globalObject, args) {
    this._internal = new TextDecoder(...args);
  }

  get encoding() {
    return this._internal._encoding;
  }

  get fatal() {
    return this._internal._fatal;
  }

  get ignoreBOM() {
    return this._internal._ignoreBOM;
  }

  decode(input, options) {
    return this._internal.decode(input, options);
  }
};
