[Exposed=Window,
 HTMLConstructor]
interface HTMLSourceElement : HTMLElement {
  [CEReactions] attribute USVString src;
  [CEReactions, Reflect] attribute DOMString type;
  [CEReactions] attribute USVString srcset;
  [CEReactions, Reflect] attribute DOMString sizes;
  [CEReactions, Reflect] attribute DOMString media;
};
