
// https://drafts.csswg.org/cssom-1/#csspagerule
[Exposed=Window]
interface CSSPageRule : CSSGroupingRule {
    attribute CSSOMString selectorText;
    [SameObject, PutForwards=cssText] readonly attribute CSSPageDescriptors style;
};
