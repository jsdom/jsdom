[Exposed=Window,
 HTMLConstructor]
interface HTMLEmbedElement : HTMLElement {
  [CEReactions] attribute USVString src;
  [CEReactions, Reflect] attribute DOMString type;
  [CEReactions, Reflect] attribute DOMString width;
  [CEReactions, Reflect] attribute DOMString height;
//  Document? getSVGDocument();

  // also has obsolete members
};

partial interface HTMLEmbedElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect] attribute DOMString name;
};
