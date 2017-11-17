[Exposed=Window,
 HTMLConstructor]
interface HTMLBRElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLBRElement {
  [CEReactions, Reflect] attribute DOMString clear;
};
