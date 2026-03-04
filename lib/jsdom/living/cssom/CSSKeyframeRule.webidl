// https://drafts.csswg.org/css-animations-1/#interface-csskeyframerule
[Exposed=Window]
interface CSSKeyframeRule : CSSRule {
  attribute CSSOMString keyText;
  // TODO: change to [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;
  // when CSSStyleDeclaration is converted to webidl2js.
  [SameObject] attribute any style;
};
