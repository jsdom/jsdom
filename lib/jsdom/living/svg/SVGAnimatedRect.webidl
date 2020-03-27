// https://svgwg.org/svg2-draft/types.html#InterfaceSVGAnimatedRect
[Exposed=Window]
interface SVGAnimatedRect {
  [SameObject] readonly attribute DOMRect baseVal;
  [SameObject] readonly attribute DOMRectReadOnly animVal;
};
