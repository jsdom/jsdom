// https://svgwg.org/svg2-draft/shapes.html#InterfaceSVGLineElement

interface SVGLineElement : SVGGeometryElement {
  [SameObject] readonly attribute SVGAnimatedLength x1;
  [SameObject] readonly attribute SVGAnimatedLength y1;
  [SameObject] readonly attribute SVGAnimatedLength x2;
  [SameObject] readonly attribute SVGAnimatedLength y2;

  Object getPathData();
};
