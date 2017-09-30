interface HTMLEmbedElement : HTMLElement {
  attribute DOMString src;
  [Reflect] attribute DOMString type;
  [Reflect] attribute DOMString width;
  [Reflect] attribute DOMString height;
//  Document? getSVGDocument();
//  legacycaller any (any... arguments);

  // also has obsolete members
};

partial interface HTMLEmbedElement {
  [Reflect] attribute DOMString align;
  [Reflect] attribute DOMString name;
};
