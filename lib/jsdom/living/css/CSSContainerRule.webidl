// https://drafts.csswg.org/css-conditional-5/#the-csscontainerrule-interface
[Exposed=Window]
interface CSSContainerRule : CSSConditionRule {
  readonly attribute CSSOMString containerName;
  readonly attribute CSSOMString containerQuery;
};
