[Exposed=Window,
 NoInterfaceObject]
interface ElementCSSInlineStyle {
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;
};

HTMLElement implements ElementCSSInlineStyle;
SVGElement implements ElementCSSInlineStyle;
