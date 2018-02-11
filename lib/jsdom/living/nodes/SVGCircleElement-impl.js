"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGPathData = require('svg-pathdata').SVGPathData;

class SVGCircleElementImpl extends SVGGeometryElementImpl {
    getPathData() {
        const pathData = new SVGPathData(d);
        // TODO: add SVGPathData.ARC to pathData drawing a circle
        return pathData;
    }
}

SVGCircleElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGCircleElementImpl;
