
// https://drafts.csswg.org/css-conditional-5/#csscontainerrule
[Exposed=Window]
interface CSSContainerRule : CSSConditionRule {
    readonly attribute FrozenArray<CSSContainerCondition> conditions;
    readonly attribute CSSOMString containerName;
    readonly attribute CSSOMString containerQuery;
};

// https://drafts.csswg.org/css-conditional-5/#dictdef-csscontainercondition
dictionary CSSContainerCondition {
    required CSSOMString name;
    required CSSOMString query;
};
