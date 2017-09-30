interface HTMLLIElement : HTMLElement {
  [Reflect] attribute long value;

  // also has obsolete members
};

partial interface HTMLLIElement {
  [Reflect] attribute DOMString type;
};
