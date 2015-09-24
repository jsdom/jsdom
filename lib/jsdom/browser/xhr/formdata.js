"use strict";

var stream = require("stream");

var Blob = require("../file/blob");

function FormData(form) {
  if (!(this instanceof FormData)) {
    throw new TypeError("DOM object constructor cannot be called as a function.");
  }
  this._formData = {};
  if (form && form.elements) {
    for (var i = 0; i < form.elements.length; i++) {
      var el = form.elements[i];
      this._formData[el.name] = el.value;
    }
  }
}

(function (proto) {
  proto.append = function append(key, value, filename) {
    var obj = {
      value: value,
      options: {}
    };
    if (value instanceof Blob) {
      obj.value = value._buffer;
      obj.options.filename = "blob";
      obj.options.contentType = value.type;
      obj.options.knownLength = value.size;
    } else if (!(value instanceof Buffer || value instanceof stream.Readable)) {
      obj.value = value.toString();
    }

    if (filename) {
      obj.options.filename = filename;
    }
    this._formData[key] = obj;
  };
})(FormData.prototype);

module.exports = FormData;
