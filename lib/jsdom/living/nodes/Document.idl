[Constructor,
 Exposed=Window]
interface Document : Node {
  [SameObject] readonly attribute DOMImplementation implementation;
  readonly attribute DOMString URL;
  readonly attribute DOMString documentURI;
  readonly attribute DOMString origin;
  readonly attribute DOMString compatMode;
  readonly attribute DOMString characterSet;
  readonly attribute DOMString charset; // historical alias of .characterSet
  readonly attribute DOMString inputEncoding; // historical alias of .characterSet
  readonly attribute DOMString contentType;

  readonly attribute DocumentType? doctype;
  readonly attribute Element? documentElement;
  HTMLCollection getElementsByTagName(DOMString localName);
  HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
  HTMLCollection getElementsByClassName(DOMString classNames);

  [NewObject] Element createElement(DOMString localName);
  [NewObject] Element createElementNS(DOMString? namespace, DOMString qualifiedName);
  [NewObject] DocumentFragment createDocumentFragment();
  [NewObject] Text createTextNode(DOMString data);
  [NewObject] CDATASection createCDATASection(DOMString data);
  [NewObject] Comment createComment(DOMString data);
  [NewObject] ProcessingInstruction createProcessingInstruction(DOMString target, DOMString data);

  [NewObject] Node importNode(Node node, optional boolean deep = false);
  Node adoptNode(Node node);

  [NewObject] Attr createAttribute(DOMString localName);
  [NewObject] Attr createAttributeNS(DOMString? namespace, DOMString qualifiedName);

  [NewObject] Event createEvent(DOMString interface);

//  [NewObject] Range createRange();

  // NodeFilter.SHOW_ALL = 0xFFFFFFFF
  [NewObject] NodeIterator createNodeIterator(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);
  [NewObject] TreeWalker createTreeWalker(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);
};

[OverrideBuiltins]
partial /*sealed*/ interface Document {
  // resource metadata management
  [PutForwards=href, Unforgeable] readonly attribute Location? location;
//  attribute DOMString domain;
  readonly attribute DOMString referrer;
  attribute DOMString cookie;
  readonly attribute DOMString lastModified;
  readonly attribute DocumentReadyState readyState;

  // DOM tree accessors
//  getter object (DOMString name);
  attribute DOMString title;
  attribute DOMString dir;
  attribute HTMLElement? body;
  readonly attribute HTMLHeadElement? head;
  [SameObject] readonly attribute HTMLCollection images;
  [SameObject] readonly attribute HTMLCollection embeds;
  [SameObject] readonly attribute HTMLCollection plugins;
  [SameObject] readonly attribute HTMLCollection links;
  [SameObject] readonly attribute HTMLCollection forms;
  [SameObject] readonly attribute HTMLCollection scripts;
  NodeList getElementsByName(DOMString elementName);
  readonly attribute HTMLScriptElement? currentScript;

  // dynamic markup insertion
  Document open(optional DOMString type = "text/html", optional DOMString replace = "");
//  WindowProxy open(DOMString url, DOMString name, DOMString features, optional boolean replace = false);
  void close();
  void write(DOMString... text);
  void writeln(DOMString... text);

  // user interaction
  readonly attribute WindowProxy? defaultView;
  readonly attribute Element? activeElement;
  boolean hasFocus();
//  attribute DOMString designMode;
//  boolean execCommand(DOMString commandId, optional boolean showUI = false, optional DOMString value = "");
//  boolean queryCommandEnabled(DOMString commandId);
//  boolean queryCommandIndeterm(DOMString commandId);
//  boolean queryCommandState(DOMString commandId);
//  boolean queryCommandSupported(DOMString commandId);
//  DOMString queryCommandValue(DOMString commandId);

  // special event handler IDL attributes that only apply to Document objects
  [LenientThis] attribute EventHandler onreadystatechange;

  // also has obsolete members
};
Document implements GlobalEventHandlers;

partial interface Document {
//  [TreatNullAs=EmptyString] attribute DOMString fgColor;
//  [TreatNullAs=EmptyString] attribute DOMString linkColor;
//  [TreatNullAs=EmptyString] attribute DOMString vlinkColor;
//  [TreatNullAs=EmptyString] attribute DOMString alinkColor;
//  [TreatNullAs=EmptyString] attribute DOMString bgColor;

  [SameObject] readonly attribute HTMLCollection anchors;
  [SameObject] readonly attribute HTMLCollection applets;

  void clear();
  void captureEvents();
  void releaseEvents();

//  [SameObject] readonly attribute HTMLAllCollection all;
};

// https://drafts.csswg.org/cssom/#extensions-to-the-document-interface
partial interface Document {
  [SameObject] readonly attribute StyleSheetList styleSheets;
};

// http://w3c.github.io/page-visibility/
enum VisibilityState { "hidden", "visible", "prerender" };

partial interface Document {
  readonly attribute boolean hidden;
  readonly attribute VisibilityState visibilityState;
  attribute EventHandler onvisibilitychange;
};
