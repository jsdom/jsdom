interface HTMLFrameElement : HTMLElement {
  [Reflect] attribute DOMString name;
  [Reflect] attribute DOMString scrolling;
  attribute DOMString src;
  [Reflect] attribute DOMString frameBorder;
  attribute DOMString longDesc;
  [Reflect] attribute boolean noResize;
  readonly attribute Document? contentDocument;
  readonly attribute WindowProxy? contentWindow;

  [Reflect, TreatNullAs=EmptyString] attribute DOMString marginHeight;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString marginWidth;
};
