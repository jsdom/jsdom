// https://html.spec.whatwg.org/multipage/iframe-embed-object.html#htmliframeelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLIFrameElement : HTMLElement {
  [CEReactions, ReflectURL] attribute USVString src;
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

// https://html.spec.whatwg.org/multipage/obsolete.html#HTMLIFrameElement-partial
partial interface HTMLIFrameElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect] attribute DOMString scrolling;
  [CEReactions, Reflect] attribute DOMString frameBorder;
  [CEReactions, ReflectURL] attribute USVString longDesc;

  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString marginHeight;
  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString marginWidth;
};
