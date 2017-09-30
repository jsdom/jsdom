[NamedConstructor=Image(optional unsigned long width, optional unsigned long height)]
interface HTMLImageElement : HTMLElement {
  [Reflect] attribute DOMString alt;
  attribute DOMString src;
  [Reflect] attribute DOMString srcset;
  [Reflect] attribute DOMString sizes;
  [Reflect] attribute DOMString? crossOrigin;
  [Reflect] attribute DOMString useMap;
  [Reflect] attribute boolean isMap;
  attribute unsigned long width;
  attribute unsigned long height;
  readonly attribute unsigned long naturalWidth;
  readonly attribute unsigned long naturalHeight;
  readonly attribute boolean complete;
  readonly attribute DOMString currentSrc;

  // also has obsolete members
};

partial interface HTMLImageElement {
  [Reflect] attribute DOMString name;
  [Reflect] attribute DOMString lowsrc;
  [Reflect] attribute DOMString align;
  [Reflect] attribute long hspace;
  [Reflect] attribute long vspace;
  [Reflect] attribute DOMString longDesc;

  [Reflect, TreatNullAs=EmptyString] attribute DOMString border;
};
