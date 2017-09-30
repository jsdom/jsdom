interface HTMLSourceElement : HTMLElement {
  attribute DOMString src;
  [Reflect] attribute DOMString type;

  // also has obsolete members
};

partial interface HTMLSourceElement {
  [Reflect]          attribute DOMString srcset;
  [Reflect]          attribute DOMString sizes;
  [Reflect]          attribute DOMString media;
};
