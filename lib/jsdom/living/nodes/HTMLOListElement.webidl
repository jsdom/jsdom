[Exposed=Window,
 HTMLConstructor]
interface HTMLOListElement : HTMLElement {
  [CEReactions, Reflect] attribute boolean reversed;
  [CEReactions, Reflect] attribute long start; // TODO this needs the default value
  [CEReactions, Reflect] attribute DOMString type;

  // also has obsolete members
};

partial interface HTMLOListElement {
  [CEReactions, Reflect] attribute boolean compact;
};
