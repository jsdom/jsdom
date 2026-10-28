
// https://drafts.csswg.org/cssom-1/#cssmarginrule
[Exposed=Window]
interface CSSMarginRule : CSSRule {
    readonly attribute CSSOMString name;
    [SameObject, PutForwards=cssText] readonly attribute CSSMarginDescriptors style;
};
