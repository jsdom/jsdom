interface HTMLTableRowElement : HTMLElement {
  readonly attribute long rowIndex;
  readonly attribute long sectionRowIndex;
  [SameObject] readonly attribute HTMLCollection cells;
  HTMLElement insertCell(optional long index = -1);
  void deleteCell(long index);

  // also has obsolete members
};

partial interface HTMLTableRowElement {
  [Reflect] attribute DOMString align;
  [Reflect=char] attribute DOMString ch;
  [Reflect=charoff] attribute DOMString chOff;
  [Reflect] attribute DOMString vAlign;

  [Reflect, TreatNullAs=EmptyString] attribute DOMString bgColor;
};
