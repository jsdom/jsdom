// https://svgwg.org/svg2-draft/struct.html#InterfaceSVGSVGElement
[Exposed=Window]
interface SVGSVGElement : SVGGraphicsElement {

  // [SameObject] readonly attribute SVGAnimatedLength x;
  // [SameObject] readonly attribute SVGAnimatedLength y;
  // [SameObject] readonly attribute SVGAnimatedLength width;
  // [SameObject] readonly attribute SVGAnimatedLength height;

  // attribute float currentScale;
  // [SameObject] readonly attribute DOMPointReadOnly currentTranslate;

  // NodeList getIntersectionList(DOMRectReadOnly rect, SVGElement? referenceElement);
  // NodeList getEnclosureList(DOMRectReadOnly rect, SVGElement? referenceElement);
  // boolean checkIntersection(SVGElement element, DOMRectReadOnly rect);
  // boolean checkEnclosure(SVGElement element, DOMRectReadOnly rect);

  // undefined deselectAll();

  SVGNumber createSVGNumber();
  // SVGLength createSVGLength();
  // SVGAngle createSVGAngle();
  // DOMPoint createSVGPoint();
  // DOMMatrix createSVGMatrix();

  // SVG 2 currently says to return DOMRect, but
  // https://github.com/w3c/svgwg/issues/706 says otherwise.
  SVGRect createSVGRect();

  // SVGTransform createSVGTransform();
  // SVGTransform createSVGTransformFromMatrix(DOMMatrixReadOnly matrix);

  Element getElementById(DOMString elementId);

  // Deprecated methods that have no effect when called,
  // but which are kept for compatibility reasons.
  unsigned long suspendRedraw(unsigned long maxWaitMilliseconds);
  undefined unsuspendRedraw(unsigned long suspendHandleID);
  undefined unsuspendRedrawAll();
  undefined forceRedraw();
};

SVGSVGElement includes SVGFitToViewBox;
// SVGSVGElement includes SVGZoomAndPan;
SVGSVGElement includes WindowEventHandlers;
