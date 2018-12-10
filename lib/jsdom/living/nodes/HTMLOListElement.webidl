[Exposed=Window,
 HTMLConstructor]
interface HTMLOListElement : HTMLElement {
  [CEReactions, Reflect] attribute boolean reversed;
  [CEReactions] attribute long start;
  [CEReactions, Reflect] attribute DOMString type;

  // also has obsolete members
};

partial interface HTMLOListElement {
  [CEReactions, Reflect] attribute boolean compact;
};
