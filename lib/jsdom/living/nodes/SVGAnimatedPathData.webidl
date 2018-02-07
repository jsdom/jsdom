// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGAnimatedPathData.webidl

// [NoInterfaceObject]
interface SVGAnimatedPathData {
  // [SameObject] readonly attribute SVGAnimatedTransformList transform;

  [SameObject] readonly attribute SVGPathSegList pathSegList;
  [SameObject] readonly attribute SVGPathSegList animatedPathSegList;
};
