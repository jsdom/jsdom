[Exposed=Window,
 HTMLConstructor]
interface HTMLLinkElement : HTMLElement {
  [CEReactions] attribute USVString href;
  [CEReactions, Reflect] attribute DOMString? crossOrigin;
  [CEReactions, Reflect] attribute DOMString rel;
//  [CEReactions] attribute DOMString as; // (default "")
//  [SameObject, PutForwards=value] readonly attribute DOMTokenList relList;
  [CEReactions, Reflect] attribute DOMString media;
//  [CEReactions] attribute DOMString nonce;
//  [CEReactions] attribute DOMString integrity;
  [CEReactions, Reflect] attribute DOMString hreflang;
  [CEReactions, Reflect] attribute DOMString type;
//  [SameObject, PutForwards=value] readonly attribute DOMTokenList sizes;
//  [CEReactions] attribute DOMString referrerPolicy;
//  [CEReactions] attribute USVString scope;
//  [CEReactions] attribute DOMString workerType;
//  [CEReactions] attribute DOMString updateViaCache;

  // also has obsolete members
};
HTMLLinkElement implements LinkStyle;

partial interface HTMLLinkElement {
  [CEReactions, Reflect] attribute DOMString charset;
  [CEReactions, Reflect] attribute DOMString rev;
  [CEReactions, Reflect] attribute DOMString target;
};
