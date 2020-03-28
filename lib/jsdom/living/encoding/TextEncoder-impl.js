"use strict";

const hasNode10 = process.versions.node && Number(process.versions.node.split(".")[0]) === 10;
const { TextEncoder } = !hasNode10 ? global : require("text-encoding");

exports.implementation = class TextEncoderImpl {
  constructor() {
    this._internal = new TextEncoder();
  }

  get encoding() {
    return this._internal.encoding;
  }

  encode(input = "") {
    return this._internal.encode(input);
  }
};
