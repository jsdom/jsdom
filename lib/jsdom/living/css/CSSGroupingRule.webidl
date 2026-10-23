
// https://drafts.csswg.org/cssom-1/#cssgroupingrule
[Exposed=Window]
interface CSSGroupingRule : CSSRule {
    [SameObject] readonly attribute CSSRuleList cssRules;
    undefined deleteRule(unsigned long index);
    unsigned long insertRule(CSSOMString rule, optional unsigned long index = 0);
};
