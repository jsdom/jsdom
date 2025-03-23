// https://svgwg.org/svg2-draft/types.html#InterfaceSVGElement
[Exposed=Window]
interface SVGElement : Element {

  [SameObject, Reflect="class"] readonly attribute SVGAnimatedString className;

  readonly attribute SVGSVGElement? ownerSVGElement;
  readonly attribute SVGElement? viewportElement;
};

SVGElement includes GlobalEventHandlers;
// SVGElement includes SVGElementInstance;
SVGElement includes HTMLOrSVGElement;

// The spec contains:
// SVGElement includes DocumentAndElementEventHandlers;
// but per https://github.com/w3c/svgwg/issues/903#issuecomment-2746039603 it's not necessary.
