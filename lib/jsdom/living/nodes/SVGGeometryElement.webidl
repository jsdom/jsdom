// https://svgwg.org/svg2-draft/types.html#InterfaceSVGGeometryElement
interface SVGGeometryElement : SVGGraphicsElement {
  // [SameObject] readonly attribute SVGAnimatedNumber pathLength;

  boolean isPointInFill(DOMPoint point);
  boolean isPointInStroke(DOMPoint point);
  float getTotalLength();
  DOMPoint getPointAtLength(float distance);
};
