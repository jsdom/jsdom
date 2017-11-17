[Exposed=Window,
 HTMLConstructor]
interface HTMLHeadingElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLHeadingElement {
  [CEReactions, Reflect] attribute DOMString align;
};
