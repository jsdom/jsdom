interface HTMLTableElement : HTMLElement {
  attribute HTMLTableCaptionElement? caption;
  HTMLTableCaptionElement createCaption();
  void deleteCaption();
  attribute HTMLTableSectionElement? tHead;
  HTMLTableSectionElement createTHead();
  void deleteTHead();
  attribute HTMLTableSectionElement? tFoot;
  HTMLTableSectionElement createTFoot();
  void deleteTFoot();
  [SameObject] readonly attribute HTMLCollection tBodies;
  HTMLTableSectionElement createTBody();
  [SameObject] readonly attribute HTMLCollection rows;
  HTMLTableRowElement insertRow(optional long index = -1);
  void deleteRow(long index);
//  attribute boolean sortable;
//  void stopSorting();

  // also has obsolete members
};

partial interface HTMLTableElement {
  [Reflect] attribute DOMString align;
  [Reflect] attribute DOMString border;
  [Reflect] attribute DOMString frame;
  [Reflect] attribute DOMString rules;
  [Reflect] attribute DOMString summary;
  [Reflect] attribute DOMString width;

  [Reflect, TreatNullAs=EmptyString] attribute DOMString bgColor;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString cellPadding;
  [Reflect, TreatNullAs=EmptyString] attribute DOMString cellSpacing;
};
