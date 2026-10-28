
// https://drafts.csswg.org/cssom-1/#cssstylerule
[Exposed=Window]
interface CSSStyleRule : CSSGroupingRule {
    attribute CSSOMString selectorText;
    [SameObject, PutForwards=cssText] readonly attribute CSSStyleProperties style;
};
