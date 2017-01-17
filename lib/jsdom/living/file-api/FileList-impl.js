"use strict";

exports.implementation = class FileListImpl extends Array {
  constructor(args, privateData) {
    super();
  }
  item(index) {
    return this[index] || null;
  }
};
