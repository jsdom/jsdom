// https://svgwg.org/svg2-draft/shapes.html#InterfaceSVGEllipseElement

interface SVGEllipseElement : SVGGeometryElement {
  [SameObject] readonly attribute SVGAnimatedLength cx;
  [SameObject] readonly attribute SVGAnimatedLength cy;
  [SameObject] readonly attribute SVGAnimatedLength rx;
  [SameObject] readonly attribute SVGAnimatedLength ry;
};
