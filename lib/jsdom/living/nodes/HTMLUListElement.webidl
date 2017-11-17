[Exposed=Window,
 HTMLConstructor]
interface HTMLUListElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLUListElement {
  [CEReactions, Reflect] attribute boolean compact;
  [CEReactions, Reflect] attribute DOMString type;
};
