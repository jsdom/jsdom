"use strict";

const EventImpl = require("./Event-impl").implementation;
const { retarget } = require("../helpers/shadow-dom");
const idlUtils = require("../../../generated/idl/utils");

const ToggleEventInit = require("../../../generated/idl/ToggleEventInit");

// https://html.spec.whatwg.org/multipage/interaction.html#the-toggleevent-interface
class ToggleEventImpl extends EventImpl {
  get source() {
    return retarget(this._source, idlUtils.tryImplForWrapper(this.currentTarget));
  }

  set source(value) {
    this._source = value;
  }
}
ToggleEventImpl.defaultInit = ToggleEventInit.convert(undefined, undefined);

module.exports = {
  implementation: ToggleEventImpl,
};
