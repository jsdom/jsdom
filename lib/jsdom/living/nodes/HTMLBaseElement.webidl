[Exposed=Window,
 HTMLConstructor]
interface HTMLBaseElement : HTMLElement {
  [CEReactions] attribute USVString href;
  [CEReactions, Reflect] attribute DOMString target;
};
