[Exposed=Window,
 HTMLConstructor]
interface HTMLPreElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLPreElement {
  [CEReactions, Reflect] attribute long width;
};
