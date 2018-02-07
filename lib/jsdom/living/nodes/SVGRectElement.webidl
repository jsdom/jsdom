// https://developer.mozilla.org/en-US/docs/Web/API/SVGRectElement
// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGRectElement.webidl
interface SVGRectElement : SVGGeometryElement {
  [Constant] readonly attribute SVGAnimatedLength x;
  [Constant] readonly attribute SVGAnimatedLength y;
  [Constant] readonly attribute SVGAnimatedLength width;
  [Constant] readonly attribute SVGAnimatedLength height;
  [Constant] readonly attribute SVGAnimatedLength rx;
  [Constant] readonly attribute SVGAnimatedLength ry;
};
