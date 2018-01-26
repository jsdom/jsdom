// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGPointList.webidl

interface SVGPointList {
  readonly attribute unsigned long numberOfItems;
  [Throws]
  void clear();
  [Throws]
  SVGPoint initialize(SVGPoint newItem);
  [Throws]
  getter SVGPoint getItem(unsigned long index);
  [Throws]
  SVGPoint insertItemBefore(SVGPoint newItem, unsigned long index);
  [Throws]
  SVGPoint replaceItem(SVGPoint newItem, unsigned long index);
  [Throws]
  SVGPoint removeItem(unsigned long index);
  [Throws]
  SVGPoint appendItem(SVGPoint newItem);
};
