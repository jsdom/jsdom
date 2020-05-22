// https://svgwg.org/svg2-draft/types.html#InterfaceSVGElement
[Exposed=Window]
interface SVGElement : Element {

  // TODO: implement reflection in webidl2js
  [SameObject] readonly attribute SVGAnimatedString className;

  readonly attribute SVGSVGElement? ownerSVGElement;
  readonly attribute SVGElement? viewportElement;
};

SVGElement includes GlobalEventHandlers;
// SVGElement includes DocumentAndElementEventHandlers;
// SVGElement includes SVGElementInstance;
SVGElement includes HTMLOrSVGElement;
