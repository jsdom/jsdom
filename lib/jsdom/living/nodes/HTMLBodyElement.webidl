interface HTMLBodyElement : HTMLElement {

  // also has obsolete members
};
HTMLBodyElement implements WindowEventHandlers;

partial interface HTMLBodyElement {
  [Reflect, TreatNullAs=EmptyString] attribute DOMString text;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString link;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString vLink;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString aLink;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString bgColor;
  [Reflect] attribute DOMString background;
};
