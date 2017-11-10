// https://svgwg.org/svg2-draft/types.html#InterfaceSVGStringList
interface SVGStringList {

  readonly attribute unsigned long length;
  readonly attribute unsigned long numberOfItems;

  void clear();
  DOMString initialize(DOMString newItem);
  getter DOMString getItem(unsigned long index);
  DOMString insertItemBefore(DOMString newItem, unsigned long index);
  DOMString replaceItem(DOMString newItem, unsigned long index);
  DOMString removeItem(unsigned long index);
  DOMString appendItem(DOMString newItem);
  setter void (unsigned long index, DOMString newItem);
};
