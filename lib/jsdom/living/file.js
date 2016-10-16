"use strict";

const fileSymbols = require("./file-symbols");
const Blob = require("./blob");

module.exports = class File extends Blob {
  constructor(fileBits, fileName) {
    super(fileBits, arguments[2]);
    if (!(this instanceof File)) {
      throw new TypeError("DOM object constructor cannot be called as a function.");
    }
    const options = arguments[2];
    this[fileSymbols.name] = fileName.replace(/\//g, ":");
    this[fileSymbols.lastModified] = options && options.lastModified ? options.lastModified : Date.now();
  }
  get name() {
    return this[fileSymbols.name];
  }
  get lastModified() {
    return this[fileSymbols.lastModified];
  }
};
