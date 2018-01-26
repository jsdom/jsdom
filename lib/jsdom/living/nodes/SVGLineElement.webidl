// https://developer.mozilla.org/en-US/docs/Web/API/SVGLineElement
// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGLineElement.webidl
interface SVGLineElement : SVGGeometryElement {
  [Constant] readonly attribute SVGAnimatedLength x1;
  [Constant] readonly attribute SVGAnimatedLength y1;
  [Constant] readonly attribute SVGAnimatedLength x2;
  [Constant] readonly attribute SVGAnimatedLength y2;
};
