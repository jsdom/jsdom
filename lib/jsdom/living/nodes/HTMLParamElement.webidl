[Exposed=Window,
 HTMLConstructor]
interface HTMLParamElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString name;
  [CEReactions, Reflect] attribute DOMString value;

  // also has obsolete members
};

partial interface HTMLParamElement {
  [CEReactions, Reflect] attribute DOMString type;
  [CEReactions, Reflect] attribute DOMString valueType;
};
