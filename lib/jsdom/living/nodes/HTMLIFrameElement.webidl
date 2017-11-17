[Exposed=Window,
 HTMLConstructor]
interface HTMLIFrameElement : HTMLElement {
  [CEReactions] attribute USVString src;
  [CEReactions, Reflect] attribute DOMString srcdoc;
  [CEReactions, Reflect] attribute DOMString name;
//  [SameObject, PutForwards=value] readonly attribute DOMTokenList sandbox;
  [CEReactions, Reflect] attribute boolean allowFullscreen;
//  [CEReactions] attribute boolean allowPaymentRequest;
//  [CEReactions] attribute boolean allowUserMedia;
  [CEReactions, Reflect] attribute DOMString width;
  [CEReactions, Reflect] attribute DOMString height;
//  [CEReactions] attribute DOMString referrerPolicy;
  readonly attribute Document? contentDocument;
  readonly attribute WindowProxy? contentWindow;
  Document? getSVGDocument();

  // also has obsolete members
};

partial interface HTMLIFrameElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect] attribute DOMString scrolling;
  [CEReactions, Reflect] attribute DOMString frameBorder;
  [CEReactions] attribute USVString longDesc;

  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString marginHeight;
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString marginWidth;
};
