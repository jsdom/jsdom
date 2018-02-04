// https://svgwg.org/svg2-draft/shapes.html#InterfaceSVGPointList

interface SVGPointList {
  readonly attribute unsigned long length;
  readonly attribute unsigned long numberOfItems;

  void clear();
  DOMPoint initialize(DOMPoint newItem);
  getter DOMPoint getItem(unsigned long index);
  DOMPoint insertItemBefore(DOMPoint newItem, unsigned long index);
  DOMPoint replaceItem(DOMPoint newItem, unsigned long index);
  DOMPoint removeItem(unsigned long index);
  DOMPoint appendItem(DOMPoint newItem);
  setter void (unsigned long index, DOMPoint newItem);
};
