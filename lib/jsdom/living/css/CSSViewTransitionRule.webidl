
// https://drafts.csswg.org/css-view-transitions-2/#cssviewtransitionrule
[Exposed=Window]
interface CSSViewTransitionRule : CSSRule {
    readonly attribute CSSOMString navigation;
    [SameObject] readonly attribute FrozenArray<CSSOMString> types;
};
