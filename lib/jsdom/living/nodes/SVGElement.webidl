// https://svgwg.org/svg2-draft/types.html#InterfaceSVGElement
interface SVGElement : Element {

  // TODO: implement reflection in webidl2js
  [SameObject] readonly attribute SVGAnimatedString className;

  [SameObject] readonly attribute DOMStringMap dataset;

  readonly attribute SVGSVGElement? ownerSVGElement;
  readonly attribute SVGElement? viewportElement;

  attribute long tabIndex;
  void focus();
  void blur();
};

SVGElement implements GlobalEventHandlers;
// SVGElement implements SVGElementInstance;
