// https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin
interface mixin InnerHTML {
  [CEReactions] attribute [LegacyNullToEmptyString] DOMString innerHTML;
};

Element includes InnerHTML;
ShadowRoot includes InnerHTML;
