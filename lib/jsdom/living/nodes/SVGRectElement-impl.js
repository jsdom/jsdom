"use strict";

const SVGGeometryElementImpl = require("./SVGGeometryElement-impl").implementation;
const SVGPathData = require('svg-pathdata').SVGPathData;
const polygonContains = require('d3-polygon').polygonContains;
// TODO: const polygonLength = require('d3-polygon').polygonLength;
const getPolygonFromPath = require('./SVGShapeUtils').getPolygonFromPath;

class SVGRectElementImpl extends SVGGeometryElementImpl {
  constructor(args, privateData) {
    super(args, privateData);
    // this._proxyWindowEventsToWindow();
  }

  isPointInFill(point) {
    const pathData = this.getPathData();
    const polygon = getPolygonFromPath(pathData);
    return polygonContains(polygon, [ point.x, point.y ]);
  }

  getPathData() {
    const x = parseInt(this.getAttribute('x'), 10);
    const y = parseInt(this.getAttribute('y'), 10);
    const width = parseInt(this.getAttribute('width'), 10);
    const height = parseInt(this.getAttribute('height'), 10);

    const pathString = [
      `M ${x} ${y}`,
      `L ${x + width} ${y}`,
      `L ${x + width} ${y + height}`,
      `L ${x} ${y + height}`,
      'Z'
    ].join(' ');

    return new SVGPathData(pathString);
  }
}

SVGRectElementImpl.attributeRegistry = new Map([...SVGGeometryElementImpl.attributeRegistry]);

exports.implementation = SVGRectElementImpl;
