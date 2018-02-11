"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGPathData = require('svg-pathdata').SVGPathData;

class SVGPolygonElementImpl extends SVGGeometryElementImpl {
    getPathData() {
        const pathData = new SVGPathData(d);
        // TODO
        return pathData;
    }
}

SVGPolygonElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGPolygonElementImpl;
