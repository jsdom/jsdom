"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;

class SVGLineElementImpl extends SVGGeometryElementImpl {}

SVGLineElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGLineElementImpl;
