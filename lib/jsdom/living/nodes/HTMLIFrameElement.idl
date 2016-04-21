interface HTMLIFrameElement : HTMLElement {
  attribute DOMString src;
  [Reflect] attribute DOMString srcdoc;
  [Reflect] attribute DOMString name;
  // [PutForwards=value] readonly attribute DOMSettableTokenList sandbox;
  attribute boolean seamless;
  [Reflect] attribute boolean allowFullscreen;
  [Reflect] attribute DOMString width;
  [Reflect] attribute DOMString height;
  readonly attribute Document? contentDocument;
  readonly attribute WindowProxy? contentWindow;
  Document? getSVGDocument();

  // also has obsolete members
};

partial interface HTMLIFrameElement {
  [Reflect] attribute DOMString align;
  [Reflect] attribute DOMString scrolling;
  [Reflect] attribute DOMString frameBorder;
  attribute DOMString longDesc;

  [Reflect, TreatNullAs=EmptyString] attribute DOMString marginHeight;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString marginWidth;
};
