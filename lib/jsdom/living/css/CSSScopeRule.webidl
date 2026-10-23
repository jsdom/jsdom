
// https://drafts.csswg.org/css-cascade-6/#cssscoperule
[Exposed=Window]
interface CSSScopeRule : CSSGroupingRule {
    readonly attribute CSSOMString? end;
    readonly attribute CSSOMString? start;
};
