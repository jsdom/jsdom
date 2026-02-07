// https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin
// https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-element-gethtml
dictionary GetHTMLOptions {
  boolean serializableShadowRoots = false;
  sequence<ShadowRoot> shadowRoots = [];
};

interface mixin InnerHTML {
  [CEReactions] attribute [LegacyNullToEmptyString] DOMString innerHTML;
  DOMString getHTML(optional GetHTMLOptions options = {});
};

Element includes InnerHTML;
ShadowRoot includes InnerHTML;
