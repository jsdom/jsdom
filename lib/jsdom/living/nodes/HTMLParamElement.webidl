interface HTMLParamElement : HTMLElement {
  [Reflect] attribute DOMString name;
  [Reflect] attribute DOMString value;

  // also has obsolete members
};

partial interface HTMLParamElement {
  [Reflect] attribute DOMString type;
  [Reflect] attribute DOMString valueType;
};
