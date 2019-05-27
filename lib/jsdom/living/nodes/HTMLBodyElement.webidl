// https://html.spec.whatwg.org/#htmlbodyelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLBodyElement : HTMLElement {
  // also has obsolete members
};

HTMLBodyElement includes WindowEventHandlers;

// https://html.spec.whatwg.org/#HTMLBodyElement-partial
partial interface HTMLBodyElement {
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString text;
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString link;
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString vLink;
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString aLink;
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString bgColor;
  [CEReactions, Reflect] attribute DOMString background;
};
