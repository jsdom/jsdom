// https://developer.mozilla.org/en-US/docs/Web/API/SVGCircleElement
// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGCircleElement.webidl
interface SVGCircleElement : SVGGeometryElement {
  [Constant] readonly attribute SVGAnimatedLength cx;
  [Constant] readonly attribute SVGAnimatedLength cy;
  [Constant] readonly attribute SVGAnimatedLength r;
};
