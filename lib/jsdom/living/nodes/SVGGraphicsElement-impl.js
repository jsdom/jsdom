"use strict";

const SVGElementImpl = require("./SVGElement-impl").implementation;

class SVGGraphicsElementImpl extends SVGElementImpl { }

module.exports = {
  implementation: SVGGraphicsElementImpl
};
