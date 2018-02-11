// https://svgwg.org/svg2-draft/shapes.html#InterfaceSVGPolylineElement

interface SVGPolylineElement : SVGGeometryElement {
  Object getPathData();
};

SVGPolylineElement implements SVGAnimatedPoints;
