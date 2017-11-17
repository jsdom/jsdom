[Exposed=Window,
 HTMLConstructor]
interface HTMLLIElement : HTMLElement {
  [CEReactions, Reflect] attribute long value;

  // also has obsolete members
};

partial interface HTMLLIElement {
  [CEReactions, Reflect] attribute DOMString type;
};
