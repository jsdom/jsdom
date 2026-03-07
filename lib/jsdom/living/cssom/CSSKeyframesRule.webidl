// https://drafts.csswg.org/css-animations/#interface-csskeyframesrule
[Exposed=Window]
interface CSSKeyframesRule : CSSRule {
  attribute CSSOMString name;
  [SameObject] readonly attribute CSSRuleList cssRules;
  readonly attribute unsigned long length;
  getter CSSKeyframeRule (unsigned long index);
  undefined appendRule(CSSOMString rule);
  undefined deleteRule(CSSOMString select);
  CSSKeyframeRule? findRule(CSSOMString select);
};
