"use strict";

const SVGGraphicsElementImpl = require("./SVGGraphicsElement-impl").implementation;

class SVGUnknownElementImpl extends SVGGraphicsElementImpl { }

module.exports = {
  implementation: SVGUnknownElementImpl
};
