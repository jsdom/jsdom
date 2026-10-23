
// https://drafts.csswg.org/css-anchor-position-1/#csspositiontryrule
[Exposed=Window]
interface CSSPositionTryRule : CSSRule {
    readonly attribute CSSOMString name;
    [SameObject, PutForwards=cssText] readonly attribute CSSPositionTryDescriptors style;
};
