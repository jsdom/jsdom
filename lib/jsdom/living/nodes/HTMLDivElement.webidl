[Exposed=Window,
 HTMLConstructor]
interface HTMLDivElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLDivElement {
  [CEReactions, Reflect] attribute DOMString align;
};
