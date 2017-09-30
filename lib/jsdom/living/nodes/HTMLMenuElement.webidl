interface HTMLMenuElement : HTMLElement {
  [Reflect] attribute DOMString type;
  [Reflect] attribute DOMString label;

  // also has obsolete members
};

partial interface HTMLMenuElement {
  [Reflect] attribute boolean compact;
};
