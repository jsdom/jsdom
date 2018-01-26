// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGAnimatedPoints.webidl

[NoInterfaceObject]
interface SVGAnimatedPoints {
  [Constant]
  readonly attribute SVGPointList points;
  [Constant]
  readonly attribute SVGPointList animatedPoints;
};
