"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;

class SVGPolylineElementImpl extends SVGGeometryElementImpl {}

SVGPolylineElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGPolylineElementImpl;
