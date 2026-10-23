
// https://drafts.csswg.org/css-animations-1/#csskeyframesrule
[Exposed=Window]
interface CSSKeyframesRule : CSSRule {

    getter CSSKeyframeRule (unsigned long index);

    readonly attribute CSSRuleList cssRules;
    readonly attribute unsigned long length;
    attribute CSSOMString name;

    undefined appendRule(CSSOMString rule);
    undefined deleteRule(CSSOMString select);
    CSSKeyframeRule? findRule(CSSOMString select);
};
