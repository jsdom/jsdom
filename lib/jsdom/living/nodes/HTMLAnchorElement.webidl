interface HTMLAnchorElement : HTMLElement {
  [Reflect] attribute DOMString target;
  [Reflect] attribute DOMString download;
//  [PutForwards=value] readonly attribute DOMSettableTokenList ping;
  [Reflect] attribute DOMString rel;
//  readonly attribute DOMTokenList relList;
  [Reflect] attribute DOMString hreflang;
  [Reflect] attribute DOMString type;

  attribute DOMString text;

  // also has obsolete members
};
HTMLAnchorElement implements HTMLHyperlinkElementUtils;

partial interface HTMLAnchorElement {
  [Reflect] attribute DOMString coords;
  [Reflect] attribute DOMString charset;
  [Reflect] attribute DOMString name;
  [Reflect] attribute DOMString rev;
  [Reflect] attribute DOMString shape;
};
