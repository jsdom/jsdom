[Exposed=Window,
 HTMLConstructor]
interface HTMLParagraphElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLParagraphElement {
  [CEReactions, Reflect] attribute DOMString align;
};
