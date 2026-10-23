// https://dom.spec.whatwg.org/#documentorshadowroot
interface mixin DocumentOrShadowRoot {
};
Document includes DocumentOrShadowRoot;
ShadowRoot includes DocumentOrShadowRoot;

// https://html.spec.whatwg.org/multipage/dom.html#documentorshadowroot
partial interface mixin DocumentOrShadowRoot {
  readonly attribute Element? activeElement;
};

// https://drafts.csswg.org/cssom/#extensions-to-the-document-or-shadow-root-interface
partial interface mixin DocumentOrShadowRoot {
  [SameObject] readonly attribute StyleSheetList styleSheets;
};
