// https://drafts.csswg.org/css-animations/#interface-csskeyframerule
[Exposed=Window]
interface CSSKeyframeRule : CSSRule {
  attribute CSSOMString keyText;
  // TODO: change to `[SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;`
  // when `CSSStyleDeclaration` is converted to webidl2js.
  // TODO: use `CSSStyleProperties` instead of `CSSStyleDeclaration` here.
  [SameObject] attribute any style;
};
