// https://drafts.csswg.org/css-nesting-1/#the-cssnesteddeclarations-interface
[Exposed=Window]
interface CSSNestedDeclarations : CSSRule {
  // TODO: change to [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;
  // when CSSStyleDeclaration is converted to webidl2js.
  [SameObject] attribute any style;
};
