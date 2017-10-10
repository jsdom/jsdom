// This mixin does not exist in any standards, but since these attributes/operations in SVGElement are implemented in
// defined in terms of HTMLElement they are factored out.
[NoInterfaceObject]
interface HTMLAndSVGElementShared {
  [SameObject] readonly attribute DOMStringMap dataset;
  attribute long tabIndex;
  void focus();
  void blur();
};
