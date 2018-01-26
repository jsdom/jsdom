"use strict";

const SVGGraphicsElementImpl = require("./SVGGraphicsElement-impl").implementation;

class SVGGeometryElementImpl extends SVGGraphicsElementImpl {}

SVGGeometryElementImpl.attributeRegistry = new Map([
  ...SVGGraphicsElementImpl.attributeRegistry
]);

exports.implementation = SVGGeometryElementImpl;
