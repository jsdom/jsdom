[Exposed=Window,
 HTMLConstructor]
interface HTMLLegendElement : HTMLElement {
  readonly attribute HTMLFormElement? form;

  // also has obsolete members
};

partial interface HTMLLegendElement {
  [CEReactions, Reflect] attribute DOMString align;
};
