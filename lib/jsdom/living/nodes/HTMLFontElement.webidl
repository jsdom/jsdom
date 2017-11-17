[Exposed=Window,
 HTMLConstructor]
interface HTMLFontElement : HTMLElement {
  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString color;
  [CEReactions, Reflect] attribute DOMString face;
  [CEReactions, Reflect] attribute DOMString size;
};
