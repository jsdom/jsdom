[Exposed=Window,
 HTMLConstructor]
interface HTMLStyleElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString media;
  [CEReactions, Reflect] attribute DOMString nonce;

  // also has obsolete members
};
HTMLStyleElement implements LinkStyle;

partial interface HTMLStyleElement {
  [CEReactions, Reflect] attribute DOMString type;
};
