"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;

class SVGPolygonElementImpl extends SVGGeometryElementImpl {}

SVGPolygonElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGPolygonElementImpl;
