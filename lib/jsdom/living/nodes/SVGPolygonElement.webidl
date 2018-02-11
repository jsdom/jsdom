// https://svgwg.org/svg2-draft/shapes.html#InterfaceSVGPolygonElement

interface SVGPolygonElement : SVGGeometryElement {
  Object getPathData();
};

SVGPolygonElement implements SVGAnimatedPoints;
