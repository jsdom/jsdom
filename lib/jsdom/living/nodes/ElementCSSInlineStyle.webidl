[NoInterfaceObject]
interface ElementCSSInlineStyle {
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style; // TODO: implement in ElementCSSInlineStyle-impl.js instead of in HTMLElement-impl.js
};

HTMLElement implements ElementCSSInlineStyle;
SVGElement implements ElementCSSInlineStyle;
