[Exposed=Window,
 HTMLConstructor]
interface HTMLTableColElement : HTMLElement {
  [CEReactions, Reflect] attribute unsigned long span; // TODO: limited to only non-negative numbers greater than zero

  // also has obsolete members
};

partial interface HTMLTableColElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect="char"] attribute DOMString ch;
  [CEReactions, Reflect="charoff"] attribute DOMString chOff;
  [CEReactions, Reflect] attribute DOMString vAlign;
  [CEReactions, Reflect] attribute DOMString width;
};
