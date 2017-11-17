[Exposed=Window,
 HTMLConstructor]
interface HTMLHtmlElement : HTMLElement {
  // also has obsolete members
};

partial interface HTMLHtmlElement {
  [CEReactions, Reflect] attribute DOMString version;
};
