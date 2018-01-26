"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;

class SVGEllipseElementImpl extends SVGGeometryElementImpl {}

SVGEllipseElementImpl.attributeRegistry = new Map([
  ...SVGGeometryElementImpl.attributeRegistry
]);

exports.implementation = SVGEllipseElementImpl;
