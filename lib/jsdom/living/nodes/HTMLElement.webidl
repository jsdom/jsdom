// https://html.spec.whatwg.org/multipage/dom.html#htmlelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLElement : Element {
  // metadata attributes
  [CEReactions, Reflect] attribute DOMString title;
  [CEReactions, Reflect] attribute DOMString lang;
  [CEReactions] attribute boolean translate;
  [CEReactions] attribute DOMString dir;

  // user interaction
  [CEReactions, Reflect] attribute boolean hidden;
  void click();
  [CEReactions, Reflect] attribute DOMString accessKey;
//  readonly attribute DOMString accessKeyLabel;
  [CEReactions] attribute boolean draggable;
//  [CEReactions] attribute boolean spellcheck;
//  [CEReactions] attribute DOMString autocapitalize;

//  [CEReactions] attribute [LegacyNullToEmptyString] DOMString innerText;

//  ElementInternals attachInternals();
};

HTMLElement includes GlobalEventHandlers;
// HTMLElement includes DocumentAndElementEventHandlers;
HTMLElement includes ElementContentEditable;
HTMLElement includes HTMLOrSVGElement;

// https://drafts.csswg.org/cssom-view/#extensions-to-the-htmlelement-interface
partial interface HTMLElement {
  readonly attribute Element? offsetParent;
  readonly attribute long offsetTop;
  readonly attribute long offsetLeft;
  readonly attribute long offsetWidth;
  readonly attribute long offsetHeight;
};
