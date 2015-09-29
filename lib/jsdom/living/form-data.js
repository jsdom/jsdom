"use strict";

const stream = require("stream");

const blobSymbols = require("./blob-symbols");
const formDataSymbols = require("./form-data-symbols");

function createFormData(core) {
  const Blob = core.Blob;

  class FormData {
    constructor(form) {
      if (!(this instanceof FormData)) {
        throw new TypeError("DOM object constructor cannot be called as a function.");
      }
      this[formDataSymbols.formData] = {};
      if (form && form.elements) {
        for (let i = 0; i < form.elements.length; i++) {
          const el = form.elements[i];
          this[formDataSymbols.formData][el.name] = el.value;
        }
      }
    }
    append(key, value, filename) {
      const obj = {
        value: value,
        options: {}
      };
      if (value instanceof Blob) {
        obj.value = value[blobSymbols.buffer];
        obj.options.filename = "blob";
        obj.options.contentType = value.type;
        obj.options.knownLength = value.size;
      } else if (!(value instanceof Buffer || value instanceof stream.Readable)) {
        obj.value = value.toString();
      }

      if (filename) {
        obj.options.filename = filename;
      }
      this[formDataSymbols.formData][key] = obj;
    }
  }

  return FormData;
}

module.exports = function (core) {
  core.FormData = createFormData(core);
};
