// https://svgwg.org/svg2-draft/shapes.html#InterfaceSVGCircleElement

interface SVGCircleElement : SVGGeometryElement {
  [SameObject] readonly attribute SVGAnimatedLength cx;
  [SameObject] readonly attribute SVGAnimatedLength cy;
  [SameObject] readonly attribute SVGAnimatedLength r;

  Object getPathData();
};
