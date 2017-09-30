interface HTMLMetaElement : HTMLElement {
  [Reflect] attribute DOMString name;
  [Reflect=http_equiv] attribute DOMString httpEquiv;
  [Reflect] attribute DOMString content;

  // also has obsolete members
};

partial interface HTMLMetaElement {
  [Reflect] attribute DOMString scheme;
};
