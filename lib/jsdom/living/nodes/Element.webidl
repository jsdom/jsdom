// https://dom.spec.whatwg.org/#element
[Exposed=Window]
interface Element : Node {
  readonly attribute DOMString? namespaceURI;
  readonly attribute DOMString? prefix;
  readonly attribute DOMString localName;
  readonly attribute DOMString tagName;

  [CEReactions, Reflect] attribute DOMString id;
  [CEReactions, Reflect="class"] attribute DOMString className;
  [SameObject, PutForwards=value] readonly attribute DOMTokenList classList;
  [CEReactions, Unscopable, Reflect] attribute DOMString slot;

  boolean hasAttributes();
  [SameObject] readonly attribute NamedNodeMap attributes;
  sequence<DOMString> getAttributeNames();
  DOMString? getAttribute(DOMString qualifiedName);
  DOMString? getAttributeNS(DOMString? namespace, DOMString localName);
  [CEReactions] undefined setAttribute(DOMString qualifiedName, DOMString value);
  [CEReactions] undefined setAttributeNS(DOMString? namespace, DOMString qualifiedName, DOMString value);
  [CEReactions] undefined removeAttribute(DOMString qualifiedName);
  [CEReactions] undefined removeAttributeNS(DOMString? namespace, DOMString localName);
  [CEReactions] boolean toggleAttribute(DOMString qualifiedName, optional boolean force);
  boolean hasAttribute(DOMString qualifiedName);
  boolean hasAttributeNS(DOMString? namespace, DOMString localName);

  Attr? getAttributeNode(DOMString qualifiedName);
  Attr? getAttributeNodeNS(DOMString? namespace, DOMString localName);
  [CEReactions] Attr? setAttributeNode(Attr attr);
  [CEReactions] Attr? setAttributeNodeNS(Attr attr);
  [CEReactions] Attr removeAttributeNode(Attr attr);

  boolean checkVisibility(optional CheckVisibilityOptions options = {});

  ShadowRoot attachShadow(ShadowRootInit init);
  readonly attribute ShadowRoot? shadowRoot;

  Element? closest(DOMString selectors);
  boolean matches(DOMString selectors);
  boolean webkitMatchesSelector(DOMString selectors); // historical alias of .matches

  HTMLCollection getElementsByTagName(DOMString qualifiedName);
  HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
  HTMLCollection getElementsByClassName(DOMString classNames);

  [CEReactions] Element? insertAdjacentElement(DOMString where, Element element); // historical
  undefined insertAdjacentText(DOMString where, DOMString data); // historical
};

dictionary ShadowRootInit {
  required ShadowRootMode mode;
};

// https://w3c.github.io/DOM-Parsing/#extensions-to-the-element-interface
partial interface Element {
  [CEReactions] attribute [LegacyNullToEmptyString] DOMString outerHTML;
  [CEReactions] undefined insertAdjacentHTML(DOMString position, DOMString text);
};

// https://drafts.csswg.org/cssom-view/#extension-to-the-element-interface
enum ScrollBehavior { "auto", "instant", "smooth" };

dictionary ScrollOptions {
    ScrollBehavior behavior = "auto";
};

enum ScrollLogicalPosition { "start", "center", "end", "nearest" };

dictionary ScrollIntoViewOptions : ScrollOptions {
  ScrollLogicalPosition block = "start";
  ScrollLogicalPosition inline = "nearest";
};

dictionary CheckVisibilityOptions {
  boolean contentVisibilityAuto = false;
  boolean opacityProperty = false;
  boolean visibilityProperty = false;
  boolean checkOpacity = false;
  boolean checkVisibilityCSS = false;
};

partial interface Element {
  DOMRectList getClientRects();
  [NewObject] DOMRect getBoundingClientRect();
//  undefined scrollIntoView(optional (boolean or ScrollIntoViewOptions) arg);
//  undefined scroll(optional ScrollToOptions options = {});
//  undefined scroll(unrestricted double x, unrestricted double y);
//  undefined scrollTo(optional ScrollToOptions options = {});
//  undefined scrollTo(unrestricted double x, unrestricted double y);
//  undefined scrollBy(optional ScrollToOptions options = {});
//  undefined scrollBy(unrestricted double x, unrestricted double y);
  attribute unrestricted double scrollTop;
  attribute unrestricted double scrollLeft;
  readonly attribute long scrollWidth;
  readonly attribute long scrollHeight;
  readonly attribute long clientTop;
  readonly attribute long clientLeft;
  readonly attribute long clientWidth;
  readonly attribute long clientHeight;
};

Element includes ARIAMixin;
