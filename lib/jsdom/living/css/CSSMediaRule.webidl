
// https://drafts.csswg.org/css-conditional-3/#cssmediarule
[Exposed=Window]
interface CSSMediaRule : CSSConditionRule {
    [SameObject, PutForwards=mediaText] readonly attribute MediaList media;
    readonly attribute boolean matches;
};
