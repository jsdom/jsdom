[Exposed=Window,
 HTMLConstructor]
interface HTMLModElement : HTMLElement {
  [CEReactions, ReflectURL] attribute USVString cite;
  [CEReactions, Reflect] attribute DOMString dateTime;
};
