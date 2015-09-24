"use strict";

var Blob = require("./blob");

function File(fileBits, fileName) {
  if (!(this instanceof File)) {
    throw new TypeError("DOM object constructor cannot be called as a function.");
  }
  var options = arguments[2];
  Blob.call(this, fileBits, options);
  this._name = fileName.replace(/\//g, ":");
}

File.prototype = Object.create(Blob.prototype,
  {
    name: {
      get: function () {
        return this._name;
      }
    }
  }
);

module.exports = File;
