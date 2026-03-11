// https://drafts.csswg.org/css-nesting/#the-cssnestrule
[Exposed=Window]
interface CSSNestedDeclarations : CSSRule {
  // TODO: change to `[SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;`
  // when `CSSStyleDeclaration` is converted to webidl2js.
  // TODO: use `CSSStyleProperties` instead of `CSSStyleDeclaration` here.
  [SameObject] attribute any style;
};
