// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGPathSegList.webidl

interface SVGPathSegList {
  readonly attribute unsigned long numberOfItems;
  [Throws]
  void clear();
  [Throws]
  SVGPathSeg initialize(SVGPathSeg newItem);
  [Throws]
  getter SVGPathSeg getItem(unsigned long index);
  [Throws]
  SVGPathSeg insertItemBefore(SVGPathSeg newItem, unsigned long index);
  [Throws]
  SVGPathSeg replaceItem(SVGPathSeg newItem, unsigned long index);
  [Throws]
  SVGPathSeg removeItem(unsigned long index);
  [Throws]
  SVGPathSeg appendItem(SVGPathSeg newItem);
};
