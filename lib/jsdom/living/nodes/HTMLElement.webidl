interface HTMLElement : Element {
  // metadata attributes
  [Reflect] attribute DOMString title;
  [Reflect] attribute DOMString lang;
//  attribute boolean translate;
  attribute DOMString dir;
  [SameObject] readonly attribute DOMStringMap dataset;

  // user interaction
  [Reflect] attribute boolean hidden;
  void click();
  attribute long tabIndex;
  void focus();
  void blur();
  [Reflect] attribute DOMString accessKey;
//  readonly attribute DOMString accessKeyLabel;
//  attribute boolean draggable;
//  [PutForwards=value] readonly attribute DOMSettableTokenList dropzone;
//  attribute HTMLMenuElement? contextMenu;
//  attribute boolean spellcheck;
//  void forceSpellCheck();
};
HTMLElement implements GlobalEventHandlers;
HTMLElement implements ElementContentEditable;

// https://drafts.csswg.org/cssom-view/#extensions-to-the-htmlelement-interface
partial interface HTMLElement {
  readonly attribute Element? offsetParent;
  readonly attribute long offsetTop;
  readonly attribute long offsetLeft;
  readonly attribute long offsetWidth;
  readonly attribute long offsetHeight;
};
