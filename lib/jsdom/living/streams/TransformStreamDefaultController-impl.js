'use strict';

const aos = require('./abstract-ops/transform-streams.js');
const rsAOs = require('./abstract-ops/readable-streams.js');

exports.implementation = class TransformStreamDefaultController {
  get desiredSize() {
    const readableController = this._stream._readable._controller;
    return rsAOs.ReadableStreamDefaultControllerGetDesiredSize(readableController);
  }

  enqueue(chunk) {
    aos.TransformStreamDefaultControllerEnqueue(this, chunk);
  }

  error(reason) {
    aos.TransformStreamDefaultControllerError(this, reason);
  }

  terminate() {
    aos.TransformStreamDefaultControllerTerminate(this);
  }
};
