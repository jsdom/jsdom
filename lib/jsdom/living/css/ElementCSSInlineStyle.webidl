// https://drafts.csswg.org/cssom/#elementcssinlinestyle
interface mixin ElementCSSInlineStyle {
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleProperties style;
};

HTMLElement includes ElementCSSInlineStyle;
SVGElement includes ElementCSSInlineStyle;
