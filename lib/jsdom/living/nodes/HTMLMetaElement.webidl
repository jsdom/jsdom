[Exposed=Window,
 HTMLConstructor]
interface HTMLMetaElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString name;
  [CEReactions, Reflect=http_equiv] attribute DOMString httpEquiv;
  [CEReactions, Reflect] attribute DOMString content;

  // also has obsolete members
};

partial interface HTMLMetaElement {
  [CEReactions, Reflect] attribute DOMString scheme;
};
