// https://html.spec.whatwg.org/#htmlbodyelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLBodyElement : HTMLElement {
  // also has obsolete members
};

HTMLBodyElement includes WindowEventHandlers;

// https://html.spec.whatwg.org/#HTMLBodyElement-partial
partial interface HTMLBodyElement {
  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString text;
  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString link;
  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString vLink;
  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString aLink;
  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString bgColor;
  [CEReactions, Reflect] attribute DOMString background;
};
