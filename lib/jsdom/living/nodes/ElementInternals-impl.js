"use strict";

const { mixin } = require("../../utils");
const ARIAMixinImpl = require("./ARIAMixin-impl").implementation;

class ElementInternals {}

mixin(ElementInternals.prototype, ARIAMixinImpl.prototype);

module.exports = {
  implementation: ElementInternals
};
