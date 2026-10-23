
// https://drafts.csswg.org/css-conditional-3/#csssupportsrule
[Exposed=Window]
interface CSSSupportsRule : CSSConditionRule {
    readonly attribute boolean matches;
};
