// https://html.spec.whatwg.org/#htmllinkelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLLinkElement : HTMLElement {
  [CEReactions, ReflectURL] attribute USVString href;
  [CEReactions, Reflect] attribute DOMString? crossOrigin;
  [CEReactions, Reflect] attribute DOMString rel;
//  [CEReactions] attribute DOMString as; // (default "")
  [SameObject, PutForwards=value] readonly attribute DOMTokenList relList;
  [CEReactions, Reflect] attribute DOMString media;
//  [CEReactions] attribute DOMString integrity;
  [CEReactions, Reflect] attribute DOMString hreflang;
  [CEReactions, Reflect] attribute DOMString type;
//  [SameObject, PutForwards=value] readonly attribute DOMTokenList sizes;
//  [CEReactions] attribute USVString imageSrcset;
//  [CEReactions] attribute DOMString imageSizes;
//  [CEReactions] attribute DOMString referrerPolicy;

  // also has obsolete members
};
HTMLLinkElement includes LinkStyle;

// https://html.spec.whatwg.org/#HTMLLinkElement-partial
partial interface HTMLLinkElement {
  [CEReactions, Reflect] attribute DOMString charset;
  [CEReactions, Reflect] attribute DOMString rev;
  [CEReactions, Reflect] attribute DOMString target;
};
