[Exposed=Window]
interface Element : Node {
  readonly attribute DOMString? namespaceURI;
  readonly attribute DOMString? prefix;
  readonly attribute DOMString localName;
  readonly attribute DOMString tagName;

  [Reflect] attribute DOMString id;
  [Reflect=class] attribute DOMString className;
  [SameObject, PutForwards=value] readonly attribute DOMTokenList classList;

  boolean hasAttributes();
  [SameObject] readonly attribute NamedNodeMap attributes;
  sequence<DOMString> getAttributeNames();
  DOMString? getAttribute(DOMString qualifiedName);
  DOMString? getAttributeNS(DOMString? namespace, DOMString localName);
  void setAttribute(DOMString qualifiedName, DOMString value);
  void setAttributeNS(DOMString? namespace, DOMString qualifiedName, DOMString value);
  void removeAttribute(DOMString qualifiedName);
  void removeAttributeNS(DOMString? namespace, DOMString localName);
  boolean hasAttribute(DOMString qualifiedName);
  boolean hasAttributeNS(DOMString? namespace, DOMString localName);

  Attr? getAttributeNode(DOMString qualifiedName);
  Attr? getAttributeNodeNS(DOMString? namespace, DOMString localName);
  Attr? setAttributeNode(Attr attr);
  Attr? setAttributeNodeNS(Attr attr);
  Attr removeAttributeNode(Attr attr);

//  Element? closest(DOMString selectors);
  boolean matches(DOMString selectors);
  boolean webkitMatchesSelector(DOMString selectors); // historical alias of .matches

  HTMLCollection getElementsByTagName(DOMString localName);
  HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
  HTMLCollection getElementsByClassName(DOMString classNames);
};

partial interface Element {
    [TreatNullAs=EmptyString]
                    attribute DOMString innerHTML;
    [TreatNullAs=EmptyString]
                    attribute DOMString outerHTML;
    void insertAdjacentHTML (DOMString position, DOMString text);
};

dictionary ScrollOptions {
    ScrollBehavior behavior = "auto";
};

enum ScrollLogicalPosition { "start", "center", "end", "nearest" };
dictionary ScrollIntoViewOptions : ScrollOptions {
  ScrollLogicalPosition block = "center";
  ScrollLogicalPosition inline = "center";
};

partial interface Element {
  [NewObject] sequence<DOMRect> getClientRects();
  [NewObject] DOMRect getBoundingClientRect();
//  void scrollIntoView();
//  void scrollIntoView((boolean or object) arg);
//  void scroll(optional ScrollToOptions options);
//  void scroll(unrestricted double x, unrestricted double y);
//  void scrollTo(optional ScrollToOptions options);
//  void scrollTo(unrestricted double x, unrestricted double y);
//  void scrollBy(optional ScrollToOptions options);
//  void scrollBy(unrestricted double x, unrestricted double y);
  attribute unrestricted double scrollTop;
  attribute unrestricted double scrollLeft;
  readonly attribute long scrollWidth;
  readonly attribute long scrollHeight;
  readonly attribute long clientTop;
  readonly attribute long clientLeft;
  readonly attribute long clientWidth;
  readonly attribute long clientHeight;
};
