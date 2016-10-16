"use strict";

const whatwgEncoding = require("whatwg-encoding");
const parseContentType = require("content-type-parser");
const querystring = require("querystring");
const DOMException = require("../web-idl/DOMException");
const EventTarget = require("./generated/EventTarget");
const addConstants = require("../utils").addConstants;
const blobSymbols = require("./blob-symbols");

function FileReaderEventTarget() {
  if (!(this instanceof FileReaderEventTarget)) {
    throw new TypeError("DOM object constructor cannot be called as a function.");
  }
  EventTarget.setup(this);
}

FileReaderEventTarget.prototype = Object.create(EventTarget.interface.prototype);

module.exports = function createFileReader(window) {
  const ProgressEvent = window.ProgressEvent;

  class FileReader extends FileReaderEventTarget {
    constructor() {
      super();
      this.error = null;
      this.readyState = FileReader.EMPTY;
      this.result = null;
      this.onloadstart = null;
      this.onprogress = null;
      this.onload = null;
      this.onabort = null;
      this.onerror = null;
      this.onloadend = null;
    }
    readAsArrayBuffer(file) {
      readFile(this, file, "buffer");
    }
    readAsDataURL(file) {
      readFile(this, file, "dataUrl");
    }
    readAsText(file, encoding) {
      readFile(this, file, "text", whatwgEncoding.labelToName(encoding) || "UTF-8");
    }
    abort() {
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

    get _ownerDocument() {
      return window.document;
    }
  }

  addConstants(FileReader, {
    EMPTY: 0,
    LOADING: 1,
    DONE: 2
  });

  function readFile(self, file, format, encoding) {
    if (self.readyState === self.LOADING) {
      throw new DOMException(DOMException.INVALID_STATE_ERR);
    }
    if (file[blobSymbols.closed]) {
      self.error = new DOMException(DOMException.INVALID_STATE_ERR);
      self.dispatchEvent(new ProgressEvent("error"));
    }

    self.readyState = self.LOADING;
    self.dispatchEvent(new ProgressEvent("loadstart"));

    process.nextTick(() => {
      let data = file[blobSymbols.buffer];
      if (!data) {
        data = new Buffer("");
      }
      self.dispatchEvent(new ProgressEvent("progress", {
        lengthComputable: !isNaN(file.size),
        total: file.size,
        loaded: data.length
      }));

      process.nextTick(() => {
        switch (format) {
          default:
          case "buffer": {
            self.result = (new Uint8Array(data)).buffer;
            break;
          }
          case "dataUrl": {
            let dataUrl = "data:";
            const contentType = parseContentType(file.type);
            if (contentType && contentType.isText()) {
              const fallbackEncoding = whatwgEncoding.getBOMEncoding(data) ||
                whatwgEncoding.labelToName(contentType.get("charset")) || "UTF-8";
              const decoded = whatwgEncoding.decode(data, fallbackEncoding);

              contentType.set("charset", encoding);
              dataUrl += contentType.toString();
              dataUrl += ",";
              dataUrl += querystring.escape(decoded);
            } else {
              if (contentType) {
                dataUrl += contentType.toString();
              }
              dataUrl += ";base64,";
              dataUrl += data.toString("base64");
            }
            self.result = dataUrl;
            break;
          }
          case "text": {
            self.result = whatwgEncoding.decode(data, encoding);
            break;
          }
        }
        self.readyState = self.DONE;
        self.dispatchEvent(new ProgressEvent("load"));
        self.dispatchEvent(new ProgressEvent("loadend"));
      });
    });
  }

  return FileReader;
};
