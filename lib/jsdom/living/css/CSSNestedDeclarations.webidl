// https://drafts.csswg.org/css-nesting/#the-cssnestrule
[Exposed=Window]
interface CSSNestedDeclarations : CSSRule {
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleProperties style;
};
