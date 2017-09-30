interface HTMLLinkElement : HTMLElement {
  attribute DOMString href;
  [Reflect] attribute DOMString? crossOrigin;
  [Reflect] attribute DOMString rel;
//  readonly attribute DOMTokenList relList;
  [Reflect] attribute DOMString media;
  [Reflect] attribute DOMString hreflang;
  [Reflect] attribute DOMString type;
//  [PutForwards=value] readonly attribute DOMSettableTokenList sizes;

  // also has obsolete members
};
HTMLLinkElement implements LinkStyle;

partial interface HTMLLinkElement {
  [Reflect] attribute DOMString charset;
  [Reflect] attribute DOMString rev;
  [Reflect] attribute DOMString target;
};
