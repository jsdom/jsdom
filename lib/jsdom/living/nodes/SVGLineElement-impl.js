"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGPathData = require('svg-pathdata').SVGPathData;

class SVGLineElementImpl extends SVGGeometryElementImpl {
    getPathData() {
        const pathData = new SVGPathData(d);
        // TODO
        return pathData;
    }
}

SVGLineElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGLineElementImpl;
