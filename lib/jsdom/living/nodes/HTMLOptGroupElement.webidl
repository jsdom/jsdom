[Exposed=Window,
 HTMLConstructor]
interface HTMLOptGroupElement : HTMLElement {
  [CEReactions, Reflect] attribute boolean disabled;
  [CEReactions, Reflect] attribute DOMString label;
};
