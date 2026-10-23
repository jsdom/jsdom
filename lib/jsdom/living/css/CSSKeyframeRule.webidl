
// https://drafts.csswg.org/css-animations-1/#csskeyframerule
[Exposed=Window]
interface CSSKeyframeRule : CSSRule {
    attribute CSSOMString keyText;
    [SameObject, PutForwards=cssText] readonly attribute CSSStyleProperties style;
};
