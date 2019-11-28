// https://html.spec.whatwg.org/#htmlstyleelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLStyleElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString media;

  // also has obsolete members
};
HTMLStyleElement includes LinkStyle;

// https://html.spec.whatwg.org/#HTMLStyleElement-partial
partial interface HTMLStyleElement {
  [CEReactions, Reflect] attribute DOMString type;
};
