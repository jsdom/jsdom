"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;

class SVGCircleElementImpl extends SVGGeometryElementImpl {}

SVGCircleElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGCircleElementImpl;
