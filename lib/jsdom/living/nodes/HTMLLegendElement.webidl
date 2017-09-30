interface HTMLLegendElement : HTMLElement {
  readonly attribute HTMLFormElement? form;

  // also has obsolete members
};

partial interface HTMLLegendElement {
  [Reflect] attribute DOMString align;
};
