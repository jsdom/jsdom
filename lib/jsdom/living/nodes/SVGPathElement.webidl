// https://svgwg.org/svg2-draft/types.html#InterfaceSVGPathElement
// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGPathElement.webidl
interface SVGPathElement : SVGGeometryElement {
  unsigned long getPathSegAtLength(float distance);
  [NewObject]
  SVGPathSegClosePath createSVGPathSegClosePath();
  [NewObject]
  SVGPathSegMovetoAbs createSVGPathSegMovetoAbs(float x, float y);
  [NewObject]
  SVGPathSegMovetoRel createSVGPathSegMovetoRel(float x, float y);
  [NewObject]
  SVGPathSegLinetoAbs createSVGPathSegLinetoAbs(float x, float y);
  [NewObject]
  SVGPathSegLinetoRel createSVGPathSegLinetoRel(float x, float y);
  [NewObject]
  SVGPathSegCurvetoCubicAbs createSVGPathSegCurvetoCubicAbs(float x, float y, float x1, float y1, float x2, float y2);
  [NewObject]
  SVGPathSegCurvetoCubicRel createSVGPathSegCurvetoCubicRel(float x, float y, float x1, float y1, float x2, float y2);
  [NewObject]
  SVGPathSegCurvetoQuadraticAbs createSVGPathSegCurvetoQuadraticAbs(float x, float y, float x1, float y1);
  [NewObject]
  SVGPathSegCurvetoQuadraticRel createSVGPathSegCurvetoQuadraticRel(float x, float y, float x1, float y1);
  [NewObject]
  SVGPathSegArcAbs createSVGPathSegArcAbs(float x, float y, float r1, float r2, float angle, boolean largeArcFlag, boolean sweepFlag);
  [NewObject]
  SVGPathSegArcRel createSVGPathSegArcRel(float x, float y, float r1, float r2, float angle, boolean largeArcFlag, boolean sweepFlag);
  [NewObject]
  SVGPathSegLinetoHorizontalAbs createSVGPathSegLinetoHorizontalAbs(float x);
  [NewObject]
  SVGPathSegLinetoHorizontalRel createSVGPathSegLinetoHorizontalRel(float x);
  [NewObject]
  SVGPathSegLinetoVerticalAbs createSVGPathSegLinetoVerticalAbs(float y);
  [NewObject]
  SVGPathSegLinetoVerticalRel createSVGPathSegLinetoVerticalRel(float y);
  [NewObject]
  SVGPathSegCurvetoCubicSmoothAbs createSVGPathSegCurvetoCubicSmoothAbs(float x, float y, float x2, float y2);
  [NewObject]
  SVGPathSegCurvetoCubicSmoothRel createSVGPathSegCurvetoCubicSmoothRel(float x, float y, float x2, float y2);
  [NewObject]
  SVGPathSegCurvetoQuadraticSmoothAbs createSVGPathSegCurvetoQuadraticSmoothAbs(float x, float y);
  [NewObject]
  SVGPathSegCurvetoQuadraticSmoothRel createSVGPathSegCurvetoQuadraticSmoothRel(float x, float y);
};
