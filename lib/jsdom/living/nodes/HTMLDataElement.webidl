[Exposed=Window,
 HTMLConstructor]
interface HTMLDataElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString value;
};
