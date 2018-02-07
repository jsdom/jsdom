// https://developer.mozilla.org/en-US/docs/Web/API/SVGEllipseElement
// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGEllipseElement.webidl
interface SVGEllipseElement : SVGGeometryElement {
  [Constant] readonly attribute SVGAnimatedLength cx;
  [Constant] readonly attribute SVGAnimatedLength cy;
  [Constant] readonly attribute SVGAnimatedLength r;
};
