[Exposed=Window,
 HTMLConstructor]
interface HTMLAreaElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString alt;
  [CEReactions, Reflect] attribute DOMString coords;
  [CEReactions, Reflect] attribute DOMString shape;
  [CEReactions, Reflect] attribute DOMString target;
//  [CEReactions] attribute DOMString download;
//  [CEReactions] attribute USVString ping;
  [CEReactions, Reflect] attribute DOMString rel;
//  [SameObject, PutForwards=value] readonly attribute DOMTokenList relList;
//  [CEReactions] attribute DOMString referrerPolicy;

  // also has obsolete members
};
HTMLAreaElement implements HTMLHyperlinkElementUtils;

partial interface HTMLAreaElement {
  [CEReactions, Reflect] attribute boolean noHref;
};
