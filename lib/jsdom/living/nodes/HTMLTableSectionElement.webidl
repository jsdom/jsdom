[Exposed=Window,
 HTMLConstructor]
interface HTMLTableSectionElement : HTMLElement {
  [SameObject] readonly attribute HTMLCollection rows;
  HTMLElement insertRow(optional long index = -1);
  [CEReactions] void deleteRow(long index);

  // also has obsolete members
};

partial interface HTMLTableSectionElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect="char"] attribute DOMString ch;
  [CEReactions, Reflect="charoff"] attribute DOMString chOff;
  [CEReactions, Reflect] attribute DOMString vAlign;
};
