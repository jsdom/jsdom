"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGPathData = require('svg-pathdata').SVGPathData;
const polygonContains = require('d3-polygon').polygonContains;
// TODO: const polygonLength = require('d3-polygon').polygonLength;
const getPolygonFromPath = require('./SVGShapeUtils').getPolygonFromPath;

class SVGPathElementImpl extends SVGGeometryElementImpl {
  isPointInFill(point) {
    const pathData = this.getPathData();
    const polygon = getPolygonFromPath(pathData);
    return polygonContains(polygon, [ point.x, point.y ]);
  }

  getPathData() {
    const d = this.getAttribute('d');
    return new SVGPathData(d);
  }
}

SVGPathElementImpl.attributeRegistry = new Map([
  ...SVGGeometryElementImpl.attributeRegistry
]);

exports.implementation = SVGPathElementImpl;
