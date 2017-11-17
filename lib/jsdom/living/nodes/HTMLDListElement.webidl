[Exposed=Window,
 HTMLConstructor]
interface HTMLDListElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLDListElement {
  [CEReactions, Reflect] attribute boolean compact;
};
