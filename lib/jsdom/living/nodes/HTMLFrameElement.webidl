[Exposed=Window,
 HTMLConstructor]
interface HTMLFrameElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString name;
  [CEReactions, Reflect] attribute DOMString scrolling;
  [CEReactions] attribute USVString src;
  [CEReactions, Reflect] attribute DOMString frameBorder;
  [CEReactions] attribute USVString longDesc;
  [CEReactions, Reflect] attribute boolean noResize;
  readonly attribute Document? contentDocument;
  readonly attribute WindowProxy? contentWindow;

  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString marginHeight;
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString marginWidth;
};
