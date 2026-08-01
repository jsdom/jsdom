"use strict";
const EventImpl = require("./Event-impl").implementation;

class BlobEventImpl extends EventImpl {}

// Cannot use the usual pattern since `data` is required.
BlobEventImpl.defaultInit = {
  __proto__: null,
  timecode: NaN
};

module.exports = {
  implementation: BlobEventImpl
};
