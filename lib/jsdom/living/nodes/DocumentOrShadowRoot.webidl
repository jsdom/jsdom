// https://dom.spec.whatwg.org/#documentorshadowroot
interface mixin DocumentOrShadowRoot {
};
Document includes DocumentOrShadowRoot;
ShadowRoot includes DocumentOrShadowRoot;

// https://html.spec.whatwg.org/multipage/dom.html#documentorshadowroot
partial interface mixin DocumentOrShadowRoot {
  readonly attribute Element? activeElement;
};

// https://drafts.csswg.org/cssom/#dom-documentorshadowroot-adoptedstylesheets
partial interface mixin DocumentOrShadowRoot {
  [SameObject] readonly attribute StyleSheetList styleSheets;
  attribute ObservableArray<CSSStyleSheet> adoptedStyleSheets;
};