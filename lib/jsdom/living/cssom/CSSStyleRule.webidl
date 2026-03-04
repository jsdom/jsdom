// https://drafts.csswg.org/cssom/#the-cssstylerule-interface
// https://drafts.csswg.org/css-nesting-1/#cssom
[Exposed=Window]
interface CSSStyleRule : CSSGroupingRule {
  attribute CSSOMString selectorText;
  // readonly attribute StylePropertyMap styleMap;
  // TODO: change to [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;
  // when CSSStyleDeclaration is converted to webidl2js.
  [SameObject] attribute any style;
};
