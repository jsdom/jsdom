"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;

class SVGPathElementImpl extends SVGGeometryElementImpl {}

SVGPathElementImpl.attributeRegistry = new Map([
  ...SVGGeometryElementImpl.attributeRegistry
]);

exports.implementation = SVGPathElementImpl;
