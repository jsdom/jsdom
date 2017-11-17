[Exposed=Window,
 HTMLConstructor]
interface HTMLElement : Element {
  // metadata attributes
  [CEReactions, Reflect] attribute DOMString title;
  [CEReactions, Reflect] attribute DOMString lang;
//  [CEReactions] attribute boolean translate;
  [CEReactions] attribute DOMString dir;
  [SameObject] readonly attribute DOMStringMap dataset;

  // user interaction
  [CEReactions, Reflect] attribute boolean hidden;
  void click();
  [CEReactions] attribute long tabIndex;
//  We don't support FocusOptions yet
//  void focus(optional FocusOptions options);
  void focus();
  void blur();
  [CEReactions, Reflect] attribute DOMString accessKey;
//  readonly attribute DOMString accessKeyLabel;
//  [CEReactions] attribute boolean draggable;
//  [CEReactions] attribute boolean spellcheck;

//  [CEReactions] attribute [TreatNullAs=EmptyString] DOMString innerText;
};

HTMLElement implements GlobalEventHandlers;
// HTMLElement implements DocumentAndElementEventHandlers;
HTMLElement implements ElementContentEditable;

// https://drafts.csswg.org/cssom-view/#extensions-to-the-htmlelement-interface
partial interface HTMLElement {
  readonly attribute Element? offsetParent;
  readonly attribute long offsetTop;
  readonly attribute long offsetLeft;
  readonly attribute long offsetWidth;
  readonly attribute long offsetHeight;
};
