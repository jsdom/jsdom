"use strict";

const {
  readableByteStreamControllerRespond,
  readableByteStreamControllerRespondWithNewView
} = require("./internals");

function isBufferDetached(buffer) {
  return typeof buffer.detached === "boolean" ? buffer.detached : false;
}

exports.implementation = class ReadableStreamBYOBRequestImpl {
  constructor(globalObject) {
    this._globalObject = globalObject;
    this._controller = undefined;
    this._view = null;
  }

  get view() {
    return this._view;
  }

  respond(bytesWritten) {
    if (this._controller === undefined) {
      throw new this._globalObject.TypeError("Request is no longer associated with a controller.");
    }
    if (isBufferDetached(this._view.buffer)) {
      throw new this._globalObject.TypeError("view's buffer has been detached.");
    }
    readableByteStreamControllerRespond(this._controller, bytesWritten);
  }

  respondWithNewView(view) {
    if (this._controller === undefined) {
      throw new this._globalObject.TypeError("Request is no longer associated with a controller.");
    }
    if (isBufferDetached(view.buffer)) {
      throw new this._globalObject.TypeError("view's buffer has been detached.");
    }
    readableByteStreamControllerRespondWithNewView(this._controller, view);
  }
};
