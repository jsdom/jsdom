[Exposed=Window,
 HTMLConstructor]
interface HTMLModElement : HTMLElement {
  [CEReactions, Reflect] attribute USVString cite;
  [CEReactions, Reflect] attribute DOMString dateTime;
};
