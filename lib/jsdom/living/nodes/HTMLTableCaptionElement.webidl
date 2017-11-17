[Exposed=Window,
 HTMLConstructor]
interface HTMLTableCaptionElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLTableCaptionElement {
  [CEReactions, Reflect] attribute DOMString align;
};
