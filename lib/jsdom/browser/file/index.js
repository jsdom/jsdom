"use strict";

var Blob = require("./blob");
var File = require("./file");
var createFileReader = require("./filereader");

module.exports = {
  Blob: Blob,
  File: File,
  createFileReader: createFileReader
};
