"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGPathData = require('svg-pathdata').SVGPathData;

class SVGPolylineElementImpl extends SVGGeometryElementImpl {
    getPathData() {
        const pathData = new SVGPathData(d);
        // TODO
        return pathData;
    }
}

SVGPolylineElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGPolylineElementImpl;
