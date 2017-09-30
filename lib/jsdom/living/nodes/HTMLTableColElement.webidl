interface HTMLTableColElement : HTMLElement {
  [Reflect] attribute unsigned long span; // TODO: limited to only non-negative numbers greater than zero

  // also has obsolete members
};

partial interface HTMLTableColElement {
  [Reflect] attribute DOMString align;
  [Reflect=char] attribute DOMString ch;
  [Reflect=charoff] attribute DOMString chOff;
  [Reflect] attribute DOMString vAlign;
  [Reflect] attribute DOMString width;
};
