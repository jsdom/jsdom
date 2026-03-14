// https://drafts.csswg.org/cssom/#the-csspagerule-interface
[Exposed=Window]
interface CSSPageRule : CSSGroupingRule {
  attribute CSSOMString selectorText;

  // TODO: use `CSSPageDescriptors` instead of `CSSStyleDeclaration` here, per
  // https://drafts.csswg.org/cssom/#csspagedescriptors.
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;
};
