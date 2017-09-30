interface HTMLStyleElement : HTMLElement {
  [Reflect] attribute DOMString media;
  [Reflect] attribute DOMString nonce;
  [Reflect] attribute DOMString type;
//  attribute boolean scoped;
};
HTMLStyleElement implements LinkStyle;
