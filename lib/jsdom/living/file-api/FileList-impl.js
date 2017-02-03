"use strict";

exports.implementation = class FileListImpl extends Array {
  item(index) {
    return this[index] || null;
  }
};
