"use strict";

const EventImpl = require("./Event-impl").implementation;

const PromiseRejectionEventInit = require("../generated/PromiseRejectionEventInit");

class PromiseRejectionEventImpl extends EventImpl {

}
PromiseRejectionEventImpl.defaultInit = PromiseRejectionEventInit.convert(undefined, undefined);

module.exports = {
  implementation: PromiseRejectionEventImpl
};
