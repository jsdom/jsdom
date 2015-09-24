"use strict";

var DOMException = require("../../web-idl/DOMException");
var EventTarget = require("../../living/generated/events/EventTarget");
var core = require("../../level1/core");
require("../../level2/core");
require("../../level2/events");
var ProgressEvent = core.ProgressEvent;

function createFileReader(options) {
  function FileReader() {
    EventTarget.setup(this);
  }

  function readFile(self, file, format, encoding) {
    if (self.readyState === self.LOADING) {
      throw new DOMException(DOMException.INVALID_STATE_ERR);
    }
    if (file._closed) {
      self.error = new DOMException(DOMException.INVALID_STATE_ERR);
      self.dispatchEvent(new ProgressEvent("error"));
    }

    self.readyState = self.LOADING;
    self.dispatchEvent(new ProgressEvent("loadstart"));

    process.nextTick(function () {

      var data = file._buffer;
      if (!data) {
        data = new Buffer("");
      }
      self.dispatchEvent(new ProgressEvent("progress", {
        lengthComputable: (!isNaN(file.size)) ? true : false,
        total: file.size,
        loaded: data.length
      }));

      process.nextTick(function () {

        self.readyState = self.DONE;
        switch (format) {
          default:
          case "buffer":
            var ab = new ArrayBuffer(data.length);
            var view = new Uint8Array(ab);
            for (var i = 0; i < data.length; ++i) {
              view[i] = data[i];
            }
            self.result = ab;
            break;
          case "binary":
            self.result = data.toString("binary");
            break;
          case "dataUrl":
            var dataUrl = "data:";
            if (file.type) {
              dataUrl += file.type + ";";
            }
            if (/text/i.test(file.type)) {
              dataUrl += "charset=utf-8,";
              dataUrl += data.toString("utf8");
            } else {
              dataUrl += "base64,";
              dataUrl += data.toString("base64");
            }
            self.result = dataUrl;
            break;
          case "text":
            if (encoding) {
              encoding = encoding.toLowerCase();
              if (encoding === "utf-16" || encoding === "utf16") {
                encoding = "utf-16le";
              }
            } else {
              encoding = "utf8";
            }
            self.result = data.toString(encoding);
            break;
        }

        self.dispatchEvent(new ProgressEvent("load"));

        process.nextTick(function () {
          if (self.readyState !== self.LOADING) {
            self.dispatchEvent(new ProgressEvent("loadend"));
          }
        });
      });
    });
  }

  var constants = {
    EMPTY: {
      configurable: false,
      enumerable: true,
      value: 0,
      writable: false
    },
    LOADING: {
      configurable: false,
      enumerable: true,
      value: 1,
      writable: false
    },
    DONE: {
      configurable: false,
      enumerable: true,
      value: 2,
      writable: false
    }
  };

  Object.defineProperties(FileReader, constants);

  FileReader.prototype = Object.create(EventTarget.interface.prototype, {
    readAsArrayBuffer: {
      value: function (file) {
        readFile(this, file, "buffer");
      }
    },
    readAsBinaryString: {
      value: function (file) {
        readFile(this, file, "binary");
      }
    },
    readAsDataURL: {
      value: function (file) {
        readFile(this, file, "dataUrl");
      }
    },
    readAsText: {
      value: function (file, encoding) {
        readFile(this, file, "text", encoding);
      }
    },
    abort: {
      value: function () {
        if (this.readyState === this.DONE || this.readyState === this.EMPTY) {
          this.result = null;
          return;
        }
        if (this.readyState === this.LOADING) {
          this.readyState = this.DONE;
        }
        this.dispatchEvent(new ProgressEvent("abort"));
        this.dispatchEvent(new ProgressEvent("loadend"));
      }
    },
    error: {
      value: null,
      writable: true
    },
    readyState: {
      value: FileReader.EMPTY,
      writable: true
    },
    result: {
      value: null,
      writable: true
    },
    onloadstart: {
      value: null,
      writable: true
    },
    onprogress: {
      value: null,
      writable: true
    },
    onload: {
      value: null,
      writable: true
    },
    onabort: {
      value: null,
      writable: true
    },
    onerror: {
      value: null,
      writable: true
    },
    onloadend: {
      value: null,
      writable: true
    },
    _ownerDocument: {
      configurable: true,
      enumerable: true,
      get: function () {
        return options.window.document;
      }
    }
  });

  Object.defineProperties(FileReader.prototype, constants);

  FileReader.constructor = FileReader;

  return FileReader;
}

module.exports = createFileReader;
