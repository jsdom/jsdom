"use strict";

const ElementImpl = require("./Element-impl").implementation;

class SVGElementImpl extends ElementImpl { }

module.exports = {
  implementation: SVGElementImpl
};
