// https://drafts.csswg.org/css-animations/#interface-csskeyframerule
[Exposed=Window]
interface CSSKeyframeRule : CSSRule {
  attribute CSSOMString keyText;
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleProperties style;
};
