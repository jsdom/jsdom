[Exposed=Window,
 HTMLConstructor]
interface HTMLModElement : HTMLElement {
  [CEReactions] attribute USVString cite;
  [CEReactions, Reflect] attribute DOMString dateTime;
};
