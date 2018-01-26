// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGPoint.webidl

interface SVGPoint {
  [SetterThrows]
  attribute float x;
  [SetterThrows]
  attribute float y;

  // [NewObject] SVGPoint matrixTransform(SVGMatrix matrix);
};
