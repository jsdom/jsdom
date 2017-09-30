interface HTMLOListElement : HTMLElement {
  [Reflect] attribute boolean reversed;
  [Reflect] attribute long start; // TODO this needs the default value
  [Reflect] attribute DOMString type;

  // also has obsolete members
};

partial interface HTMLOListElement {
  [Reflect] attribute boolean compact;
};
