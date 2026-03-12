// https://drafts.csswg.org/cssom/#the-csspagerule-interface
[Exposed=Window]
interface CSSPageRule : CSSGroupingRule {
  attribute CSSOMString selectorText;
  // TODO: change to `[SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;`
  // when `CSSStyleDeclaration` is converted to webidl2js.
  // TODO: use `CSSPageDescriptors` instead of `CSSStyleDeclaration` here.
  [SameObject] attribute any style;
};
