// https://html.spec.whatwg.org/multipage/window-object.html#the-window-object
[Global=Window,
 Exposed=Window,
 LegacyUnenumerableNamedProperties]
interface Window : EventTarget {
  // the current browsing context
  [Unforgeable] readonly attribute WindowProxy window;
  [Replaceable] readonly attribute WindowProxy self;
  [Unforgeable] readonly attribute Document document;
  attribute DOMString name;
  [PutForwards=href, Unforgeable] readonly attribute Location location;
  readonly attribute History history;
  readonly attribute CustomElementRegistry customElements;
  [Replaceable] readonly attribute BarProp locationbar;
  [Replaceable] readonly attribute BarProp menubar;
  [Replaceable] readonly attribute BarProp personalbar;
  [Replaceable] readonly attribute BarProp scrollbars;
  [Replaceable] readonly attribute BarProp statusbar;
  [Replaceable] readonly attribute BarProp toolbar;
  attribute DOMString status;
  void close();
  readonly attribute boolean closed;
  void stop();
  void focus();
  void blur();

  // other browsing contexts
  [Replaceable] readonly attribute WindowProxy frames;
  [Replaceable] readonly attribute unsigned long length;
  [Unforgeable] readonly attribute WindowProxy? top;
  attribute any opener;
  [Replaceable] readonly attribute WindowProxy? parent;
  readonly attribute Element? frameElement;
  WindowProxy? open(optional USVString url = "", optional DOMString target = "_blank", optional [TreatNullAs=EmptyString] DOMString features = "");
  getter object (DOMString name);
  // Since this is the global object, the IDL named getter adds a NamedPropertiesObject exotic
  // object on the prototype chain. Indeed, this does not make the global object an exotic object.
  // Indexed access is taken care of by the WindowProxy exotic object.

  // the user agent
  readonly attribute Navigator navigator;
  // [SecureContext] readonly attribute ApplicationCache applicationCache;

  // user prompts
  void alert();
  void alert(DOMString message);
  boolean confirm(optional DOMString message = "");
  DOMString? prompt(optional DOMString message = "", optional DOMString default = "");
  void print();

  void postMessage(any message, optional (USVString or WindowPostMessageOptions) options);
  // void postMessage(any message, USVString targetOrigin, optional sequence<object> transfer = []);
};
Window includes GlobalEventHandlers;
Window includes WindowEventHandlers;

dictionary WindowPostMessageOptions /* : PostMessageOptions */ {
  USVString targetOrigin = "/";
};

// https://html.spec.whatwg.org/multipage/obsolete.html#Window-partial
partial interface Window {
  void captureEvents();
  void releaseEvents();

  [Replaceable, SameObject] readonly attribute External external;
};

// https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute
interface mixin WindowLocalStorage {
  readonly attribute Storage localStorage;
};
Window includes WindowLocalStorage;

// https://html.spec.whatwg.org/multipage/webstorage.html#the-sessionstorage-attribute
interface mixin WindowSessionStorage {
  readonly attribute Storage sessionStorage;
};
Window includes WindowSessionStorage;

typedef DOMString CSSOMString;

// https://drafts.csswg.org/cssom/#extensions-to-the-window-interface
partial interface Window {
  [NewObject] CSSStyleDeclaration getComputedStyle(Element elt, optional CSSOMString? pseudoElt);
};

// https://drafts.csswg.org/cssom-view/#extensions-to-the-window-interface
enum ScrollBehavior { "auto", "smooth" };

dictionary ScrollOptions {
  ScrollBehavior behavior = "auto";
};
dictionary ScrollToOptions : ScrollOptions {
  unrestricted double left;
  unrestricted double top;
};

partial interface Window {
  // [NewObject] MediaQueryList matchMedia(CSSOMString query);
  [SameObject, Replaceable] readonly attribute Screen screen;

  // browsing context
  void moveTo(long x, long y);
  void moveBy(long x, long y);
  void resizeTo(long width, long height);
  void resizeBy(long x, long y);

  // viewport
  [Replaceable] readonly attribute long innerWidth;
  [Replaceable] readonly attribute long innerHeight;

  // viewport scrolling
  [Replaceable] readonly attribute double scrollX;
  [Replaceable] readonly attribute double pageXOffset;
  [Replaceable] readonly attribute double scrollY;
  [Replaceable] readonly attribute double pageYOffset;
  void scroll(optional ScrollToOptions options = {});
  void scroll(unrestricted double x, unrestricted double y);
  void scrollTo(optional ScrollToOptions options = {});
  void scrollTo(unrestricted double x, unrestricted double y);
  void scrollBy(optional ScrollToOptions options = {});
  void scrollBy(unrestricted double x, unrestricted double y);

  // client
  [Replaceable] readonly attribute long screenX;
  [Replaceable] readonly attribute long screenLeft;
  [Replaceable] readonly attribute long screenY;
  [Replaceable] readonly attribute long screenTop;
  [Replaceable] readonly attribute long outerWidth;
  [Replaceable] readonly attribute long outerHeight;
  [Replaceable] readonly attribute double devicePixelRatio;
};

// https://www.w3.org/TR/navigation-timing/#sec-window.performance-attribute
partial interface Window {
  [Replaceable] readonly attribute Performance performance;
};

// https://w3c.github.io/selection-api/#extensions-to-window-interface
partial interface Window {
  Selection? getSelection();
};
