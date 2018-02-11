"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGPathData = require('svg-pathdata').SVGPathData;

class SVGEllipseElementImpl extends SVGGeometryElementImpl {
    getPathData() {
        const pathData = new SVGPathData(d);
        // TODO: add SVGPathData.ARC to pathData drawing an ellipsis
        return pathData;
    }
}

SVGEllipseElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGEllipseElementImpl;
