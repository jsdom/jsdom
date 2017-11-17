[Exposed=Window,
 HTMLConstructor]
interface HTMLMenuElement : HTMLElement {

  // also has obsolete members
};

partial interface HTMLMenuElement {
  [CEReactions, Reflect] attribute boolean compact;
};
