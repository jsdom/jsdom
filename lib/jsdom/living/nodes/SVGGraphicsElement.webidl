// https://svgwg.org/svg2-draft/types.html#InterfaceSVGGraphicsElement
dictionary SVGBoundingBoxOptions {
  boolean fill = true;
  boolean stroke = false;
  boolean markers = false;
  boolean clipped = false;
};

[Exposed=Window]
interface SVGGraphicsElement : SVGElement {
  // [SameObject] readonly attribute SVGAnimatedTransformList transform;

  // DOMRect getBBox(optional SVGBoundingBoxOptions options);
  // DOMMatrix? getCTM();
  // DOMMatrix? getScreenCTM();
};

SVGGraphicsElement includes SVGTests;
