[Exposed=Window,
 HTMLConstructor]
interface HTMLTableColElement : HTMLElement {
  [CEReactions, Reflect, ReflectRange=(1,1000), ReflectDefault=1] attribute unsigned long span;

  // also has obsolete members
};

partial interface HTMLTableColElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect="char"] attribute DOMString ch;
  [CEReactions, Reflect="charoff"] attribute DOMString chOff;
  [CEReactions, Reflect] attribute DOMString vAlign;
  [CEReactions, Reflect] attribute DOMString width;
};
