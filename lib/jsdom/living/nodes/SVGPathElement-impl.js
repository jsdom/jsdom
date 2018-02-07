"use strict";

const { mixin } = require("../../utils");
const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGAnimatedPathDataImpl = require("./SVGAnimatedPathData-impl").implementation;

class SVGPathElementImpl extends SVGGeometryElementImpl {}

SVGPathElementImpl.attributeRegistry = new Map([
  ...SVGGeometryElementImpl.attributeRegistry,
  ...SVGAnimatedPathDataImpl.attributeRegistry
]);

mixin(SVGPathElementImpl.prototype, SVGAnimatedPathDataImpl.prototype);

exports.implementation = SVGPathElementImpl;
