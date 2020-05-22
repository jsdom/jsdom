// https://html.spec.whatwg.org/multipage/obsolete.html#htmlfontelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLFontElement : HTMLElement {
  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString color;
  [CEReactions, Reflect] attribute DOMString face;
  [CEReactions, Reflect] attribute DOMString size;
};
