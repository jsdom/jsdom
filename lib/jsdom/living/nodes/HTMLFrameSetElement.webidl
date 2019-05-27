// https://html.spec.whatwg.org/#htmlframesetelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLFrameSetElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString cols;
  [CEReactions, Reflect] attribute DOMString rows;
};
HTMLFrameSetElement includes WindowEventHandlers;
